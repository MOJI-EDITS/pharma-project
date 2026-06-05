import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    await dbConnect();
    const existing = await User.findOne({ email }).exec();
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });

    const hash = bcrypt.hashSync(password, 10);
    const created = await User.create({ name, email, password: hash });
    return NextResponse.json({ ok: true, id: created._id.toString() });
  } catch (e) {
    console.error('signup error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
