// =============================================================
// Kuhlturm - Backend PM2 config (Bun + Fastify)
// cwd: /var/www/kuhlturm/backend
// =============================================================

module.exports = {
  apps: [
    {
      name: 'kuhlturm-backend',
      cwd: '/var/www/kuhlturm/backend',
      script: '/usr/local/bin/bun',
      args: 'dist/index.js',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '350M',
      min_uptime: '30s',
      max_restarts: 10,
      restart_delay: 5000,
      kill_timeout: 8000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: '8089',
      },
      out_file: '/home/orhan/.pm2/logs/kuhlturm-backend.out.log',
      error_file: '/home/orhan/.pm2/logs/kuhlturm-backend.err.log',
      combine_logs: true,
      time: true,
    },
  ],
};
