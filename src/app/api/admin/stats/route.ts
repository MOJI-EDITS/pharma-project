import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ProductModel from '@/lib/models/Product';
import OrderModel from '@/models/Order';
import PrescriptionModel from '@/models/Prescription';
import mongoose from 'mongoose';
import { auth } from '../../../../../auth';

export async function GET(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await dbConnect();
    const totalProducts = await ProductModel.countDocuments({}).exec();
    const totalOrders = await OrderModel.countDocuments({}).exec();
    const totalPrescriptions = await PrescriptionModel.countDocuments({}).exec();
    const revenueAgg = await OrderModel.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]).exec();
    const totalRevenue = (revenueAgg[0]?.total) || 0;
    // users count omitted - would require User model
    return NextResponse.json({ totalProducts, totalOrders, totalPrescriptions, totalRevenue });
  } catch (e) {
    console.error('admin stats error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
