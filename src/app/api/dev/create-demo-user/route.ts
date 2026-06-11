import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();
    const email = 'user@example.com';
    const existing = await User.findOne({ email }).lean().exec() as any;
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Demo user already exists', userId: existing._id });
    }

    const hashed = bcrypt.hashSync('password123', 10);
    const user = await User.create({ name: 'Demo User', email, password: hashed, role: 'user' });
    return NextResponse.json({ ok: true, message: 'Demo user created', userId: user._id });
  } catch (e) {
    console.error('create-demo-user error', e);
    return NextResponse.json({ ok: false, error: 'Internal' }, { status: 500 });
  }
}
