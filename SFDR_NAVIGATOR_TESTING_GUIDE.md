# SFDR Navigator Testing Guide

## Introduction

This guide provides detailed instructions for testing the SFDR Navigator functionality in the Synapse Nexus platform. It is designed for QA testers to ensure comprehensive validation of SFDR compliance features, including fund classification, regulatory compliance, and reporting capabilities.

## Prerequisites

Before beginning testing, ensure you have:

1. Access to the Synapse Nexus testing environment
2. Test accounts with appropriate permissions
3. Test data for Article 6, 8, and 9 funds
4. Familiarity with SFDR requirements and classifications
5. Understanding of the SynapseQATester framework

## Testing Environment Setup

### Environment Configuration

1. Clone the repository: `git clone https://github.com/synapse/synapse-landing-nexus.git`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at: `http://localhost:3000`

### Test Data Preparation

Test data is available in the following locations:

- Article 6 fund data: `Nexus/test/fixtures/article6-basic.json`
- Article 8 fund data: `Nexus/test/fixtures/article8-esg.json`
- Article 9 fund data: `Nexus/test/fixtures/article9-sustainable.json`

Review these files to understand the structure and content of test data.

## Manual Testing Procedures

### 1. SFDR Navigator Access and Navigation

**Objective**: Verify that the SFDR Navigator is accessible and navigable.

**Steps**:

1. Log in to the Synapse Nexus platform
2. Navigate to the SFDR Navigator section
3. Verify that the SFDR Navigator interface loads correctly
4. Check that all navigation elements are functional
5. Verify that the user interface is responsive and accessible

**Expected Results**:

- SFDR Navigator loads without errors
- All navigation elements are functional
- User interface is responsive and accessible

### 2. Article 6 Fund Classification

**Objective**: Verify that funds with minimal ESG integration are correctly classified as Article 6.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter Article 6 test data (from `article6-basic.json`)
4. Submit the form
5. Review the classification result

**Expected Results**:

- Fund is classified as Article 6
- Sustainability risk disclosure is validated
- No compliance issues are reported for a valid Article 6 fund

### 3. Article 8 Fund Classification

**Objective**: Verify that funds promoting ESG characteristics are correctly classified as Article 8.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter Article 8 test data (from `article8-esg.json`)
4. Submit the form
5. Review the classification result

**Expected Results**:

- Fund is classified as Article 8
- ESG characteristics are validated
- PAI consideration is validated
- Taxonomy alignment is validated
- No compliance issues are reported for a valid Article 8 fund

### 4. Article 9 Fund Classification

**Objective**: Verify that funds with sustainable investment objectives are correctly classified as Article 9.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter Article 9 test data (from `article9-sustainable.json`)
4. Submit the form
5. Review the classification result

**Expected Results**:

- Fund is classified as Article 9
- Sustainable investment objectives are validated
- Minimum sustainable investment percentage is validated
- Comprehensive PAI consideration is validated
- Taxonomy alignment is validated
- No compliance issues are reported for a valid Article 9 fund

### 5. PAI Consideration Validation

**Objective**: Verify that PAI consideration is properly validated.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter test data with PAI consideration
4. Modify the PAI indicators to include invalid values
5. Submit the form
6. Review the validation results

**Expected Results**:

- Invalid PAI indicators are identified
- Appropriate error messages are displayed
- Validation fails for invalid PAI indicators

### 6. Taxonomy Alignment Validation

**Objective**: Verify that taxonomy alignment is properly validated.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter test data with taxonomy alignment
4. Modify the taxonomy alignment percentage to exceed 100%
5. Submit the form
6. Review the validation results

**Expected Results**:

- Invalid taxonomy alignment percentage is identified
- Appropriate error message is displayed
- Validation fails for invalid taxonomy alignment percentage

### 7. SFDR Compliance Report Generation

**Objective**: Verify that SFDR compliance reports are generated correctly.

**Steps**:

1. Navigate to the SFDR Navigator
2. Select "New Fund Classification"
3. Upload or manually enter test data
4. Submit the form
5. Review the classification result
6. Select "Generate Compliance Report"
7. Review the generated report

**Expected Results**:

- Compliance report is generated
- Report includes all required sections
- Classification is correctly displayed
- Compliance status is accurately reported
- Any compliance issues are correctly identified

### 8. Edge Case Testing

**Objective**: Verify that the system handles edge cases appropriately.

**Steps**:

1. Test with borderline classifications (e.g., fund with minimal ESG characteristics)
2. Test with data inconsistencies (e.g., fund with PAI consideration but empty PAI indicators)
3. Test with invalid data (e.g., invalid entity ID format)
4. Test with missing required fields

**Expected Results**:

- Borderline cases are classified correctly
- Data inconsistencies generate appropriate warnings
- Invalid data generates appropriate errors
- Missing required fields are identified

## Automated Testing Procedures

### 1. Running Automated Tests

**Objective**: Execute the automated test suite for SFDR compliance.

**Steps**:

1. Navigate to the project root directory
2. Run the test command: `npm test -- --testPathPattern=sfdr-compliance.test.js`
3. Review the test results

**Expected Results**:

- All tests pass
- Test coverage is at least 90%
- No errors or warnings are reported

### 2. Creating Custom Test Cases

**Objective**: Create custom test cases for specific scenarios.

**Steps**:

1. Open the test file: `Nexus/test/regulatory/sfdr-compliance.test.js`
2. Add a new test case following the existing pattern
3. Run the test command to execute the new test case

**Example**:

```javascript
test('Should validate custom scenario', async () => {
  // Start test tracking
  await tester.startTest('Custom Scenario Test');
  
  try {
    // Navigate to SFDR Navigator
    await tester.navigateToPage('/sfdr-navigator');
    
    // Load custom test data
    const customData = { /* Custom test data */ };
    await tester.fillFormWithData('#sfdr-form', customData);
    await tester.clickElement('#submit-button');
    
    // Validate results
    const result = await tester.getElementText('#result');
    tester.assert(result.includes('Expected Result'), 'Result should include expected text');
    
    // End test with success
    tester.endTest(true);
  } catch (error) {
    tester.endTest(false, error.message);
    throw error;
  }
});
```

## Validation Procedures

### 1. Article 6 Validation

**Validation Criteria**:

- Fund does not promote ESG characteristics
- Fund does not have sustainable investment objectives
- Sustainability risk disclosure is present
- No false ESG claims in marketing materials

**Validation Method**:

1. Review the fund profile section
2. Verify that ESG characteristics are not promoted
3. Verify that sustainable investment objectives are not claimed
4. Review the sustainability risk disclosure
5. Review marketing materials for false ESG claims

### 2. Article 8 Validation

**Validation Criteria**:

- Fund promotes environmental or social characteristics
- Fund considers PAI indicators
- Taxonomy alignment disclosure is present (if applicable)
- ESG integration in investment process is documented

**Validation Method**:

1. Review the fund profile section
2. Verify that ESG characteristics are promoted
3. Review the PAI consideration section
4. Verify that PAI indicators are valid
5. Review the taxonomy alignment section (if applicable)
6. Review the ESG integration documentation

### 3. Article 9 Validation

**Validation Criteria**:

- Fund has sustainable investment objectives
- Fund has at least 80% sustainable investments
- Fund considers all mandatory PAI indicators
- Impact measurement framework is documented
- Taxonomy alignment is documented (for environmental objectives)

**Validation Method**:

1. Review the fund profile section
2. Verify that sustainable investment objectives are present
3. Verify that sustainable investment percentage is at least 80%
4. Review the PAI consideration section
5. Verify that all mandatory PAI indicators are included
6. Review the impact measurement framework
7. Review the taxonomy alignment section (for environmental objectives)

### 4. Cross-Cutting Validation

**Validation Criteria**:

- Entity identifiers are in valid format
- Data is consistent across different sections
- Business logic rules are satisfied
- Reporting requirements are met

**Validation Method**:

1. Verify entity ID, ISIN, and LEI formats
2. Check for data consistency across sections
3. Validate business logic rules
4. Review reporting requirements compliance

## Troubleshooting Common Issues

### 1. Classification Issues

**Issue**: Fund is classified incorrectly

**Possible Causes**:
- Incorrect or incomplete test data
- Classification logic error
- Misinterpretation of SFDR requirements

**Resolution**:
- Verify test data against SFDR requirements
- Review classification logic in the code
- Consult with compliance experts

### 2. Validation Issues

**Issue**: Validation fails unexpectedly

**Possible Causes**:
- Invalid test data
- Validation logic error
- Missing required fields

**Resolution**:
- Verify test data format and content
- Review validation logic in the code
- Check for missing required fields

### 3. Performance Issues

**Issue**: Slow response time or timeouts

**Possible Causes**:
- Large test data
- Inefficient validation logic
- Resource constraints

**Resolution**:
- Optimize test data size
- Review and optimize validation logic
- Increase resource allocation

## Reporting Test Results

### 1. Test Result Documentation

Document test results using the following format:

```
Test Case: [Test Case ID]
Description: [Brief description of the test case]
Status: [Pass/Fail]
Issues: [List of issues found]
Screenshots: [Links to screenshots]
Notes: [Additional notes or observations]
```

### 2. Defect Reporting

Report defects using the following format:

```
Defect ID: [Defect ID]
Test Case ID: [Test Case ID]
Description: [Brief description of the defect]
Steps to Reproduce: [Detailed steps to reproduce the defect]
Expected Result: [What should happen]
Actual Result: [What actually happens]
Priority: [P1/P2/P3/P4]
Severity: [Critical/High/Medium/Low]
Screenshots: [Links to screenshots]
```

### 3. Test Summary Report

Prepare a test summary report using the following format:

```
Test Summary Report
==================

Test Date: [Date]
Tester: [Name]

Test Scope:
- [List of test cases executed]

Test Results:
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Pass Rate: [Percentage]

Defects Summary:
- P1 (Critical): [Number]
- P2 (High): [Number]
- P3 (Medium): [Number]
- P4 (Low): [Number]

Observations:
- [List of observations]

Recommendations:
- [List of recommendations]
```

## Best Practices for SFDR Testing

1. **Understand SFDR Requirements**: Familiarize yourself with SFDR requirements and classifications before testing.

2. **Use Realistic Test Data**: Use realistic test data that reflects actual fund profiles and characteristics.

3. **Test Edge Cases**: Test borderline cases and edge scenarios to ensure robust classification.

4. **Validate Compliance Reports**: Thoroughly validate compliance reports for accuracy and completeness.

5. **Consult with Compliance Experts**: When in doubt, consult with compliance experts for clarification.

6. **Document Test Results**: Document all test results, including screenshots and observations.

7. **Maintain Test Data**: Keep test data up-to-date with the latest SFDR requirements.

8. **Automate Repetitive Tests**: Automate repetitive tests to improve efficiency and coverage.

9. **Perform Regression Testing**: After code changes, perform regression testing to ensure continued compliance.

10. **Stay Updated on Regulatory Changes**: Stay informed about regulatory changes and update test cases accordingly.

## Appendix: SFDR Reference

### Article 6 Funds

Article 6 funds are those that do not promote environmental or social characteristics and do not have sustainable investment objectives. They are required to disclose how sustainability risks are integrated into investment decisions and the likely impacts of sustainability risks on returns.

### Article 8 Funds

Article 8 funds promote environmental or social characteristics but do not have sustainable investment as their objective. They are required to disclose how these characteristics are met, including information on PAI consideration and taxonomy alignment (if applicable).

### Article 9 Funds

Article 9 funds have sustainable investment as their objective. They are required to disclose their sustainable investment objectives, the minimum percentage of sustainable investments, comprehensive PAI consideration, and taxonomy alignment (for environmental objectives).

### Principal Adverse Impacts (PAIs)

PAIs are negative effects on sustainability factors that result from investment decisions. SFDR requires consideration of PAIs for Article 8 and 9 funds, with specific indicators defined in the Regulatory Technical Standards (RTS).

### Taxonomy Alignment

Taxonomy alignment refers to the percentage of a fund's investments that are aligned with the EU Taxonomy Regulation. It is required for Article 8 and 9 funds with environmental objectives.

---

*This testing guide should be reviewed and updated regularly to reflect changes in SFDR requirements and application functionality.*