export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    initialBalance: 500000,
  });