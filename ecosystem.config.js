module.exports = {
  apps: [{
    name: 'qidian-dmca',
    script: './dist/main.js',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    }
  }],
}