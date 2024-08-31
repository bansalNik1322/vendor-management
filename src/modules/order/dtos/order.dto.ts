import { IsNotEmpty } from 'class-validator';

export class CreatePurchaseOrder {
  @IsNotEmpty()
  items: JSON;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  vendor: number;
}

export class UpdatePurchaseOrder {
  @IsNotEmpty()
  items: JSON;

  @IsNotEmpty()
  quantity: number;
}
