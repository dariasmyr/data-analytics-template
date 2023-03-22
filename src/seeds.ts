import { PrismaClient } from '@prisma/client';

import { Logger } from './logger/logger';
import { DatabaseRepository } from './sqlite-converter-service/database-repository';
const prisma = new PrismaClient();
const logger = new Logger('Seeds');
const sqliteConverterService = new DatabaseRepository();

// eslint-disable-next-line complexity
async function seedDatabase() {
  await sqliteConverterService.deleteAll();
  logger.debug('Seeding database');

  // Create categories
  const electronics = await prisma.categories.create({
    data: {
      name: 'Electronics',
    },
  });

  const clothing = await prisma.categories.create({
    data: {
      name: 'Clothing',
    },
  });

  // Create products
  const iphone = await prisma.products.create({
    data: {
      name: 'iPhone 13',
      description: 'The latest iPhone model',
      price: 999.99,
      categoryId: electronics.id,
    },
  });

  const macbook = await prisma.products.create({
    data: {
      name: 'MacBook Pro',
      description: 'Powerful laptop for professionals',
      price: 1999.99,
      categoryId: electronics.id,
    },
  });

  const shirt = await prisma.products.create({
    data: {
      name: 'Blue shirt',
      description: 'Comfortable cotton shirt',
      price: 29.99,
      categoryId: clothing.id,
    },
  });

  const pants = await prisma.products.create({
    data: {
      name: 'Black pants',
      description: 'Stylish pants for any occasion',
      price: 59.99,
      categoryId: clothing.id,
    },
  });

  // Create users
  const john = await prisma.users.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123',
    },
  });

  const jane = await prisma.users.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: '1235',
    },
  });

  // Create customers
  const johnCustomer = await prisma.customers.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      userId: john.id,
    },
  });

  const janeCustomer = await prisma.customers.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      userId: jane.id,
    },
  });

  // Create product categories
  await prisma.productCategories.create({
    data: {
      productId: iphone.id,
      categoryId: electronics.id,
    },
  });

  await prisma.productCategories.create({
    data: {
      productId: macbook.id,
      categoryId: electronics.id,
    },
  });

  await prisma.productCategories.create({
    data: {
      productId: shirt.id,
      categoryId: clothing.id,
    },
  });

  await prisma.productCategories.create({
    data: {
      productId: pants.id,
      categoryId: clothing.id,
    },
  });

  // Create orders
  const order1 = await prisma.orders.create({
    data: {
      customerId: johnCustomer.id,
      orderDate: new Date('2021-01-01'),
      totalAmount: 999.99,
      status: 'COMPLETED',
    },
  });

  const order2 = await prisma.orders.create({
    data: {
      customerId: janeCustomer.id,
      orderDate: new Date('2021-01-01'),
      totalAmount: 59.99,
      status: 'COMPLETED',
    },
  });

  // Create order items
  await prisma.orderItems.create({
    data: {
      productId: iphone.id,
      orderId: order1.id,
      quantity: 1,
      unitPrice: 999.99,
    },
  });

  await prisma.orderItems.create({
    data: {
      productId: pants.id,
      orderId: order2.id,
      quantity: 1,
      unitPrice: 59.99,
    },
  });

  logger.debug('Database seeded');
}

async function main() {
  await seedDatabase();
}

main()
  // eslint-disable-next-line promise/always-return,@typescript-eslint/no-empty-function
  .then(() => {})
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error) => {
    logger.error('Error seeding database', error);
  });
