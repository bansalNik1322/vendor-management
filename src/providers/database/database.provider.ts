import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { models } from 'src/models';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        port: 3306,
        dialect: 'mysql',
        host: 'localhost',
        username: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'vendor-management',
      });
      sequelize.addModels(models);
      await sequelize.sync();
      return sequelize;
    },
  },
];
