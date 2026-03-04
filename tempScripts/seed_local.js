import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const timestamp = Date.now();

  // 1. Create the Owner first
  console.log("Creating Owner...");
  const owner = await prisma.owner.create({
    data: {
      name: "Koel Owner",
      email: "koel090401@gmail.com",
      phone: "555-0000",
      password: hashedPassword,
      role: "owner",
    },
  });
  console.log(`Created Owner ID: ${owner.id}`);

  // 2. Create Local linked to the Owner
  console.log("Creating Local...");
  const local = await prisma.local.create({
    data: {
      name: "Central Hub",
      address: "123 Main Street, Suite 400",
      phone: "555-1234",
      email: "contact@centralhub.com",
      ownerId: owner.id,
    },
  });
  console.log(`Created Local ID: ${local.id}`);

  // 3. Create Users
  console.log("Creating Users...");
  await prisma.user.create({
    data: {
      name: "Koel Admin",
      email: "koel_admin@centralhub.com",
      phone: "555-999-0000",
      password: hashedPassword,
      role: "admin",
      localId: local.id,
      ownerId: owner.id,
    },
  });

  await prisma.user.create({
    data: {
      name: `Admin ${timestamp}`,
      email: `admin_${timestamp}@centralhub.com`,
      phone: "555-999-0001",
      password: hashedPassword,
      role: "admin",
      localId: local.id,
      ownerId: owner.id,
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
      ownerId: owner.id,
    },
  });

  // 4. Create Proveedores
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

  // 5. Create Inventario
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

  // 6. Create Clientes
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

  // 7. Create Ventas
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
        ),
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   Owner: ${owner.email} (ID: ${owner.id})`);
  console.log(`   Local: ${local.name} (ID: ${local.id})`);
  console.log(`   Users: 3 (password: password123)`);
  console.log(`   Proveedores: 2, Inventario: 8, Clientes: 5, Ventas: 20`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
