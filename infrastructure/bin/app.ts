#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SynapseSpaStack } from '../lib/synapse-spa-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
};

// Get environment from context or default to 'dev'
const environment = app.node.tryGetContext('environment') || 'dev';

new SynapseSpaStack(app, `SynapseSpa-${environment}`, {
  env,
  environment,
  description: `Synapse SPA deployment for ${environment} environment`,
  tags: {
    Environment: environment,
    Project: 'Synapse',
    ManagedBy: 'CDK'
  }
});
