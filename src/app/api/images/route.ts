import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

type ImageInfo = {
  id?: string;
  src: string;
  width?: number;
  height?: number;
  aspect?: number;
  banner?: 'hero' | 'leaderboard' | 'wide' | 'rectangle' | 'square' | 'tall' | 'unknown';
};

function readJPEGDimensions(buf: Buffer): { width?: number; height?: number } {
  let offset = 0;
  if (buf.readUInt16BE(0) !== 0xffd8) return {};
  offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xff) break;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return { width, height };
    }
    offset += 2 + length;
  }
  return {};
}

function readPNGDimensions(buf: Buffer): { width?: number; height?: number } {
  const signature = '89504e470d0a1a0a';
  if (buf.slice(0, 8).toString('hex') !== signature) return {};
  const ihdr = buf.indexOf(Buffer.from('IHDR'));
  if (ihdr < 0) return {};
  const start = ihdr + 4;
  const width = buf.readUInt32BE(start);
  const height = buf.readUInt32BE(start + 4);
  return { width, height };
}

function classifyBanner(width?: number, height?: number): ImageInfo['banner'] {
  if (!width || !height) return 'unknown';
  const aspect = width / height;
  if (width >= 1600 && height >= 400 && aspect >= 2.5) return 'hero';
  if (width >= 728 && height <= 120 && aspect >= 6) return 'leaderboard';
  if (width >= 1200 && aspect >= 2) return 'wide';
  if (Math.abs(aspect - 1) < 0.15) return 'square';
  if (width >= 300 && height >= 250 && aspect >= 1.1 && aspect <= 1.6) return 'rectangle';
  if (aspect <= 0.75 || height > width * 1.3) return 'tall';
  return 'unknown';
}

export async function GET() {
  try {
    const base = path.join(process.cwd(), 'public');
    const dirs = [
      path.join(base, 'images', 'products'),
      path.join(base, 'products'),
      path.join(base, 'images'),
      path.join(base, 'image', 'products'),
      path.join(base, 'image'),
      path.join(base, 'assets', 'products'),
      path.join(base, 'assets'),
    ].filter(d => fs.existsSync(d));

    const infos: ImageInfo[] = [];
    for (const dir of dirs) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
        const full = path.join(dir, file);
        let width: number | undefined;
        let height: number | undefined;
        try {
          const buf = fs.readFileSync(full);
          if (ext === '.png') {
            const dim = readPNGDimensions(buf);
            width = dim.width;
            height = dim.height;
          } else {
            const dim = readJPEGDimensions(buf);
            width = dim.width;
            height = dim.height;
          }
        } catch {
        }
        const publicPath = `/${path.relative(base, full).replace(/\\\\/g, '/').replace(/\\/g, '/')}`;
        const match = path.basename(file, ext).match(/(\d+)/);
        const id = match?.[1];
        const aspect = width && height ? Number((width / height).toFixed(3)) : undefined;
        const banner = classifyBanner(width, height);
        infos.push({ id, src: publicPath, width, height, aspect, banner });
      }
    }
    return NextResponse.json(infos);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
