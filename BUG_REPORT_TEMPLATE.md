# Bug Report Template - Synapse Landing Page & SFDR Navigator

## Bug Report #[NUMBER]

### 📋 Basic Information

- **Date**: [YYYY-MM-DD]
- **Reporter**: [Your Name]
- **Severity**: [ ] Critical [ ] High [ ] Medium [ ] Low
- **Priority**: [ ] P1 (Blocker) [ ] P2 (High) [ ] P3 (Medium) [ ] P4 (Low)
- **Status**: [ ] Open [ ] In Progress [ ] Fixed [ ] Closed [ ] Won't Fix

### 🎯 Bug Classification

- **Component**:
  - [ ] Landing Page - Navigation
  - [ ] Landing Page - Homepage
  - [ ] Landing Page - Forms
  - [ ] Landing Page - Responsive Design
  - [ ] SFDR Navigator - Chat Interface
  - [ ] SFDR Navigator - AI Functionality
  - [ ] SFDR Navigator - Form Mode
  - [ ] API Integration
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Security
  - [ ] Other: \***\*\_\_\_\*\***

- **Bug Type**:
  - [ ] Functional
  - [ ] UI/UX
  - [ ] Performance
  - [ ] Compatibility
  - [ ] Security
  - [ ] Accessibility
  - [ ] Content/Text
  - [ ] Integration

### 🌐 Environment Details

- **URL**: [Specific page where bug occurs]
- **Browser**: [Chrome/Firefox/Safari/Edge] [Version]
- **Operating System**: [Windows/macOS/Linux] [Version]
- **Device**: [Desktop/Tablet/Mobile] [Model if mobile]
- **Screen Resolution**: [e.g., 1920x1080]
- **Network**: [WiFi/Mobile/Slow 3G/etc.]

### 📝 Bug Description

#### Summary

[One-line description of the bug]

#### Detailed Description

[Comprehensive description of what's wrong]

#### Expected Behavior

[What should happen]

#### Actual Behavior

[What actually happens]

### 🔄 Steps to Reproduce

1. [First step]
2. [Second step]
3. [Third step]
4. [Continue as needed]

**Reproducibility**:

- [ ] Always (100%)
- [ ] Often (75-99%)
- [ ] Sometimes (25-74%)
- [ ] Rarely (1-24%)
- [ ] Unable to reproduce

### 📸 Evidence

#### Screenshots

- [ ] Screenshot attached
- [ ] Screen recording attached
- [ ] Console logs attached
- [ ] Network logs attached

#### Console Errors

```
[Paste any console errors here]
```

#### Network Errors

```
[Paste any network errors here]
```

### 🎯 Specific Test Cases (for SFDR Navigator bugs)

#### Chat Interface Issues

- **Test Message**: [What message was sent]
- **Expected Response**: [What response was expected]
- **Actual Response**: [What response was received]
- **Response Time**: [How long it took]
- **Context**: [Previous conversation context if relevant]

#### SFDR Compliance Issues

- **Fund Type**: [Article 6/8/9]
- **Input Data**: [What data was provided]
- **Validation Result**: [What result was given]
- **Issue**: [What was wrong with the result]

#### Form Mode Issues

- **Form Fields**: [Which fields were filled]
- **Validation**: [What validation occurred]
- **Submission**: [What happened on submit]
- **Results**: [What results were displayed]

### 💥 Impact Assessment

#### User Impact

- [ ] Blocks core functionality
- [ ] Degrades user experience
- [ ] Cosmetic issue only
- [ ] Affects specific user group: \***\*\_\_\_\*\***

#### Business Impact

- [ ] Prevents beta launch
- [ ] Affects user onboarding
- [ ] Impacts SFDR Navigator credibility
- [ ] SEO/Marketing impact
- [ ] Compliance/Legal concern

### 🔧 Technical Details

#### Error Messages

```
[Paste exact error messages]
```

#### API Calls (if applicable)

- **Endpoint**: [API endpoint]
- **Method**: [GET/POST/PUT/DELETE]
- **Request Body**:

```json
[Request data]
```

- **Response**:

```json
[Response data]
```

- **Status Code**: [HTTP status]

#### Browser Developer Tools

- **Console Errors**: [Yes/No - details above]
- **Network Issues**: [Yes/No - details above]
- **Performance Issues**: [Yes/No - describe]
- **Memory Leaks**: [Yes/No - describe]

### 🔍 Additional Context

#### Related Issues

- **Similar Bugs**: [Link to related bug reports]
- **Duplicate Of**: [Link if this is a duplicate]
- **Blocks**: [Issues this bug blocks]
- **Blocked By**: [Issues blocking this bug]

#### Workaround

- [ ] Workaround available
- **Workaround Steps**:
  1. [Step 1]
  2. [Step 2]
  3. [etc.]

#### Notes

[Any additional information, context, or observations]

---

## 🏷️ Labels/Tags

- Component: [component-name]
- Severity: [critical/high/medium/low]
- Browser: [chrome/firefox/safari/edge]
- Device: [desktop/mobile/tablet]
- Status: [open/in-progress/fixed/closed]

---

## 📋 Developer Section (to be filled by dev team)

### Root Cause Analysis

[Technical explanation of why the bug occurred]

### Fix Description

[Description of the fix implemented]

### Files Changed

- [List of files modified]

### Testing Notes

[How to verify the fix]

### Regression Risk

- [ ] Low - Isolated change
- [ ] Medium - Could affect related features
- [ ] High - Core functionality change

---

## 📊 QA Verification

### Verification Steps

1. [Step to verify fix]
2. [Step to verify fix]
3. [etc.]

### Verification Results

- [ ] Bug fixed - works as expected
- [ ] Bug partially fixed - some issues remain
- [ ] Bug not fixed - issue persists
- [ ] New issues introduced

### Regression Testing

- [ ] Related features tested
- [ ] No new issues found
- [ ] New issues found: [describe]

**Verified By**: [QA Tester Name]
**Verification Date**: [YYYY-MM-DD]

---

## 📈 Metrics

- **Time to Reproduce**: [minutes]
- **Time to Fix**: [hours/days]
- **Time to Verify**: [minutes]
- **Total Resolution Time**: [hours/days]

---

## Example Bug Reports

### Example 1: Critical AI Agent Bug

```
Bug Report #001

Severity: Critical
Component: SFDR Navigator - AI Functionality

Summary: AI agent returns "undefined" for SFDR Article 8 validation

Steps to Reproduce:
1. Navigate to /sfdr-navigator
2. Type "I need to validate an Article 8 ESG fund"
3. Press Enter
4. Observe response

Expected: Agent provides Article 8 validation guidance
Actual: Agent responds with "undefined" or error message

Impact: Blocks core SFDR Navigator functionality, prevents beta launch
```

### Example 2: UI Bug

```
Bug Report #002

Severity: Medium
Component: Landing Page - Responsive Design

Summary: Navigation menu overlaps content on mobile devices

Steps to Reproduce:
1. Open homepage on mobile device (or resize browser to 375px)
2. Click hamburger menu
3. Observe menu positioning

Expected: Menu opens without overlapping content
Actual: Menu covers main content area

Impact: Degrades mobile user experience
```

### Example 3: Performance Bug

```
Bug Report #003

Severity: High
Component: SFDR Navigator - Performance

Summary: Chat interface becomes unresponsive after 10+ messages

Steps to Reproduce:
1. Navigate to SFDR Navigator
2. Send 10+ messages in quick succession
3. Try to send another message
4. Observe interface responsiveness

Expected: Interface remains responsive
Actual: Input field becomes unresponsive, messages don't send

Impact: Affects extended user sessions, poor UX
```

---

## 🚀 Quick Bug Report (for minor issues)

**Bug**: [One-line description]
**Page**: [URL or page name]
**Browser**: [Browser/version]
**Steps**: [Quick steps to reproduce]
**Expected**: [What should happen]
**Actual**: [What happens]
**Severity**: [Critical/High/Medium/Low]

---

_Use this template for all bug reports to ensure consistency and completeness. The more detailed the report, the faster the bug can be fixed!_
