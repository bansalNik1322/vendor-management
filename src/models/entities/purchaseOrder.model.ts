import {
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VendorModel } from './vendor.model';

@Table({
  tableName: 'purchageOrders',
  timestamps: false,
})
export class PurchaseOrderModel extends Model<PurchaseOrderModel> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Default(Date.now)
  @Column({
    type: DataType.DATE,
  })
  orderDate: Date;

  @Column({
    type: DataType.DATE,
  })
  deliveryDate: Date;

  @Column({
    type: DataType.JSON,
  })
  items: JSON;

  @Column({
    type: DataType.BIGINT,
  })
  quanitity: number;

  @Column({
    type: DataType.ENUM(
      'ordered',
      'delivered',
      'canceled',
      'returned',
      'dispatched',
    ),
  })
  status: string;

  @Column({
    type: DataType.BIGINT,
  })
  qualityRating: number;

  @Column({
    type: DataType.DATE,
  })
  issueDate: Date;
  @Column({
    type: DataType.DATE,
  })
  acknowledgeDate: Date;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => VendorModel)
  vendor: number;

  @BelongsTo(() => VendorModel)
  vendorDetails: VendorModel;
}
