import { Get } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateVendorDTO, UpdateVendorDTO } from '../dtos/vendor.dto';
import { VendorService } from '../services/vendor.service';

@Controller('vendor')
@UseGuards(AuthGuard)
export class VendorController {
  constructor(private readonly _vendorService: VendorService) {}
  @Post('create')
  async createVendor(@Body() payload: CreateVendorDTO) {
    return this._vendorService.createVendor(payload);
  }

  @Get('')
  async getAllVendors() {
    return await this._vendorService.getAllVendors();
  }

  @Get(':id')
  async getVendorById(@Param() params: { id: number }) {
    return await this._vendorService.getVendorById(params.id);
  }

  @Put(':id')
  async updateVendor(
    @Body() payload: UpdateVendorDTO,
    @Param() params: { id: number },
  ) {
    return await this._vendorService.updateVendor(params.id, payload);
  }

  @Delete(':id')
  async deleteVendor(@Param() params: { id: number }) {
    return await this._vendorService.deleteVendor(params.id);
  }

  @Get('performance/:id')
  async getVendorPerformace(@Param() params: { id: number }) {
    return await this._vendorService.getVendorPerformance(params.id);
  }
}
