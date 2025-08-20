import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { client, version } = req.body;

    // Validate request
    if (!client || !version) {
      return res.status(400).json({
        error: 'Missing required fields: client, version'
      });
    }

    // Check MCP server configuration
    const mcpServerUrl = process.env.MCP_SERVER_URL;
    const mcpAuthToken = process.env.MCP_AUTH_TOKEN;

    if (!mcpServerUrl || !mcpAuthToken) {
      return res.status(503).json({
        error: 'MCP server not configured',
        details: 'MCP_SERVER_URL and MCP_AUTH_TOKEN environment variables required'
      });
    }

    // Connect to MCP server
    const response = await fetch(`${mcpServerUrl}/connect`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mcpAuthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client,
        version,
        capabilities: ['testing', 'validation', 'monitoring'],
        timestamp: new Date().toISOString()
      }),
      signal: AbortSignal.timeout(10000)
    });

    if (response.ok) {
      const connectionResult = await response.json();
      
      return res.status(200).json({
        status: 'connected',
        client,
        version,
        serverInfo: connectionResult.serverInfo,
        sessionId: connectionResult.sessionId,
        timestamp: new Date().toISOString()
      });
    } else {
      const errorData = await response.text();
      return res.status(response.status).json({
        error: 'MCP connection failed',
        details: errorData,
        status: response.status
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
