# 🎯 SFDR Navigator Test Cases

## Test Case 1: Article 6 Fund
```json
{
  "productName": "Global Growth Fund",
  "productType": "investment_fund",
  "investmentStrategy": "The fund aims to achieve long-term capital growth through a diversified portfolio of global equities and fixed income securities.",
  "sustainabilityObjectives": [],
  "riskProfile": "medium",
  "paiIndicators": {}
}
```
**Expected Result**: Article 6 classification (standard fund without specific sustainability focus)

## Test Case 2: Article 8 Fund
```json
{
  "productName": "Sustainable Leaders Fund",
  "productType": "investment_fund",
  "investmentStrategy": "The fund integrates ESG factors into investment decisions and promotes environmental and social characteristics through active engagement and screening.",
  "sustainabilityObjectives": [
    "carbon_reduction",
    "social_impact"
  ],
  "riskProfile": "medium",
  "paiIndicators": {
    "carbon_footprint": true,
    "gender_diversity": true
  }
}
```
**Expected Result**: Article 8 classification (promotes E/S characteristics)

## Test Case 3: Article 9 Fund
```json
{
  "productName": "Climate Impact Fund",
  "productType": "investment_fund",
  "investmentStrategy": "The fund has sustainable investment as its objective, focusing on companies that contribute to climate change mitigation and adaptation in alignment with the Paris Agreement.",
  "sustainabilityObjectives": [
    "climate_mitigation",
    "renewable_energy",
    "circular_economy"
  ],
  "riskProfile": "medium",
  "paiIndicators": {
    "carbon_footprint": true,
    "fossil_fuel": true,
    "energy_consumption": true,
    "water_emissions": true
  }
}
```
**Expected Result**: Article 9 classification (sustainable investment objective)

## Error Cases to Test

### 1. Missing Required Fields
```json
{
  "productName": "",
  "productType": "investment_fund"
}
```
**Expected**: Validation error message

### 2. Invalid Product Type
```json
{
  "productName": "Test Fund",
  "productType": "invalid_type",
  "investmentStrategy": "Test strategy"
}
```
**Expected**: Invalid product type error

### 3. Network Error
- Disconnect internet
- Submit classification request
**Expected**: Network error handling message

## Success Criteria
1. ✅ Correct classification based on input data
2. ✅ Proper error handling and user feedback
3. ✅ Loading states during classification
4. ✅ Regulatory citations in response
5. ✅ Confidence scores provided

## Test Flow
1. Navigate to `/sfdr-navigator`
2. Select "Classify" tab
3. Enter test case data
4. Submit classification
5. Verify response matches expected result
6. Check error handling
7. Verify loading states
8. Validate regulatory citations
