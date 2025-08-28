'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/Section';
import { OutputCard } from '@/components/OutputCard';
import { ImageIcon, MessageSquare, Sparkles, Trash2 } from 'lucide-react';

type ChatResponse = { text: string };
type ImageResponse = { imageBase64: string };

export default function Page() {
  const [service, setService] = useState<'chat'|'image'>('chat');
  const [prompt, setPrompt] = useState('سلام! یک متن انگیزشی کوتاه درباره یادگیری هوش مصنوعی بنویس.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatOutputs, setChatOutputs] = useState<string[]>([]);
  const [imageOutputs, setImageOutputs] = useState<string[]>([]);

  async function runChat() {
    setLoading(true); setError(null);
    try{
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
      if(!res.ok) throw new Error(await res.text());
      const data: ChatResponse = await res.json();
      setChatOutputs(prev => [data.text, ...prev]);
    } catch(e:any){
      setError(e.message || 'خطا در پاسخ متن');
    } finally {
      setLoading(false);
    }
  }

  async function runImage() {
    setLoading(true); setError(null);
    try{
      const res = await fetch('/api/image', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt }) });
      if(!res.ok) throw new Error(await res.text());
      const data: ImageResponse = await res.json();
      setImageOutputs(prev => [data.imageBase64, ...prev]);
    } catch(e:any){
      setError(e.message || 'خطا در تولید تصویر');
    } finally {
      setLoading(false);
    }
  }

  function clearAll(){
    setChatOutputs([]);
    setImageOutputs([]);
    setError(null);
  }

  return (
    <div className="min-h-screen container-outer">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5" />
            <span className="font-semibold">AI Dashboard</span>
            <span className="badge">Next.js + Hugging Face</span>
          </div>
          <button onClick={clearAll} className="badge hover:bg-white/10"><Trash2 className="size-4" /> پاک‌سازی خروجی‌ها</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-[260px_1fr] gap-4">
        {/* Sidebar */}
        <div className="card h-fit md:sticky md:top-20">
          <p className="text-sm text-white/80 mb-3">نوع سرویس را انتخاب کن:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={()=>setService('chat')}
              className={`btn flex items-center justify-center gap-2 ${service==='chat' ? '' : 'opacity-70'}`}>
              <MessageSquare className="size-4" /> چت
            </button>
            <button
              onClick={()=>setService('image')}
              className={`btn flex items-center justify-center gap-2 ${service==='image' ? '' : 'opacity-70'}`}>
              <ImageIcon className="size-4" /> تصویر
            </button>
          </div>
          <p className="text-xs text-white/50 mt-3 leading-6">
            کلید API فقط روی سرور نگهداری می‌شود. مدل‌ها از محیط اجرا خوانده می‌شوند.
          </p>
        </div>

        {/* Main Panel */}
        <div className="grid gap-4">
          <Section title="پرامپت" subtitle="پرامپت خودت رو بنویس، سرویس رو انتخاب کن و اجرا بزن.">
            <textarea
              className="input min-h-[120px]"
              value={prompt}
              onChange={(e)=>setPrompt(e.target.value)}
              placeholder="مثال: یک لوگوی مینیمال برای استارتاپ فینتک با تم بنفش توصیف کن"
            />
            <div className="mt-3 flex gap-2">
              {service==='chat' ? (
                <button disabled={loading} onClick={runChat} className="btn">{loading? 'در حال پردازش…' : 'اجرا (متن)'}</button>
              ):(
                <button disabled={loading} onClick={runImage} className="btn">{loading? 'در حال تولید…' : 'اجرا (تصویر)'}</button>
              )}
            </div>
            {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
          </Section>

          {/* Outputs */}
          {service==='chat' ? (
            <div className="grid gap-3">
              {chatOutputs.length === 0 && <p className="text-sm text-white/60">هنوز خروجی متنی نداری.</p>}
              {chatOutputs.map((t, i)=>(
                <OutputCard key={i}>
                  <pre className="whitespace-pre-wrap leading-7 text-white/90">{t}</pre>
                </OutputCard>
              ))}
            </div>
          ):(
            <div className="grid gap-3 sm:grid-cols-2">
              {imageOutputs.length === 0 && <p className="text-sm text-white/60">هنوز تصویری تولید نشده.</p>}
              {imageOutputs.map((b64, i)=>(
                <OutputCard key={i}>
                  <img src={`data:image/png;base64,${b64}`} alt={`result-${i}`} className="rounded-xl w-full h-auto" />
                </OutputCard>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-10 text-center text-white/50 text-sm">
        ساخته شده با ❤️ برای MVP سریع. مدل‌ها را از طریق ENV عوض کن.
      </footer>
    </div>
  );
}
