// config/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

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
                url: 'http://localhost:5000',
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
            schemas: {
                Loan: {
                    type: 'object',
                    required: ['amount', 'interestRate', 'days'],
                    properties: {
                        amount: {
                            type: 'number',
                            example: 1000
                        },
                        interestRate: {
                            type: 'number',
                            example: 5
                        },
                        days: {
                            type: 'integer',
                            example: 30
                        },
                        interestLost: {
                            type: 'number',
                            example: 41.1
                        },
                        totalPayable: {
                            type: 'number',
                            example: 1041.1
                        }
                    }
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
    },
    apis: [path.join(__dirname, '../routes/*.js')], // Ahora funciona con ruta absoluta
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
