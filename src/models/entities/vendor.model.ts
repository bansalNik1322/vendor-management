import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'vendors',
  timestamps: false,
})
export class VendorModel extends Model<VendorModel> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  address: string;

  @Column({
    type: DataType.BIGINT,
  })
  onTimeDeliveryRate: number;

  @Column({
    type: DataType.BIGINT,
  })
  qualityRatingAvg: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.BIGINT,
  })
  averageResponseTime: number;

  @Column({
    type: DataType.BIGINT,
  })
  fullfillmentRate: number;
}
