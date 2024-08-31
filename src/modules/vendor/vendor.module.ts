import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VendorController } from './controllers/vendor.controller';
import { VendorService } from './services/vendor.service';

@Module({
  controllers: [VendorController],
  providers: [VendorService, JwtService],
})
export class VendorModule {}
