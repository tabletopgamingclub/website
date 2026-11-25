import { hashPassword } from "../src/lib/password/index.js";
import { prisma } from "../src/lib/prisma.js";

const TEST_PASSWORD = "Club1234!";

const TEST_USERS = [
  { username: "lucia", name: "Lucía Fernández" },
  { username: "martin", name: "Martín Rodríguez" },
  { username: "sofia", name: "Sofía Martínez" },
  { username: "diego", name: "Diego López" },
  { username: "valentina", name: "Valentina García" },
  { username: "tomas", name: "Tomás Pérez" },
  { username: "camila", name: "Camila Sánchez" },
  { username: "juan", name: "Juan Ramírez" },
  { username: "florencia", name: "Florencia Torres" },
  { username: "nico", name: "Nicolás Acosta" },
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
      },
      update: {
        name: user.name,
        passwordHash,
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
