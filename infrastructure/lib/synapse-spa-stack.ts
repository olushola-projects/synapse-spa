import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';

export interface SynapseSpaStackProps extends cdk.StackProps {
  environment: string;
}

export class SynapseSpaStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: SynapseSpaStackProps) {
    super(scope, id, props);

    const { environment } = props;

    // Domain configuration
    const domainName =
      environment === 'prod'
        ? 'synapse.digitalpasshub.com'
        : `synapse-${environment}.digitalpasshub.com`;
    const hostedZoneName = 'digitalpasshub.com';

    // Lookup existing hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: hostedZoneName
    });

    // Lookup existing certificate automatically
    const certificate = acm.Certificate.fromLookup(this, 'Certificate', {
      domainName: '*.digitalpasshub.com',
      region: 'us-east-1' // ACM certificates for CloudFront must be in us-east-1
    });

    // S3 Bucket for hosting the SPA
    this.bucket = new s3.Bucket(this, 'SynapseSpaS3Bucket', {
      bucketName: `synapse-spa-${environment}-${this.account}`,
      removalPolicy: environment === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: environment !== 'prod',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    // Origin Access Control for CloudFront
    const originAccessControl = new cloudfront.OriginAccessControl(this, 'OriginAccessControl', {
      description: `OAC for Synapse SPA ${environment}`,
      originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,
      signing: cloudfront.Signing.SIGV4_ALWAYS
    });

    // CloudFront Distribution
    this.distribution = new cloudfront.Distribution(this, 'SynapseSpaDistribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        compress: true,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS
      },
      domainNames: [domainName],
      certificate: certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(30)
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(30)
        }
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      enabled: true,
      comment: `Synapse SPA CloudFront Distribution - ${environment}`
    });

    // Update bucket policy to allow CloudFront OAC access
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'AllowCloudFrontServicePrincipal',
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        actions: ['s3:GetObject'],
        resources: [this.bucket.arnForObjects('*')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${this.distribution.distributionId}`
          }
        }
      })
    );

    // Route53 A record to point domain to CloudFront
    new route53.ARecord(this, 'SynapseAliasRecord', {
      zone: hostedZone,
      recordName: domainName,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(this.distribution)),
      comment: `A record for Synapse SPA ${environment}`
    });

    // Get environment-specific configuration from SSM parameters
    const apiBaseUrl = ssm.StringParameter.valueForStringParameter(
      this,
      `/synapse/${environment}/api-base-url`
    );

    const apiTimeout = ssm.StringParameter.valueForStringParameter(
      this,
      `/synapse/${environment}/api-timeout`
    );

    // Deploy the pre-built SPA
    const deployment = new s3deploy.BucketDeployment(this, 'SynapseSpaDeployment', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ['/*'],
      prune: true,
      metadata: {
        'Cache-Control': 'max-age=31536000' // 1 year for assets
      },
      exclude: ['index.html']
    });

    // Deploy index.html with shorter cache time
    new s3deploy.BucketDeployment(this, 'SynapseSpaIndexDeployment', {
      sources: [
        s3deploy.Source.asset('../dist', {
          exclude: ['*', '!index.html']
        })
      ],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ['/index.html'],
      prune: false,
      metadata: {
        'Cache-Control': 'max-age=300' // 5 minutes for index.html
      }
    });

    // Store outputs in SSM parameters for other stacks or applications
    new ssm.StringParameter(this, 'CloudFrontDomainNameParameter', {
      parameterName: `/synapse/${environment}/cloudfront-domain-name`,
      stringValue: this.distribution.distributionDomainName,
      description: `CloudFront domain name for Synapse SPA ${environment}`
    });

    new ssm.StringParameter(this, 'S3BucketNameParameter', {
      parameterName: `/synapse/${environment}/s3-bucket-name`,
      stringValue: this.bucket.bucketName,
      description: `S3 bucket name for Synapse SPA ${environment}`
    });

    new ssm.StringParameter(this, 'CloudFrontDistributionIdParameter', {
      parameterName: `/synapse/${environment}/cloudfront-distribution-id`,
      stringValue: this.distribution.distributionId,
      description: `CloudFront distribution ID for Synapse SPA ${environment}`
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 Bucket Name',
      exportName: `${this.stackName}-BucketName`
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront Distribution ID',
      exportName: `${this.stackName}-DistributionId`
    });

    new cdk.CfnOutput(this, 'DomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront Domain Name',
      exportName: `${this.stackName}-DomainName`
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${domainName}`,
      description: 'Website URL',
      exportName: `${this.stackName}-WebsiteURL`
    });

    new cdk.CfnOutput(this, 'CloudFrontURL', {
      value: `https://${this.distribution.distributionDomainName}`,
      description: 'CloudFront Distribution URL',
      exportName: `${this.stackName}-CloudFrontURL`
    });
  }
}
