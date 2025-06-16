import entity from '@/schemas/fire/entity.json';
import security from '@/schemas/fire/security.json';
import customer from '@/schemas/fire/customer.json';
import account from '@/schemas/fire/account.json';
import adjustment from '@/schemas/fire/adjustment.json';
import agreement from '@/schemas/fire/agreement.json';
import batch from '@/schemas/fire/batch.json';
import collateral from '@/schemas/fire/collateral.json';
import common from '@/schemas/fire/common.json';
import curve from '@/schemas/fire/curve.json';
import derivative from '@/schemas/fire/derivative.json';
import exchangeRate from '@/schemas/fire/exchange_rate.json';
import guarantor from '@/schemas/fire/guarantor.json';
import issuer from '@/schemas/fire/issuer.json';
import loan from '@/schemas/fire/loan.json';
import loanCashFlow from '@/schemas/fire/loan_cash_flow.json';
import loanTransaction from '@/schemas/fire/loan_transaction.json';
import riskRating from '@/schemas/fire/risk_rating.json';
const FireSchemas = {
  entity,
  security,
  customer,
  account,
  adjustment,
  agreement,
  batch,
  collateral,
  common,
  curve,
  derivative,
  exchangeRate,
  guarantor,
  issuer,
  loan,
  loanCashFlow,
  loanTransaction,
  riskRating
};

export type FireSchema = keyof typeof FireSchemas;

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  allErrors: true,
  strict: false, // Allow custom keywords
  strictSchema: false,
  strictTypes: false,
  strictRequired: false
});
addFormats(ajv);

// Map of schema names to their original GitHub URLs
const schemaUrlMap: Record<string, string> = {
  entity: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/entity.json',
  security: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/security.json',
  customer: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/customer.json',
  account: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/account.json',
  adjustment: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/adjustment.json',
  agreement: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/agreement.json',
  batch: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/batch.json',
  collateral: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/collateral.json',
  common: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/common.json',
  curve: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/curve.json',
  derivative: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/derivative.json',
  exchangeRate: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/exchange_rate.json',
  guarantor: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/guarantor.json',
  issuer: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/issuer.json',
  loan: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan.json',
  loanCashFlow: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan_cash_flow.json',
  loanTransaction: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/loan_transaction.json',
  riskRating: 'https://raw.githubusercontent.com/SuadeLabs/fire/master/schemas/risk_rating.json',
};

// Register schemas with Ajv using their original $id
for (const [name, schema] of Object.entries(FireSchemas)) {
  const url = schemaUrlMap[name];
  if (url) {
    // Clone schema and set $id
    const schemaWithId = { ...schema, $id: url };
    ajv.addSchema(schemaWithId, url);
  }
}

// Add all schemas to Ajv
for (const [name, schema] of Object.entries(FireSchemas)) {
  // Replace GitHub URLs with local references
  const schemaStr = JSON.stringify(schema).replace(
    /https:\/\/raw\.githubusercontent\.com\/SuadeLabs\/fire\/master\/schemas\//g,
    '#'
  );
  const localSchema = JSON.parse(schemaStr);
  ajv.addSchema(localSchema, name);
}

export function validateResponse(schemaType: FireSchema, data: unknown): boolean {
  const schema = FireSchemas[schemaType];
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    console.error('Validation errors:', validate.errors);
    throw new Error(`Invalid ${schemaType} data: ${ajv.errorsText(validate.errors)}`);
  }
  
  return true;
}

export type FireApiEndpoint = 
  | '/fire/entities'
  | '/fire/securities'
  | '/fire/customers'
  | '/fire/accounts';

export async function fetchRegulatory<T>(endpoint: FireApiEndpoint, id: string): Promise<T> {
  const res = await fetch(`/api${endpoint}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
  }
  const data = await res.json();
  validateResponse(getSchemaTypeFromEndpoint(endpoint), data);
  return data as T;
}

export async function fetchRegulatoryList<T>(endpoint: FireApiEndpoint, params?: Record<string, string>): Promise<T[]> {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`/api${endpoint}${queryString}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${endpoint}: ${res.statusText}`);
  }
  const data = await res.json();
  
  // Determine schema type from endpoint
  const schemaType = endpoint.split('/')[2].slice(0, -1) as keyof typeof FireSchemas;
  data.forEach((item: unknown) => validateResponse(schemaType, item));
  
  return data as T[];
}

function getSchemaTypeFromEndpoint(endpoint: FireApiEndpoint): FireSchema {
  switch (endpoint) {
    case '/fire/entities':
      return 'entity';
    case '/fire/securities':
      return 'security';
    case '/fire/customers':
      return 'customer';
    case '/fire/accounts':
      return 'account';
    default:
      throw new Error(`Unknown endpoint: ${endpoint}`);
  }
}
