import { prisma } from "../src/lib/prisma.js";

function main(): void {
  // Los datos de ejemplo se agregan cuando el modelo de dominio esté definido.
  console.log("No hay datos para sembrar todavía.");
}

try {
  main();
} finally {
  await prisma.$disconnect();
}
