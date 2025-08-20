import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check MCP server availability
    const mcpServerUrl = process.env.MCP_SERVER_URL;
    const mcpAuthToken = process.env.MCP_AUTH_TOKEN;

    if (!mcpServerUrl || !mcpAuthToken) {
      return res.status(200).json({
        status: 'unavailable',
        reason: 'MCP server not configured',
        timestamp: new Date().toISOString()
      });
    }

    // Test connection to MCP server
    const response = await fetch(`${mcpServerUrl}/health`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mcpAuthToken}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const mcpStatus = await response.json();
      return res.status(200).json({
        status: 'available',
        mcpServer: mcpServerUrl,
        mcpStatus,
        timestamp: new Date().toISOString()
      });
    } else {
      return res.status(200).json({
        status: 'unavailable',
        reason: 'MCP server not responding',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: 'unavailable',
      reason: 'MCP server connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
