import { loadEnvConfig } from "@next/env";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

loadEnvConfig(process.cwd());

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function upsertBrandChallenge(data: {
  brandId: string;
  title: string;
  description: string;
  status: string;
  type: string;
  reward: string;
}) {
  const existingChallenge = await prisma.brandChallenge.findFirst({
    where: {
      brandId: data.brandId,
      title: data.title,
    },
  });

  if (existingChallenge) {
    return prisma.brandChallenge.update({
      where: { id: existingChallenge.id },
      data,
    });
  }

  return prisma.brandChallenge.create({ data });
}

async function main() {
  const passwordHash = await bcrypt.hash("demo12345", 12);

  await prisma.user.upsert({
    where: { email: "demo-user@challenger.local" },
    update: {
      passwordHash,
      name: "Алекс",
      city: "Москва",
      coinsBalance: 1250,
    },
    create: {
      email: "demo-user@challenger.local",
      passwordHash,
      name: "Алекс",
      city: "Москва",
      coinsBalance: 1250,
    },
  });

  const hlebnik = await prisma.brand.upsert({
    where: { slug: "hlebnik-dev" },
    update: {
      name: "Хлебник Dev",
      category: "Булочная",
      city: "Москва",
      address: "ул. Арбат, д.3",
      description: "Тестовая булочная для локальной разработки",
    },
    create: {
      name: "Хлебник Dev",
      slug: "hlebnik-dev",
      category: "Булочная",
      city: "Москва",
      address: "ул. Арбат, д.3",
      description: "Тестовая булочная для локальной разработки",
    },
  });

  const coffee = await prisma.brand.upsert({
    where: { slug: "coffee-dev" },
    update: {
      name: "Coffee Dev",
      category: "Кофейня",
      city: "Москва",
      address: "Пятницкая, 10",
      description: "Тестовая кофейня для локального демо",
    },
    create: {
      name: "Coffee Dev",
      slug: "coffee-dev",
      category: "Кофейня",
      city: "Москва",
      address: "Пятницкая, 10",
      description: "Тестовая кофейня для локального демо",
    },
  });

  await prisma.brandMember.upsert({
    where: { email: "demo-brand@challenger.local" },
    update: {
      brandId: hlebnik.id,
      passwordHash,
      role: "owner",
      name: "Владелец Хлебник Dev",
    },
    create: {
      brandId: hlebnik.id,
      email: "demo-brand@challenger.local",
      passwordHash,
      role: "owner",
      name: "Владелец Хлебник Dev",
    },
  });

  await upsertBrandChallenge({
    brandId: hlebnik.id,
    title: "Утренний круассан",
    description: "Купите выпечку до 11:00 и получите бонусные монеты.",
    status: "active",
    type: "purchase",
    reward: "150 монет",
  });

  await upsertBrandChallenge({
    brandId: coffee.id,
    title: "Кофейный маршрут",
    description: "Загляните за кофе и отметьте визит в приложении.",
    status: "draft",
    type: "visit",
    reward: "100 монет",
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Dev seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
