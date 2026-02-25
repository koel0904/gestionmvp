import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "koel090401@gmail.com";
  console.log(`Looking for user with email: ${email}`);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.log("User not found!");
    return;
  }

  console.log(`Found user: ${user.name} (ID: ${user.id})`);

  let local = await prisma.local.findFirst({
    where: { users: { some: { id: user.id } } },
  });

  if (!local) {
    console.log("Creating new Local...");
    local = await prisma.local.create({
      data: {
        name: "Central Hub",
        address: "123 Main Street, Suite 400",
        phone: "555-1234",
        email: "contact@centralhub.com",
        users: { connect: { id: user.id } },
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { localId: local.id },
    });
    console.log(`Created new Local ID: ${local.id}`);
  } else {
    console.log(`User belongs to Local: ${local.id}`);
  }

  const timestamp = Date.now();

  // 1. Create Subusers
  console.log("Creating Subusers...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      name: `Admin ${timestamp}`,
      email: `admin_${timestamp}@centralhub.com`,
      phone: "555-999-0001",
      password: hashedPassword,
      role: "admin",
      localId: local.id,
    },
  });

  await prisma.user.create({
    data: {
      name: `User ${timestamp}`,
      email: `user_${timestamp}@centralhub.com`,
      phone: "555-999-0002",
      password: hashedPassword,
      role: "user",
      localId: local.id,
    },
  });

  // 2. Create Proveedores
  console.log("Creating Proveedores...");
  const p1 = await prisma.proveedores.create({
    data: {
      name: `DistriCorp ${timestamp}`,
      email: `sales_${timestamp}@districorp.com`,
      phone: "111-222-3333",
      localId: local.id,
    },
  });
  const p2 = await prisma.proveedores.create({
    data: {
      name: `ACME Supplies ${timestamp}`,
      email: `info_${timestamp}@acme.com`,
      phone: "444-555-6666",
      localId: local.id,
    },
  });

  // 3. Create Inventario
  console.log("Creating Inventario...");
  const items = [];
  for (let i = 1; i <= 8; i++) {
    items.push(
      await prisma.inventario.create({
        data: {
          name: `Premium Product ${timestamp.toString().slice(-4)}-${i}`,
          precio_compra: 15 + i * 3,
          precio_venta: 40 + i * 6,
          stock: Math.floor(Math.random() * 100) + 5,
          proveedorId: i % 2 === 0 ? p1.id : p2.id,
          localId: local.id,
        },
      }),
    );
  }

  // 4. Create Clientes
  console.log("Creating Clientes...");
  const clients = [];
  for (let i = 1; i <= 5; i++) {
    clients.push(
      await prisma.clientes.create({
        data: {
          name: `Loyal Client ${timestamp.toString().slice(-4)}-${i}`,
          email: `client${i}_${timestamp}@example.com`,
          phone: `999-888-777${i}`,
          localId: local.id,
        },
      }),
    );
  }

  // 5. Create Ventas
  console.log("Creating Ventas...");
  for (let i = 1; i <= 20; i++) {
    const client = clients[i % clients.length];
    const item = items[i % items.length];
    const quantity = Math.floor(Math.random() * 4) + 1;

    await prisma.ventas.create({
      data: {
        cantidad: quantity,
        precio_venta: item.precio_venta,
        total: quantity * item.precio_venta,
        clienteId: client.id,
        inventarioId: item.id,
        localId: local.id,
        fecha: new Date(
          Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000,
        ), // random date in last 14 days
      },
    });
  }

  console.log("Database seeded successfully with new batch of data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
