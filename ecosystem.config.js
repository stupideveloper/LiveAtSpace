module.exports = {
  apps: [
    {
      name: 'liveatspace-backend',
      cwd: '/home/ubuntu/LiveAtSpace-Backend',
      script: 'npm',
      args: 'develop',
      env: {
        NODE_ENV: 'production',
        DATABASE_HOST: 'your-unique-url.rds.amazonaws.com', // database Endpoint under 'Connectivity & Security' tab
      },
    },
  ],
};
