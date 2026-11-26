import { hashPassword } from "../src/lib/password/index.js";
import { prisma } from "../src/lib/prisma.js";

const TEST_PASSWORD = "Club1234!";

const TEST_USERS = [
  { username: "lucia", name: "Lucía Fernández", role: "ADMIN" },
  { username: "martin", name: "Martín Rodríguez", role: "SOCIO" },
  { username: "sofia", name: "Sofía Martínez", role: "SOCIO" },
  { username: "diego", name: "Diego López", role: "ADMIN" },
  { username: "valentina", name: "Valentina García", role: "SOCIO" },
  { username: "tomas", name: "Tomás Pérez", role: "SOCIO" },
  { username: "camila", name: "Camila Sánchez", role: "SOCIO" },
  { username: "juan", name: "Juan Ramírez", role: "SOCIO" },
  { username: "florencia", name: "Florencia Torres", role: "SOCIO" },
  { username: "nico", name: "Nicolás Acosta", role: "SOCIO" },
] as const;

async function main(): Promise<void> {
  for (const user of TEST_USERS) {
    const passwordHash = await hashPassword(TEST_PASSWORD);

    await prisma.user.upsert({
      where: { username: user.username },
      create: {
        username: user.username,
        name: user.name,
        passwordHash,
        role: user.role,
      },
      update: {
        name: user.name,
        passwordHash,
        role: user.role,
      },
    });
  }

  console.log(`Se sembraron ${TEST_USERS.length} usuarios de prueba.`);
  console.log(`Contraseña para todos: ${TEST_PASSWORD}`);
  console.log(`Usuarios: ${TEST_USERS.map((user) => user.username).join(", ")}`);
}

try {
  await main();
} catch (error) {
  console.error("No se pudieron sembrar los datos:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
