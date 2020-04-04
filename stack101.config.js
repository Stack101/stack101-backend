module.exports = {
  apps: [
    {
      name: 'stack101',
      script: './server.js',
      env: {
        NODE_PATH: './',
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_PATH: './',
        NODE_ENV: 'production',
      },
    },
  ],
};
