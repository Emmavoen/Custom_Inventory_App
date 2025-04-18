const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { logger } = require("../logger");
const { config } = require("../config");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Project X API",
            version: "1.0.0",
            description: "API documentation for Project X",
        },
        components: {
            securitySchemas: {
                bearAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: `http://${config.DOMAIN_NAME}:${config.PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
    // Swagger page
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    // Docs in JSON format
    app.get('docs.json', (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    const log = logger.child();
    log.info(`Docs available at http://${config.DOMAIN_NAME}:${config.PORT}/api-docs`);
};


module.exports = { setupSwagger };
