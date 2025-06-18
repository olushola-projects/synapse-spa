# ESG Data Sources Integration

This document outlines the comprehensive integration of ESG data sources into the SFDR Navigator Agent, including both free and premium sources, with a focus on regulatory APIs and global sustainability indicators.

## Overview

The integration combines multiple ESG data sources and regulatory APIs to create a robust, comprehensive ESG data pipeline that supports SFDR compliance, ESG analysis, sustainability reporting, and real-time regulatory monitoring.

## Updated Integration: NayaOne Global ESG Sustainability Indicators Dataset

### Host Configuration
**Base URL**: `https://data.nayaone.com/esg_world_bank`

### API Access Method
```javascript
var request = require('request');
var options = {
  'method': 'GET',
  'url': 'https://data.nayaone.com/esg_world_bank',
  'headers': {
    'Accept-Profile': 'api',
    'sandpit-key': 'your sandpit api key'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

### Pagination and Rate Limiting
- **Default Response**: 10 records per request
- **Pagination**: Use `?offset=10` parameter for additional data
- **Offset Increments**: Must be multiples of 10 (10, 20, 30, etc.)
- **Rate Limits**: 60 requests/minute, 5,000 requests/day
- **Coverage**: 213 economies worldwide with sovereign-level ESG data

### Data Types Available
- Global ESG sustainability indicators
- World Bank ESG metrics
- Sovereign sustainability data
- Development indicators
- Environmental performance metrics
- Social development metrics
- Governance indicators

## Integrated Regulatory APIs

### CSSF (Commission de Surveillance du Secteur Financier) - Luxembourg
**Status**: ✅ Integrated | **Type**: Free
**Base URL**: `https://www.cssf.lu/api`

- **Coverage**: ~5,000 Luxembourg financial institutions
- **Sectors**: Banking, Insurance, Investment Funds, Payment Institutions
- **Data Types**: Regulatory reporting, fund data, supervisory data, compliance metrics
- **Rate Limits**: 30 requests/minute, 1,000 requests/day

### ESMA (European Securities and Markets Authority)
**Status**: ✅ Integrated | **Type**: Free
**Base URL**: `https://registers.esma.europa.eu/api`

- **Coverage**: ~50,000 EU financial entities across 27 member states
- **Sectors**: Securities, Markets, Investment Management, Trading Venues
- **Data Types**: FIRDS data, regulatory registers, market data, MiFID II compliance
- **Rate Limits**: 60 requests/minute, 2,000 requests/day

### ECB (European Central Bank) Data Portal
**Status**: ✅ Integrated | **Type**: Free
**Base URL**: `https://data-api.ecb.europa.eu/service`

- **Coverage**: 27 EU member states + Eurozone
- **Sectors**: Banking, Monetary Policy, Financial Stability
- **Data Types**: Interest rates, exchange rates, banking statistics, financial stability indicators
- **Rate Limits**: 100 requests/minute, 5,000 requests/day

### EBA (European Banking Authority)
**Status**: ✅ Integrated | **Type**: Free
**Base URL**: `https://www.eba.europa.eu/api`

- **Coverage**: ~3,000 EU banks and credit institutions
- **Sectors**: Banking, Credit Institutions, Investment Firms
- **Data Types**: Supervisory data, stress test results, ESG risk management guidelines
- **Rate Limits**: 50 requests/minute, 1,500 requests/day

### EIOPA (European Insurance and Occupational Pensions Authority)
**Status**: ✅ Integrated | **Type**: Free
**Base URL**: `https://www.eiopa.europa.eu/api`

- **Coverage**: ~2,500 EU insurance companies
- **Sectors**: Insurance, Occupational Pensions, Reinsurance
- **Data Types**: Insurance statistics, pension data, Solvency II data
- **Rate Limits**: 40 requests/minute, 1,200 requests/day

## Integrated Free Data Sources

### 1. World Bank Open Data API

**Coverage**: Global sovereign ESG indicators  
**Cost**: Free  
**Rate Limits**: 60 requests/minute, 10,000 requests/day  
**Reliability**: High  

#### Key Features:
- Comprehensive environmental indicators (CO2 emissions, energy consumption)
- Social development metrics (unemployment, inequality, access to services)
- Governance indicators (women's parliamentary representation)
- Historical data from 2000-2023
- 217 countries covered

#### API Endpoints Used:
```
https://api.worldbank.org/v2/country/all/indicator/{INDICATOR_ID}?format=json&date=2020:2023&per_page=1000
```

#### ESG Indicators Mapped:
- `EN.ATM.CO2E.PC` - CO2 emissions per capita
- `EG.USE.ELEC.KH.PC` - Electric power consumption per capita
- `SH.STA.WASH.P5` - People with basic handwashing facilities
- `SL.UEM.TOTL.ZS` - Unemployment rate
- `SI.POV.GINI` - GINI inequality index
- `SG.GEN.PARL.ZS` - Women's parliamentary representation

### 2. Alpha Vantage ESG API

**Coverage**: US-listed companies ESG scores  
**Cost**: Free tier available  
**Rate Limits**: 5 requests/minute, 500 requests/day  
**Reliability**: Medium  

#### Key Features:
- ESG scores for 8,000+ companies
- Environmental, Social, and Governance sub-scores
- Real-time and historical ESG data
- Integration with fundamental company data

#### API Endpoints Used:
```
https://www.alphavantage.co/query?function=ESG&symbol={SYMBOL}&apikey={API_KEY}
```

#### Companies Covered (Sample):
- AAPL (Apple Inc.)
- MSFT (Microsoft Corporation)
- GOOGL (Alphabet Inc.)
- AMZN (Amazon.com Inc.)
- TSLA (Tesla Inc.)
- META (Meta Platforms Inc.)
- NVDA (NVIDIA Corporation)
- JPM (JPMorgan Chase & Co.)
- JNJ (Johnson & Johnson)
- V (Visa Inc.)

## Implementation Architecture

### Configuration Management

The system uses a centralized configuration approach defined in `src/config/esg-sources.config.ts`:

```typescript
export interface ESGSourceConfig {
  name: string;
  type: 'free' | 'premium';
  baseUrl: string;
  apiKey?: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerDay?: number;
  };
  reliability: 'high' | 'medium' | 'low';
  coverage: {
    companies: number;
    countries: number;
    sectors: string[];
  };
  dataTypes: string[];
  enabled: boolean;
}
```

### Data Flow Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   World Bank    │    │   Alpha Vantage  │    │   Other Sources │
│   Open Data     │    │   ESG API        │    │   (Future)      │
└─────────┬───────┘    └─────────┬────────┘    └─────────┬───────┘
          │                      │                       │
          └──────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   SFDR Navigator Agent  │
                    │   Data Aggregation      │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Data Transformation   │
                    │   & Quality Assessment  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Unified ESG Dataset   │
                    │   SFDR Compliance       │
                    └─────────────────────────┘
```

### Data Transformation Pipeline

1. **Data Fetching**: Parallel requests to enabled sources with rate limiting
2. **Data Validation**: Schema validation and quality checks
3. **Data Transformation**: Conversion to unified `NayaOneESGData` format
4. **Quality Assessment**: Completeness, reliability, and timeliness scoring
5. **Data Aggregation**: Merging data from multiple sources
6. **SFDR Mapping**: Alignment with SFDR disclosure requirements

## Environment Configuration

### Required Environment Variables

```bash
# Alpha Vantage (Free tier available)
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key

# World Bank (No API key required)
# WORLD_BANK_API_URL=https://api.worldbank.org/v2  # Optional override

# Optional: Premium sources (disabled by default)
# NAYAONE_SANDPIT_KEY=your_nayaone_key
# SUSTAINALYTICS_API_KEY=your_sustainalytics_key
# MSCI_API_KEY=your_msci_key
# BLOOMBERG_API_KEY=your_bloomberg_key
```

### Getting API Keys

#### Alpha Vantage (Free)
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key (500 requests/day free)
4. Add to `.env` file: `ALPHA_VANTAGE_API_KEY=your_key_here`

#### World Bank (No Registration Required)
- No API key needed
- Direct access to public APIs
- Rate limits apply but are generous

## Usage Examples

### Basic ESG Data Fetching

```typescript
import { SFDRNavigatorAgent } from './components/agents/SFDRNavigatorAgent';

const agent = new SFDRNavigatorAgent();

// Fetch ESG data from all enabled free sources
const esgData = await agent.fetchESGData();

console.log(`Fetched ${esgData.length} ESG records`);
console.log('Source breakdown:', 
  esgData.reduce((acc, record) => {
    acc[record.provider] = (acc[record.provider] || 0) + 1;
    return acc;
  }, {})
);
```

### Filtering by Source Type

```typescript
import { getFreeESGSources, getPremiumESGSources } from './config/esg-sources.config';

// Get only free sources
const freeSources = getFreeESGSources();
console.log('Free sources:', freeSources); // ['worldbank', 'alphavantage']

// Get premium sources (if enabled)
const premiumSources = getPremiumESGSources();
console.log('Premium sources:', premiumSources);
```

### Data Quality Assessment

```typescript
// Access data quality metrics
const esgData = await agent.fetchESGData();
const qualityMetrics = esgData.map(record => ({
  provider: record.provider,
  completeness: record.dataQuality.completeness,
  reliability: record.dataQuality.reliability,
  source: record.dataQuality.source
}));

console.log('Quality metrics by source:', qualityMetrics);
```

## Data Quality Framework

### Quality Metrics

1. **Completeness**: Percentage of required fields populated
2. **Accuracy**: Estimated based on source reliability
3. **Timeliness**: Freshness of data (age-based scoring)
4. **Consistency**: Cross-source validation
5. **Reliability**: Source-based reliability rating

### Quality Scoring

```typescript
interface ESGDataQualityMetrics {
  completeness: number;    // 0-100%
  accuracy: number;        // 0-100%
  timeliness: number;      // 0-100% (based on data age)
  consistency: number;     // 0-100%
  reliability: 'high' | 'medium' | 'low';
  sourceCount: number;     // Number of sources
  lastUpdated: string;     // ISO date string
}
```

### Quality Thresholds

- **Minimum Completeness**: 60%
- **Minimum Reliability**: Medium
- **Maximum Data Age**: 365 days for high timeliness score

## SFDR Compliance Mapping

### Principal Adverse Impacts (PAI) Indicators

| SFDR Indicator | World Bank Source | Alpha Vantage Source |
|----------------|-------------------|----------------------|
| GHG Emissions | EN.ATM.CO2E.PC | Environmental Score |
| Energy Consumption | EG.USE.ELEC.KH.PC | Environmental Score |
| Board Diversity | SG.GEN.PARL.ZS | Governance Score |
| Social Violations | SL.UEM.TOTL.ZS | Social Score |

### Taxonomy Alignment

- Environmental objectives mapping
- Social objectives assessment
- Governance criteria evaluation

## Testing

### Running Tests

```bash
# Run all ESG integration tests
npm test src/tests/free-esg-sources-integration.test.ts

# Run with coverage
npm test -- --coverage src/tests/free-esg-sources-integration.test.ts
```

### Test Coverage

- ✅ World Bank API integration
- ✅ Alpha Vantage API integration
- ✅ Rate limiting compliance
- ✅ Error handling
- ✅ Data transformation
- ✅ Quality assessment
- ✅ Multi-source aggregation
- ✅ SFDR mapping

## Performance Considerations

### Rate Limiting

- **World Bank**: 100ms delay between requests
- **Alpha Vantage**: 12 seconds delay between requests (free tier)
- Configurable delays based on source settings

### Caching Strategy

```typescript
// Cache settings
cacheSettings: {
  ttl: 3600,      // 1 hour
  maxSize: 100    // 100 MB
}
```

### Memory Optimization

- Streaming data processing for large datasets
- Pagination support for API responses
- Garbage collection optimization

## Monitoring and Logging

### Key Metrics

- API response times
- Success/failure rates by source
- Data quality scores
- Cache hit rates
- Rate limit compliance

### Logging Examples

```
[INFO] Fetching ESG data from 2 sources: ['worldbank', 'alphavantage']
[INFO] ESG Data Source Statistics: {
  totalRecords: 245,
  sourceBreakdown: { worldbank: 195, alphavantage: 50 },
  coverage: { companies: 50, countries: 195, sectors: 12 },
  overallQuality: 78.5
}
[WARN] Skipping sustainalytics: Invalid or missing API key
```

## Future Enhancements

### Additional Free Sources

1. **European Central Bank (ECB)** - Climate and environmental statistics
2. **OECD Data** - Social and governance indicators
3. **UN Global Compact** - Corporate sustainability data
4. **CDP (Carbon Disclosure Project)** - Climate data (limited free access)

### Premium Source Integration

1. **Sustainalytics** - Comprehensive ESG risk ratings
2. **MSCI ESG** - Industry-leading ESG scores
3. **Bloomberg ESG** - Real-time ESG data
4. **Refinitiv (LSEG)** - Extensive ESG coverage

### Advanced Features

- Machine learning-based data quality prediction
- Automated anomaly detection
- Real-time data streaming
- Advanced SFDR compliance automation
- Custom ESG scoring models

## Troubleshooting

### Common Issues

1. **API Key Issues**
   ```
   Error: Skipping alphavantage: Invalid or missing API key
   Solution: Verify ALPHA_VANTAGE_API_KEY in .env file
   ```

2. **Rate Limiting**
   ```
   Error: Alpha Vantage API failed: 429 - Too Many Requests
   Solution: Increase delay between requests or upgrade API plan
   ```

3. **Data Quality Issues**
   ```
   Warning: Low data completeness (45%) for source: alphavantage
   Solution: Check API response format and field mappings
   ```

### Debug Mode

```typescript
// Enable debug logging
process.env.DEBUG_ESG_SOURCES = 'true';

// Detailed API response logging
process.env.LOG_API_RESPONSES = 'true';
```

## Contributing

### Adding New Free Sources

1. Update `esg-sources.config.ts` with new source configuration
2. Implement fetch method in `SFDRNavigatorAgent.ts`
3. Add data transformation logic
4. Create comprehensive tests
5. Update documentation

### Code Standards

- TypeScript strict mode
- Comprehensive error handling
- Rate limiting compliance
- Data quality validation
- Security best practices

## License and Compliance

- World Bank data: Open license (CC BY 4.0)
- Alpha Vantage: Terms of service compliance required
- GDPR compliance for EU data
- SOC 2 Type II compliance for enterprise use

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Synapses Technical Team