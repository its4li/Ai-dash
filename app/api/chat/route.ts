import { NextResponse } from 'next/server';

const DEFAULT_TEXT_MODEL = process.env.TEXT_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();
    const finalModel = model || DEFAULT_TEXT_MODEL;

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
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(`Upstream error: ${errText}`, { status: 502 });
    }

    const data = await res.json();
    // HF text-generation can return either array or object depending on the model
    let output = '';
    if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
      output = data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      output = data.generated_text;
    } else if (typeof data === 'string') {
      output = data;
    } else if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 502 });
    } else {
      output = JSON.stringify(data, null, 2);
    }

    return NextResponse.json({ text: output });
  } catch (e: any) {
    return new NextResponse(e?.message || 'Server error', { status: 500 });
  }
}
