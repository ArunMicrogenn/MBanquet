// PM2 Ecosystem File for Banquet Hall Management Suite
// VPS Deployment at 72.61.240.34

module.exports = {
  apps: [
    {
      name: 'banquet-management-suite',
      script: './dist/server.cjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      }
    }
  ]
};
