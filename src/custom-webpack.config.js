const Dotenv = require('dotenv-webpack');

console.log('API Base URL:', process.env['API_BASE_URL']);
console.log('App Environment:', process.env['APP_ENV']);

module.exports = {
  plugins: [
    new Dotenv({
      path: './.env', // Ruta explícita al archivo .env
      safe: false, // Cambia a true si tienes un archivo .env.example para validación
      systemvars: true, // Cargar también variables del entorno del sistema
    }),
  ],
};
