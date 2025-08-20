export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    // Check MCP server configuration
    const mcpServerUrl = process.env.MCP_SERVER_URL;
    const mcpAuthToken = process.env.MCP_AUTH_TOKEN;
    if (!mcpServerUrl || !mcpAuthToken) {
      return res.status(503).json({
        error: 'MCP server not configured',
        capabilities: {
          aiTestGeneration: false,
          visualRegression: false,
          performanceTesting: false,
          securityTesting: false,
          complianceValidation: false
        }
      });
    }
    // Get capabilities from MCP server
    const response = await fetch(`${mcpServerUrl}/capabilities`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mcpAuthToken}`,
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(10000)
    });
    if (response.ok) {
      const mcpCapabilities = await response.json();
      // Map MCP capabilities to our testing framework
      const capabilities = {
        aiTestGeneration: mcpCapabilities.aiTestGeneration || false,
        visualRegression: mcpCapabilities.visualRegression || false,
        performanceTesting: mcpCapabilities.performanceTesting || false,
        securityTesting: mcpCapabilities.securityTesting || false,
        complianceValidation: mcpCapabilities.complianceValidation || false,
        realTimeMonitoring: mcpCapabilities.realTimeMonitoring || false
      };
      return res.status(200).json({
        status: 'available',
        capabilities,
        mcpServer: mcpServerUrl,
        timestamp: new Date().toISOString()
      });
    } else {
      // Return fallback capabilities if MCP server is unavailable
      return res.status(200).json({
        status: 'unavailable',
        capabilities: {
          aiTestGeneration: false,
          visualRegression: false,
          performanceTesting: false,
          securityTesting: false,
          complianceValidation: false,
          realTimeMonitoring: false
        },
        reason: 'MCP server not responding',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: 'unavailable',
      capabilities: {
        aiTestGeneration: false,
        visualRegression: false,
        performanceTesting: false,
        securityTesting: false,
        complianceValidation: false,
        realTimeMonitoring: false
      },
      reason: 'MCP server connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
