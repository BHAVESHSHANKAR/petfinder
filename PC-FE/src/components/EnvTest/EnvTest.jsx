import React, { useEffect, useState } from 'react';
import { Alert, Typography } from 'antd';

const { Text } = Typography;

const EnvTest = () => {
  const [envStatus, setEnvStatus] = useState({
    isLoaded: false,
    apiUrl: import.meta.env.VITE_API_URL || null,
    nodeEnv: import.meta.env.MODE || null,
    isDev: import.meta.env.DEV || null,
    isProd: import.meta.env.PROD || null,
    allEnvVars: {}
  });

  useEffect(() => {
    // Collect all environment variables with VITE_ prefix
    const viteEnvVars = {};
    Object.keys(import.meta.env).forEach(key => {
      if (key.startsWith('VITE_')) {
        viteEnvVars[key] = import.meta.env[key];
      }
    });

    setEnvStatus({
      isLoaded: true,
      apiUrl: import.meta.env.VITE_API_URL || null,
      nodeEnv: import.meta.env.MODE || null,
      isDev: import.meta.env.DEV || null,
      isProd: import.meta.env.PROD || null,
      allEnvVars: viteEnvVars
    });
  }, []);

  if (!envStatus.isLoaded) {
    return <div>Loading environment variables...</div>;
  }

  const hasApiUrl = !!envStatus.apiUrl;

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <Alert
        type={hasApiUrl ? "success" : "error"}
        message={hasApiUrl ? "Environment Variables Loaded Successfully" : "API URL Not Found"}
        description={
          hasApiUrl 
            ? `VITE_API_URL is set to: ${envStatus.apiUrl}`
            : "The VITE_API_URL environment variable is not set. Please check your .env file."
        }
        showIcon
        style={{ marginBottom: '16px' }}
      />

      <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '4px' }}>
        <Typography.Title level={5}>Environment Information:</Typography.Title>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Text strong>Node Environment:</Text> {envStatus.nodeEnv}</li>
          <li><Text strong>Development Mode:</Text> {envStatus.isDev ? "Yes" : "No"}</li>
          <li><Text strong>Production Mode:</Text> {envStatus.isProd ? "Yes" : "No"}</li>
        </ul>

        <Typography.Title level={5} style={{ marginTop: '16px' }}>Available VITE_ Environment Variables:</Typography.Title>
        {Object.keys(envStatus.allEnvVars).length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {Object.entries(envStatus.allEnvVars).map(([key, value]) => (
              <li key={key}><Text strong>{key}:</Text> {value}</li>
            ))}
          </ul>
        ) : (
          <Text type="warning">No VITE_ environment variables found.</Text>
        )}
      </div>
    </div>
  );
};

export default EnvTest;
