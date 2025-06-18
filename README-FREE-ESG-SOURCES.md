# Free ESG Data Sources Integration

🌍 **Democratizing ESG Data Access for GRC Professionals**

This integration brings free, high-quality ESG (Environmental, Social, Governance) data sources into the Synapses SFDR Navigator Agent, enabling GRC professionals to access comprehensive sustainability data without premium subscriptions.

## 🚀 Quick Start

### 1. Setup & Configuration

```bash
# Run the automated setup script
npm run esg:setup

# For detailed logging
npm run esg:setup:verbose
```

### 2. Run Examples

```bash
# See comprehensive usage examples
npm run esg:examples

# Run specific analyses
npm run esg:worldbank    # World Bank sovereign ESG data
npm run esg:alphavantage  # Alpha Vantage corporate ESG data
npm run esg:sfdr         # SFDR compliance analysis
```

### 3. Validate Integration

```bash
# Test API connectivity
npm run esg:validate

# Run integration tests
npm run esg:test
```

## 📊 Data Sources Overview

### 🏛️ World Bank Open Data
- **Coverage**: 200+ countries, sovereign ESG indicators
- **Cost**: Completely free
- **Rate Limits**: None
- **Data Types**: Environmental, social, governance indicators
- **Update Frequency**: Annual
- **API Documentation**: [World Bank API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)

### 📈 Alpha Vantage ESG
- **Coverage**: 3000+ public companies
- **Cost**: Free tier (25 requests/day), Premium available
- **Rate Limits**: 25 calls/day (free), 75 calls/minute (premium)
- **Data Types**: Corporate ESG scores, sustainability metrics
- **Update Frequency**: Quarterly
- **API Documentation**: [Alpha Vantage ESG](https://www.alphavantage.co/documentation/#esg)

## 🔧 Configuration

### Environment Variables

Create or update your `.env` file:

```env
# Alpha Vantage (Optional but recommended)
ALPHA_VANTAGE_API_KEY=your_api_key_here

# API Configuration
WORLD_BANK_API_BASE_URL=https://api.worldbank.org/v2
ALPHA_VANTAGE_API_BASE_URL=https://www.alphavantage.co/query

# Performance Settings
ESG_DATA_CACHE_TTL=3600000
ESG_API_RATE_LIMIT_DELAY=1000
ESG_MAX_RETRIES=3
ESG_REQUEST_TIMEOUT=30000

# Logging
LOG_LEVEL=info
```

### Getting API Keys

#### Alpha Vantage (Recommended)
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key instantly
4. Add it to your `.env` file

**Benefits of Alpha Vantage API Key:**
- Access to 3000+ corporate ESG scores
- Quarterly updated sustainability metrics
- SFDR-relevant data points
- 25 free requests per day

## 💻 Usage Examples

### Basic ESG Data Fetching

```typescript
import { SFDRNavigatorAgent } from './src/components/agents/SFDRNavigatorAgent';

const agent = new SFDRNavigatorAgent();

// Fetch ESG data from all enabled sources
const esgData = await agent.fetchESGData();
console.log(`Fetched ${esgData.length} ESG records`);

// Analyze data by source
const sourceBreakdown = esgData.reduce((acc, record) => {
  acc[record.provider] = (acc[record.provider] || 0) + 1;
  return acc;
}, {});
console.log('Source breakdown:', sourceBreakdown);
```

### World Bank Sovereign Analysis

```typescript
import { worldBankSovereignAnalysis } from './examples/free-esg-integration-example';

// Analyze sovereign ESG performance
const sovereignData = await worldBankSovereignAnalysis();

// Results include:
// - Top ESG performing countries
// - Environmental indicators (carbon intensity, renewable energy)
// - Social indicators (education, healthcare, inequality)
// - Governance indicators (regulatory quality, rule of law)
```

### Corporate ESG Analysis

```typescript
import { alphaVantageCorporateAnalysis } from './examples/free-esg-integration-example';

// Analyze corporate ESG performance
const corporateData = await alphaVantageCorporateAnalysis();

// Results include:
// - ESG scores by sector
// - Top ESG performers
// - Sustainability ratings
// - SFDR compliance indicators
```

### SFDR Compliance Analysis

```typescript
import { sfdrComplianceAnalysis } from './examples/free-esg-integration-example';

// Analyze SFDR compliance
const esgData = await agent.fetchESGData();
await sfdrComplianceAnalysis(esgData);

// Results include:
// - Principal Adverse Impacts (PAI) coverage
// - EU Taxonomy alignment
// - Carbon footprint analysis
// - Compliance ratings
```

## 🧪 Testing

### Run All Tests

```bash
npm run esg:test
```

### Watch Mode

```bash
npm run esg:test:watch
```

### Test Coverage

The integration includes comprehensive tests for:
- ✅ World Bank API integration
- ✅ Alpha Vantage API integration
- ✅ Data transformation and mapping
- ✅ Error handling and rate limiting
- ✅ SFDR compliance calculations
- ✅ Data quality assessment
- ✅ Multi-source data aggregation

## 📈 Performance & Monitoring

### Performance Monitoring

```bash
# Monitor API performance
npm run esg:performance
```

### Data Quality Assessment

```bash
# Assess data quality across sources
npm run esg:quality
```

### Key Metrics Tracked

- **API Response Times**: Average response time per source
- **Success Rates**: API call success percentage
- **Data Completeness**: Percentage of complete ESG records
- **Data Freshness**: Age of data from each source
- **Rate Limit Usage**: API quota utilization

## 🔍 Data Quality Framework

### Quality Dimensions

1. **Completeness** (0-100%)
   - Percentage of required ESG fields populated
   - Calculated per record and aggregated by source

2. **Accuracy** (0-100%)
   - Data validation against known benchmarks
   - Cross-source consistency checks

3. **Timeliness** (0-100%)
   - Data freshness based on last update date
   - Penalty for outdated information

4. **Consistency** (0-100%)
   - Format standardization across sources
   - Unit normalization and validation

5. **Reliability** (High/Medium/Low)
   - Source reputation and track record
   - API stability and uptime

### Quality Scoring

```typescript
// Example quality score calculation
const qualityScore = {
  completeness: 85.5,
  accuracy: 90.0,
  timeliness: 75.0,
  consistency: 88.0,
  reliability: 'high',
  overallScore: 84.6
};
```

## 🎯 SFDR Compliance Mapping

### Principal Adverse Impacts (PAI)

The integration maps free data sources to SFDR PAI indicators:

| PAI Indicator | World Bank | Alpha Vantage | Coverage |
|---------------|------------|---------------|----------|
| GHG Emissions | ✅ CO2 per capita | ✅ Scope 1,2,3 | High |
| Carbon Footprint | ✅ Carbon intensity | ✅ Carbon metrics | High |
| Energy Consumption | ✅ Energy use | ✅ Energy efficiency | Medium |
| Water Usage | ✅ Water resources | ❌ Limited | Low |
| Waste Generation | ❌ Limited | ❌ Limited | Low |
| Biodiversity | ✅ Protected areas | ❌ Limited | Medium |
| Social Violations | ✅ Governance indicators | ✅ Social scores | Medium |
| Gender Pay Gap | ✅ Gender indicators | ❌ Limited | Low |
| Board Diversity | ❌ Limited | ✅ Governance | Medium |

### EU Taxonomy Alignment

```typescript
// Example taxonomy alignment calculation
const taxonomyAlignment = {
  climateChangeMitigation: 45.2,
  climateChangeAdaptation: 23.1,
  sustainableWaterUse: 12.5,
  circularEconomy: 8.7,
  pollutionPrevention: 15.3,
  biodiversityProtection: 18.9,
  overallAlignment: 28.4
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Alpha Vantage API Key Issues

**Problem**: "API key not configured" or "Invalid API key"

**Solution**:
```bash
# Check your .env file
cat .env | grep ALPHA_VANTAGE

# Get a new API key
echo "Visit: https://www.alphavantage.co/support/#api-key"

# Test your API key
curl "https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=YOUR_KEY"
```

#### 2. Rate Limit Exceeded

**Problem**: "API rate limit exceeded"

**Solution**:
- Wait for rate limit reset (daily for free tier)
- Implement caching to reduce API calls
- Consider upgrading to premium tier
- Use multiple API keys (if allowed)

#### 3. Network Connectivity

**Problem**: "Network request failed"

**Solution**:
```bash
# Test World Bank API
curl "https://api.worldbank.org/v2/country?format=json&per_page=1"

# Test Alpha Vantage API
curl "https://www.alphavantage.co/query?function=OVERVIEW&symbol=IBM&apikey=demo"

# Check firewall/proxy settings
```

#### 4. TypeScript Compilation Errors

**Problem**: TypeScript compilation fails

**Solution**:
```bash
# Install dependencies
npm install

# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm update @types/node @types/jest
```

### Debug Mode

```bash
# Enable verbose logging
export LOG_LEVEL=debug
npm run esg:setup:verbose

# Check setup logs
cat setup.log

# Examine test data
ls -la test-data/
```

## 📚 Advanced Usage

### Custom ESG Scoring

```typescript
import { NayaOneESGData } from './src/types/sfdr';

// Custom ESG scoring algorithm
function calculateCustomESGScore(data: NayaOneESGData): number {
  const weights = {
    environmental: 0.4,
    social: 0.3,
    governance: 0.3
  };
  
  return (
    data.esgScore.environmental * weights.environmental +
    data.esgScore.social * weights.social +
    data.esgScore.governance * weights.governance
  );
}
```

### Data Caching Implementation

```typescript
import { createHash } from 'crypto';

class ESGDataCache {
  private cache = new Map<string, { data: any; timestamp: number }>();
  private ttl = 3600000; // 1 hour
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
  
  generateKey(source: string, params: any): string {
    return createHash('md5')
      .update(`${source}:${JSON.stringify(params)}`)
      .digest('hex');
  }
}
```

### Multi-Source Data Aggregation

```typescript
import { NayaOneESGData } from './src/types/sfdr';

class ESGDataAggregator {
  aggregateByEntity(data: NayaOneESGData[]): Map<string, NayaOneESGData[]> {
    const aggregated = new Map<string, NayaOneESGData[]>();
    
    data.forEach(record => {
      const key = record.companyName || record.country || record.ticker;
      if (!aggregated.has(key)) {
        aggregated.set(key, []);
      }
      aggregated.get(key)!.push(record);
    });
    
    return aggregated;
  }
  
  calculateConsensusScore(records: NayaOneESGData[]): NayaOneESGData {
    // Implement consensus scoring logic
    // Weight by data quality and source reliability
    // Return aggregated ESG score
  }
}
```

## 🔮 Future Enhancements

### Planned Features

1. **Additional Free Sources**
   - OpenESG data integration
   - CDP (Carbon Disclosure Project) public data
   - UN Global Compact participants
   - Sustainability indices data

2. **Enhanced Analytics**
   - ESG trend analysis
   - Peer benchmarking
   - Risk assessment models
   - Predictive ESG scoring

3. **Automation Features**
   - Scheduled data updates
   - Automated compliance reporting
   - Alert system for ESG changes
   - Data quality monitoring

4. **Integration Improvements**
   - GraphQL API support
   - Real-time data streaming
   - Advanced caching strategies
   - Multi-language support

### Contributing

We welcome contributions to enhance the free ESG sources integration:

1. **New Data Sources**: Help integrate additional free ESG data APIs
2. **Quality Improvements**: Enhance data validation and quality scoring
3. **Performance Optimization**: Improve API efficiency and caching
4. **Documentation**: Expand examples and troubleshooting guides

### Roadmap

- **Q1 2024**: Additional free sources integration
- **Q2 2024**: Enhanced SFDR compliance features
- **Q3 2024**: Real-time data streaming
- **Q4 2024**: AI-powered ESG insights

## 📄 License

This integration is part of the Synapses GRC platform and follows the project's licensing terms.

## 🤝 Support

For support and questions:

1. **Documentation**: Check this README and `FREE_ESG_SOURCES_INTEGRATION.md`
2. **Issues**: Create GitHub issues for bugs and feature requests
3. **Community**: Join our GRC professionals community
4. **Enterprise**: Contact us for enterprise support and premium features

---

**🌟 Empowering GRC Professionals with Free, High-Quality ESG Data**

*Part of the Synapses AI-First GRC Platform*