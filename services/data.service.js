const fs = require('fs');

// Funcion reutilizable para leer los json
const leerDatos = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));

// Funcion reutilizable para escribir los json
 const escribirDatos = (data,path) => fs.writeFileSync(path, JSON.stringify(data, null, 2));

module.exports = { leerDatos, escribirDatos} 
