import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { translateErrors } from './common/helpers/global.helper';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false,
      transform: true,
      validationError: {
        target: false,
      },
      exceptionFactory: translateErrors,
      forbidUnknownValues: false,
    }),
  );

  app.use(
    session({
      secret: 'thisisoursecret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
      },
      store: new session.MemoryStore(),
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
