# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/720c14e8-6905-43b8-8578-d76972eb4120

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/720c14e8-6905-43b8-8578-d76972eb4120) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## ESG Data Integration

This project integrates with **NayaOne Global ESG Company Ratings (2022-2023) Dataset** to provide real-time ESG scores and sustainability metrics for SFDR compliance analysis.

### NayaOne ESG Data Features

- **Comprehensive Coverage**: Global ESG company ratings from 2022-2023
- **Multi-dimensional Scoring**: Environmental, Social, and Governance scores
- **SFDR Compliance**: Principal Adverse Impact (PAI) indicators and taxonomy alignment
- **Real-time Updates**: Automatic data fetching with pagination support
- **Data Quality Assessment**: Built-in completeness and reliability scoring

### API Configuration

To use the NayaOne ESG data integration, you need to configure your API key:

1. **Get your NayaOne Sandpit API Key**:
   - Visit [NayaOne Data Platform](https://data.nayaone.com/esg_scores)
   - Sign up for an account and obtain your sandpit API key

2. **Configure Environment Variables**:
   ```bash
   # Add to your .env file
   NAYAONE_SANDPIT_KEY=your-actual-sandpit-api-key
   ```

3. **API Usage**:
   ```javascript
   // The integration automatically handles:
   // - Pagination (10 records per request)
   // - Rate limiting compliance
   // - Data transformation to internal format
   // - Error handling and retries
   ```

### Data Structure

The NayaOne integration provides:

```typescript
interface ESGData {
  provider: 'nayaone';
  companyId: string;
  companyName: string;
  ticker: string;
  sector: string;
  industry: string;
  country: string;
  esgScore: {
    overall: number;
    environmental: number;
    social: number;
    governance: number;
  };
  sfdrIndicators: {
    principalAdverseImpacts: object;
    taxonomyAlignment: number;
    sustainableInvestment: number;
  };
  dataQuality: {
    completeness: number;
    reliability: string;
    source: string;
  };
}
```

### SFDR Navigator Agent Integration

The ESG data is automatically integrated into the SFDR Navigator Agent for:

- **Risk Analysis**: Climate, biodiversity, social, and governance risk assessment
- **Compliance Checking**: Article 8/9 compliance, PAI disclosure requirements
- **Report Generation**: Automated SFDR disclosure reports with ESG metrics
- **Real-time Monitoring**: Continuous compliance monitoring with live ESG data

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/720c14e8-6905-43b8-8578-d76972eb4120) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
