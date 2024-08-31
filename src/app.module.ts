import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { DatbaseModule } from './providers/database/database.module';

@Module({
  imports: [DatbaseModule, AuthModule, OrderModule, VendorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
