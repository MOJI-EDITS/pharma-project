import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  strength?: string;
  form?: string;
  image?: string;
}

export interface IOrder extends Document {
  userId?: string;
  customerName: string;
  customerEmail: string;
  items: IOrderItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  stripeSessionId?: string;
  shippingAddress?: {
    line1?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  strength: { type: String },
  form: { type: String },
  image: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: String },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
    stripeSessionId: { type: String },
    shippingAddress: {
      line1: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
