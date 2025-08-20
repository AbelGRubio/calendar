
const fs = require("fs");
const path = require("path");

// Obtener la versión desde el argumento CLI
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Error: No se proporcionó la versión.");
  process.exit(1);
}

const filePath = path.join(__dirname, "../src/constants.tsx");

// Leer el archivo
let content = fs.readFileSync(filePath, "utf8");

// Buscar y reemplazar la versión (asumiendo que hay una línea con `export const VERSION = "x.x.x";`)
const updatedContent = content.replace(/export const version = ".*?";/, `export const version = "${newVersion}";`);

// Escribir el archivo actualizado
fs.writeFileSync(filePath, updatedContent, "utf8");

console.log(`✅ Archivo constants.js actualizado a la versión ${newVersion}`);
