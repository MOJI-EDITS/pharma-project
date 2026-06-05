import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { productsData } from '@/lib/data/products';
import type { IProduct } from '@/lib/types/Product';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';
import ProductModel from '@/lib/models/Product';

type ImageMapping = { src: string; base: string; explicitName?: string; explicitGeneric?: string };

function toTitleCase(input: string): string {
  return input
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function generateDescription(name: string, p: IProduct): { short: string; long: string } {
  const baseName = toTitleCase(name);
  const form = p.form.toLowerCase();
  const strength = p.strength;
  const category = p.category.toLowerCase();
  const short = `${baseName} ${form} for ${category} support, ${strength}. Trusted quality and efficacy.`;
  const long =
    `${baseName} offers reliable ${category} care in convenient ${form} form. ` +
    `Formulated with high manufacturing standards, it provides consistent performance, ${strength}, ` +
    `and is suitable for everyday use under professional guidance.`;
  return { short, long };
}


function scanProductImages(): Record<string, ImageMapping> {
  try {
    const base = path.join(process.cwd(), 'public');
    const manifestCandidates = [
      path.join(base, 'images', 'products', 'names.json'),
      path.join(base, 'images', 'names.json'),
      path.join(base, 'names.json'),
      path.join(base, 'products', 'names.json'),
      path.join(base, 'assets', 'names.json'),
    ];
    let namesManifest: Record<string, { name?: string; genericName?: string }> = {};
    for (const m of manifestCandidates) {
      if (fs.existsSync(m)) {
        try {
          const raw = fs.readFileSync(m, 'utf-8');
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            namesManifest = parsed;
            break;
          }
        } catch {
        }
      }
    }
    const dirs = [
      path.join(base, 'images', 'products'),
      path.join(base, 'products'),
      path.join(base, 'images'),
      path.join(base, 'image', 'products'),
      path.join(base, 'image'),
      path.join(base, 'assets', 'products'),
      path.join(base, 'assets'),
    ].filter(d => fs.existsSync(d));
    const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp']);
    const mapping: Record<string, ImageMapping> = {};
    const sanitize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameIndex = new Map<string, string>();
    const validIds = new Set<string>();
    for (const p of productsData) {
      nameIndex.set(sanitize(p.name), p._id);
      nameIndex.set(sanitize(p.genericName), p._id);
      validIds.add(p._id);
    }
    const pending: ImageMapping[] = [];
    for (const dir of dirs) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!allowed.has(ext)) continue;
        const fname = path.basename(file, ext);
        const digitMatch = fname.match(/(\d+)/);
        let id: string | undefined;
        if (digitMatch) {
          id = digitMatch[1];
          if (id && !validIds.has(id)) {
            id = undefined;
          }
        } else {
          const key = sanitize(fname);
          for (const [k, v] of nameIndex.entries()) {
            if (key.includes(k) || k.includes(key)) {
              id = v;
              break;
            }
          }
        }
        const publicPath = `/${path.relative(base, path.join(dir, file)).replace(/\\\\/g, '/').replace(/\\/g, '/')}`;
        if (id) {
          const manifestEntry = namesManifest[id];
          mapping[id] = {
            src: publicPath,
            base: fname,
            explicitName: manifestEntry?.name,
            explicitGeneric: manifestEntry?.genericName,
          };
        } else {
          pending.push({ src: publicPath, base: fname });
        }
      }
    }
    for (const p of productsData) {
      if (!mapping[p._id] && pending.length > 0) {
        const next = pending.shift()!;
        mapping[p._id] = { src: next.src, base: next.base };
      }
    }
    return mapping;
  } catch {
    return {};
  }
}

function mergeImages(products: IProduct[], map: Record<string, ImageMapping>): IProduct[] {
  return products.map(p => {
    const override = map[p._id];
    if (override) {
      const resolvedName = override.explicitName ?? toTitleCase(override.base);
      const desc = generateDescription(resolvedName, p);
      return { 
        ...p, 
        images: [override.src],
        name: resolvedName,
        genericName: override.explicitGeneric ?? p.genericName,
        description: desc.short,
        detailedDescription: desc.long,
      };
    }
    // Probe common extensions if current images path uses a default pattern
    const candidates = [
      `/images/products/product-${p._id}.jpg`,
      `/images/products/product-${p._id}.jpeg`,
      `/images/products/product-${p._id}.png`,
      `/images/products/product-${p._id}.webp`,
    ];
    for (const candidate of candidates) {
      const filePath = path.join(process.cwd(), 'public', candidate);
      if (fs.existsSync(filePath)) {
        return { ...p, images: [candidate] };
      }
    }
    return p;
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  const map = scanProductImages();
  const merged = mergeImages(productsData, map);

  // try to return from database when possible
  try {
    await dbConnect();
    const docs = await ProductModel.find({}).lean().exec();
    if (docs && docs.length > 0) {
      if (id) {
        const item = docs.find((d: any) => d._id === id);
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(item);
      }
      return NextResponse.json(docs.map((d: any) => ({ ...d })));
    }
    // if DB empty, seed from merged mock data
    const seed = merged.map(p => ({ ...p }));
    await ProductModel.insertMany(seed, { ordered: false }).catch(() => null);
  } catch (e) {
    // ignore DB errors and fall back to mock data
    // console.error('Products DB error', e);
  }

  if (id) {
    const item = merged.find(p => p._id === id);
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(item);
  }
  return NextResponse.json(merged);
}

export async function POST(req: Request) {
  // Simple protection: require ALLOW_ADMIN_OPS=true in env for now
  // require admin session (dynamic import so build doesn't try to initialize auth when env is missing)
  let session;
  try {
    const authMod = await import('../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await req.json();
    await dbConnect();
    const created = await ProductModel.create(body);
    return NextResponse.json(created);
  } catch (e) {
    console.error('Create product error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const body = await req.json();
    await dbConnect();
    const updated = await ProductModel.findByIdAndUpdate(id, body, { new: true }).lean().exec();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('Update product error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  let session;
  try {
    const authMod = await import('../../../../auth');
    session = await authMod.auth();
  } catch (e) {
    return NextResponse.json({ error: 'Auth not configured' }, { status: 503 });
  }
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await dbConnect();
    const deleted = await ProductModel.findByIdAndDelete(id).lean().exec();
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Delete product error', e);
    return NextResponse.json({ error: 'Internal' }, { status: 500 });
  }
}
