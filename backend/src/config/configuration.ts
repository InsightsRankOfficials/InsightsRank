export default () => ({
  environment: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'default_access_secret_key_32chars_min',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key_32chars_min',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
});
