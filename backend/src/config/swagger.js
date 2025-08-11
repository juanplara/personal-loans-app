// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
        title: 'API de Control de Préstamos',
        version: '1.0.0',
        description: 'Documentación de la API para gestionar préstamos personales',
        },
        servers: [
        {
            url: 'http://localhost:5000/api',
            description: 'Servidor local',
        },
        ],
        components: {
        securitySchemes: {
            bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            },
        },
        },
        security: [{
        bearerAuth: [],
        }],
    },
    apis: ['./routes/*.js'], // Aquí Swagger buscará los comentarios de tus rutas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
