import { NextResponse } from 'next/server';

const DEFAULT_IMAGE_MODEL = process.env.IMAGE_MODEL || 'stabilityai/stable-diffusion-2';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();
    const finalModel = model || DEFAULT_IMAGE_MODEL;

    if (!process.env.HUGGINGFACE_API_KEY) {
      return new NextResponse('Missing HUGGINGFACE_API_KEY on the server', { status: 500 });
    }
    if (!prompt || typeof prompt !== 'string') {
      return new NextResponse('Invalid prompt', { status: 400 });
    }

    const res = await fetch(`https://api-inference.huggingface.co/models/${finalModel}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
        // Some models respect Accept for image mime types; others return binary by default
        'Accept': 'image/png'
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(`Upstream error: ${errText}`, { status: 502 });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');
    return NextResponse.json({ imageBase64: base64 });
  } catch (e: any) {
    return new NextResponse(e?.message || 'Server error', { status: 500 });
  }
}
