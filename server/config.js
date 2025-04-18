const config = {
    PORT: 5000,
    DOMAIN_NAME: process.env.DOMAIN_NAME || 'localhost',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret',
    DB_NAME: process.env.DB_NAME || 'RRSdb',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_HOST: process.env.DB_HOST || 'localhost',
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = { config };
