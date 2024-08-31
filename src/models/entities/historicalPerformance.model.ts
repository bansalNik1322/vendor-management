import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { VendorModel } from './vendor.model';

@Table({
  tableName: 'historicalperformance',
  timestamps: false,
})
export class HistoricalPerformanceModel extends Model<HistoricalPerformanceModel> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
  })
  date: Date;

  @Column({
    type: DataType.BIGINT,
  })
  qualityRatingAvg: number;
  @Column({
    type: DataType.BIGINT,
  })
  averageResponseTime: number;
  @Column({
    type: DataType.BIGINT,
  })
  fullFillMentRate: number;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => VendorModel)
  vendorId: number;

  @BelongsTo(() => VendorModel)
  vendorDetails: VendorModel;
}
