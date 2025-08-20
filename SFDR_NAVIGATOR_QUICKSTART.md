# 🚀 SFDR Navigator Quick Start Guide

## Overview
The SFDR Navigator is a specialized tool for classifying investment funds according to the Sustainable Finance Disclosure Regulation (SFDR). It provides real-time AI-powered classification with mandatory regulatory citations.

## Core Features
- Real-time SFDR classification (Article 6, 8, 9)
- Regulatory citations and compliance scoring
- Detailed analysis and recommendations
- Error handling and validation

## Quick Start

### 1. Access the Navigator
```
URL: /sfdr-navigator
```

### 2. Fund Classification
1. Select the "Classify" tab
2. Enter fund details:
   - Product Name (required)
   - Product Type (required)
   - Investment Strategy
   - Sustainability Objectives
   - Risk Profile
   - PAI Indicators

### 3. Understanding Results

#### Classification Types
- **Article 6**: Standard funds without specific sustainability focus
- **Article 8**: Funds promoting environmental/social characteristics
- **Article 9**: Funds with sustainable investment objectives

#### Result Components
- Classification (Article 6/8/9)
- Confidence Score (0-100%)
- Regulatory Citations
- Recommendations
- Compliance Score

### 4. Error Handling
Common errors and solutions:
- **Missing Fields**: Ensure required fields are filled
- **Network Error**: Check internet connection
- **Invalid Data**: Verify input format

### 5. Best Practices
1. Provide detailed investment strategy
2. Include specific sustainability objectives
3. List all relevant PAI indicators
4. Review regulatory citations
5. Save classification results

## Example Usage

### Article 8 Fund Classification
```typescript
// Input Data
const fundData = {
  productName: "ESG Growth Fund",
  productType: "investment_fund",
  investmentStrategy: "ESG integration and screening",
  sustainabilityObjectives: ["environmental", "social"],
  riskProfile: "medium"
};

// Submit Classification
await classify(fundData);
```

### Response Format
```typescript
interface ClassificationResponse {
  classification: "Article 6" | "Article 8" | "Article 9";
  confidence: number;
  complianceScore: number;
  recommendations: string[];
  regulatoryCitations: string[];
}
```

## Troubleshooting

### Common Issues
1. **Classification Failed**
   - Check input data completeness
   - Verify network connection
   - Review error messages

2. **Low Confidence Score**
   - Add more detailed investment strategy
   - Specify sustainability objectives
   - Include PAI indicators

3. **Missing Citations**
   - Ensure all required fields are filled
   - Check connection to classification service
   - Verify response format

## Support
For technical issues or questions:
- Check error messages in console
- Review test cases in `SFDR_NAVIGATOR_TEST_CASES.md`
- Contact technical support

## Next Steps
1. Run test cases from test document
2. Review classification results
3. Implement error handling
4. Save and export results
