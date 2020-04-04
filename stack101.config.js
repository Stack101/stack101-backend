module.exports = {
  apps: [
    {
      name: 'stack101',
      script: './app.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
