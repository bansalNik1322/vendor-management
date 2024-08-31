import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PurchaseOrderModel } from 'src/models/entities/purchaseOrder.model';
import { VendorModel } from 'src/models/entities/vendor.model';
import { CreateVendorDTO, UpdateVendorDTO } from '../dtos/vendor.dto';

@Injectable()
export class VendorService {
  async createVendor(payload: CreateVendorDTO) {
    try {
      const vendorExistsOrNot = await VendorModel.findOne({
        where: {
          email: payload.email,
          isDeleted: 0,
        },
      });

      if (vendorExistsOrNot)
        throw new HttpException(
          'Vendor already Exists!!',
          HttpStatus.BAD_REQUEST,
        );

      await VendorModel.create(payload);
      return {
        status: true,
        code: HttpStatus.CREATED,
        message: 'Vendor Created Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllVendors() {
    try {
      const vendors = await VendorModel.findAndCountAll({
        attributes: [
          ['id', 'vendorCode'],
          'name',
          'email',
          'address',
          'qualityRatingAvg',
        ],
        where: {
          isDeleted: 0,
        },
      });
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Vendor Fetched Successfully!!',
        data: {
          vendors: vendors.rows,
          total: vendors.count,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getVendorById(id: number) {
    try {
      const vendor = await VendorModel.findOne({
        where: {
          id: id,
          isDeleted: 0,
        },
        attributes: [
          ['id', 'vendorCode'],
          'name',
          'email',
          'address',
          'qualityRatingAvg',
        ],
      });
      if (!vendor)
        throw new HttpException('Invalid Vendor id', HttpStatus.BAD_REQUEST);
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Vendor Fetched Successfully!!',
        data: {
          vendor,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateVendor(id: number, payload: UpdateVendorDTO) {
    const vendor = await VendorModel.findOne({
      where: {
        id: id,
        isDeleted: 0,
      },
    });
    if (!vendor)
      throw new HttpException('Invalid Vendor id', HttpStatus.BAD_REQUEST);
    if (payload.name) vendor.name = payload.name;
    if (payload.email) vendor.email = payload.email;

    await vendor.save();
    try {
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Vendor updated successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteVendor(id: number) {
    try {
      const vendor = await VendorModel.findOne({
        where: {
          id: id,
          isDeleted: 0,
        },
      });
      if (!vendor)
        throw new HttpException('Invalid Vendor id', HttpStatus.BAD_REQUEST);

      const assignedOrNot = await PurchaseOrderModel.findOne({
        where: {
          vendor: vendor.id,
        },
      });

      if (assignedOrNot)
        throw new HttpException(
          "Vendor Has some uncomplete orders, so you can't delete this vendor",
          HttpStatus.BAD_REQUEST,
        );

      vendor.isDeleted = true;
      await vendor.save();

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Vendor Deleted Successfully!!',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getVendorPerformance(vendorId) {
    try {
      const vendor = await VendorModel.findOne({
        where: {
          id: vendorId,
          isDeleted: 0,
        },
      });
      if (!vendor)
        throw new HttpException('Invalid Vendor id', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Success!!',
        data: {
          averageResponseTime:
            vendor.averageResponseTime || 'No Data Available!!',
          onTimeDeliveryRate: vendor.fullfillmentRate || 'No Data Avarilable!!',
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
