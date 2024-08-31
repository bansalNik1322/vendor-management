import { Get } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Put } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { CreatePurchaseOrder, UpdatePurchaseOrder } from '../dtos/order.dto';
import { OrderService } from '../services/order.service';

@Controller('purchase-order')
export class OrderController {
  constructor(private readonly _orderService: OrderService) {}
  @Post('create')
  async createPurchaseOrder(@Body() payload: CreatePurchaseOrder) {
    return this._orderService.createPurchaseOrder(payload);
  }

  @Get('')
  async getAllPurchaseOrders() {
    return await this._orderService.getAllPurchaseOrder();
  }

  @Get(':id')
  async getPurchaseOrderById(@Param() params: { id: number }) {
    return await this._orderService.getPurchaseOrderById(params.id);
  }

  @Put(':id')
  async updatePurchaseOrder(
    @Body() payload: UpdatePurchaseOrder,
    @Param() params: { id: number },
  ) {
    return await this._orderService.updatePurchaseOrder(params.id, payload);
  }

  @Delete(':id')
  async deletePurchaseOrder(@Param() params: { id: number }) {
    return await this._orderService.deletePurchaseOrder(params.id);
  }

  @Post('acknowledgement/:orderid')
  async updateOrderAcknowledgement(
    @Body() payload: any,
    @Param() params: { orderid: number },
  ) {
    return await this._orderService.updateAcknowledgement({
      orderId: params.orderid,
      ...payload,
    });
  }
}
