import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import dbConnect from '@/lib/mongodb';
import PrescriptionModel from '@/models/Prescription';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const customerName = formData.get('name')?.toString().trim() || '';
    const customerEmail = formData.get('email')?.toString().trim() || '';
    const customerPhone = formData.get('phone')?.toString().trim() || '';
    const shippingAddress = formData.get('address')?.toString().trim() || '';
    const notes = formData.get('notes')?.toString().trim() || '';
    const authMod = await import('../../../../auth');
    const session = await authMod.auth();
    const userId = session?.user?.id as string | undefined;
    const files = formData.getAll('files') as File[];

    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) {
      return NextResponse.json({ error: 'Please complete all required fields.' }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ error: 'Please upload at least one prescription file.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'prescriptions');
    await fs.mkdir(uploadDir, { recursive: true });

    const savedFiles = [] as Array<{ fileName: string; mimeType: string; url: string; size: number }>;
    for (const file of files) {
      if (!file || !(file instanceof File)) continue;
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: 'Only PNG, JPG, and PDF files are accepted.' }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filePath = path.join(uploadDir, safeName);

      await fs.writeFile(filePath, buffer);
      savedFiles.push({
        fileName: file.name,
        mimeType: file.type,
        url: `/uploads/prescriptions/${safeName}`,
        size: buffer.length,
      });
    }

    await dbConnect();
    const prescription = await PrescriptionModel.create({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      notes,
      files: savedFiles,
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      prescriptionId: prescription._id.toString(),
      message: 'Prescription uploaded successfully. We will verify it shortly.',
    });
  } catch (error) {
    console.error('Prescription upload error:', error);
    return NextResponse.json({ error: 'Unable to upload prescription. Please try again later.' }, { status: 500 });
  }
}
