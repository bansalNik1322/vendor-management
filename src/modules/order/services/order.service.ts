import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { col, fn } from 'sequelize';
import { HistoricalPerformanceModel } from 'src/models/entities/historicalPerformance.model';
import { PurchaseOrderModel } from 'src/models/entities/purchaseOrder.model';
import { VendorModel } from 'src/models/entities/vendor.model';
import { CreatePurchaseOrder, UpdatePurchaseOrder } from '../dtos/order.dto';

@Injectable()
export class OrderService {
  async createPurchaseOrder(payload: CreatePurchaseOrder) {
    try {
      const vendorExistsOrNot = await VendorModel.findOne({
        where: {
          isDeleted: 0,
          id: payload.vendor,
        },
      });

      if (!vendorExistsOrNot)
        throw new HttpException(
          'There is no such vendor with this Id!!',
          HttpStatus.BAD_REQUEST,
        );

      await PurchaseOrderModel.create({
        items: payload.items,
        vendor: payload.vendor,
        quanitity: payload.quantity,
      });

      return {
        status: true,
        message: 'Order Placed Successfully!!',
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllPurchaseOrder() {
    try {
      const orders = await PurchaseOrderModel.findAndCountAll({
        where: {
          isDeleted: 0,
        },
      });
      return {
        status: true,
        message: 'Order Fetched Successfully!!',
        code: HttpStatus.OK,
        data: {
          orders: orders.rows,
          total: orders.count,
        },
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPurchaseOrderById(id: number) {
    try {
      const order = await PurchaseOrderModel.findOne({
        where: {
          id: id,
          isDeleted: 0,
        },
      });

      if (!order)
        throw new HttpException('Invalid Order id', HttpStatus.BAD_REQUEST);

      return {
        status: true,
        message: 'Order Placed Successfully!!',
        code: HttpStatus.OK,
        data: order,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePurchaseOrder(id: number, payload: UpdatePurchaseOrder) {
    try {
      const order = await PurchaseOrderModel.findOne({
        where: {
          id: id,
          isDeleted: 0,
        },
      });
      if (!order)
        throw new HttpException('Invalid Order id', HttpStatus.BAD_REQUEST);

      if (payload.items) order.items = payload.items;
      if (payload.quantity) order.quanitity = payload.quantity;
      await order.save();

      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Order Updated Sucessfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deletePurchaseOrder(id: number) {
    try {
      const order = await PurchaseOrderModel.findOne({
        where: {
          id: id,
          isDeleted: 0,
        },
      });

      if (!order)
        throw new HttpException('Invalid Order id', HttpStatus.BAD_REQUEST);

      if (order.status === 'dispatched' || order.status === 'delivered')
        throw new HttpException(
          "Order has been either delivered or dispatched, so you can't cancel it",
          HttpStatus.BAD_REQUEST,
        );

      order.isDeleted = true;
      await order.save();
      return {
        status: true,
        message: 'Order Deleted Successfully!!',
        code: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAcknowledgement(payload: {
    orderId: number;
    acknowledgeDate: Date;
    status: string;
  }) {
    try {
      const { orderId } = payload;
      const order = await PurchaseOrderModel.findOne({
        where: {
          id: orderId || null,
          isDeleted: 0,
        },
      });

      if (order.status === 'delivered')
        throw new HttpException(
          'Order has been delivered',
          HttpStatus.BAD_REQUEST,
        );

      if (!order)
        throw new HttpException('Invalid Order id', HttpStatus.BAD_REQUEST);

      if (
        !payload.status ||
        !['delivered', 'dispatched'].includes(payload.status)
      ) {
        throw new HttpException(
          'Please provide a valid status',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (payload.status === 'delivered' && !order.status)
        throw new HttpException(
          'Order still not dispatched, So you can not change the status to delivered',
          HttpStatus.BAD_REQUEST,
        );

      if (!order.acknowledgeDate) {
        order.acknowledgeDate = new Date();
        await order.save();
        const responseTime = Math.floor(
          (new Date(order.acknowledgeDate).getTime() -
            new Date(order.orderDate).getTime()) /
            1000 /
            60,
        );

        await HistoricalPerformanceModel.create({
          vendorId: order.vendor,
          averageResponseTime: responseTime,
          fullFillMentRate: payload.status === 'delivered' ? 1 : 0,
        });
      }

      if (payload.status === 'delivered') {
        await HistoricalPerformanceModel.create({
          vendorId: order.vendor,
          fullFillMentRate: 1,
        });
      }
      order.status = payload.status;
      await order.save();

      const vendor = await VendorModel.findByPk(order.vendor);
      const historicalPerformace: any =
        await HistoricalPerformanceModel.findOne({
          where: {
            vendorId: order.vendor,
          },
          attributes: [
            [fn('AVG', col('averageResponseTime')), 'averageResponseTime'],
            [fn('SUM', col('fullFillMentRate')), 'fulfilledCount'],
            [fn('COUNT', col('fullFillMentRate')), 'totalCount'],
          ],
          raw: true,
        });
      const fulfilledCount = parseFloat(historicalPerformace.fulfilledCount);
      const totalCount = parseFloat(historicalPerformace.totalCount);

      const fulfillmentRatePercentage =
        totalCount > 0 ? (fulfilledCount / totalCount) * 100 : 0;

      vendor.averageResponseTime = historicalPerformace.averageResponseTime;
      vendor.fullfillmentRate = fulfillmentRatePercentage;

      await vendor.save();
      return {
        status: true,
        code: HttpStatus.OK,
        message: 'Success',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
