import swaggerAutogenFactory from 'swagger-autogen';

const swaggerAutogen = swaggerAutogenFactory();

const outputFile = './swagger-output.json'; // Output file
const endpointFiles = ['./app.js']; // API endpoint file(s)

swaggerAutogen(outputFile, endpointFiles).then(() => {
  console.log('Swagger documentation generated');
});
