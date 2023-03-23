import { PrismaClient } from '@prisma/client';

import { Logger } from '../logger/logger';

export class SqliteDatabaseRepository {
  public prisma: PrismaClient;
  private readonly logger: Logger;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger('SqliteDatabaseRepository');
  }

  // eslint-disable-next-line complexity
  async deleteAll() {
    this.logger.debug('Deleting all data from the database');
    await this.prisma.productCategories.deleteMany();
    await this.prisma.orderItems.deleteMany();
    await this.prisma.products.deleteMany();
    await this.prisma.orders.deleteMany();
    await this.prisma.customers.deleteMany();
    await this.prisma.users.deleteMany();
    await this.prisma.categories.deleteMany();
    // Check if the database is empty
    const categories = await this.prisma.categories.findMany();
    const users = await this.prisma.users.findMany();
    const products = await this.prisma.products.findMany();
    const customers = await this.prisma.customers.findMany();
    const productCategories = await this.prisma.productCategories.findMany();
    const orders = await this.prisma.orders.findMany();
    const orderItems = await this.prisma.orderItems.findMany();
    if (
      categories.length === 0 &&
      products.length === 0 &&
      users.length === 0 &&
      customers.length === 0 &&
      productCategories.length === 0 &&
      orders.length === 0 &&
      orderItems.length === 0
    ) {
      this.logger.debug('The database is empty');
      return true;
    } else {
      this.logger.error('The database is not empty');
      return false;
    }
  }
}
