import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Trash2, Info, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SetOperations() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trim, setTrim] = useState(true);
  const [ignoreEmpty, setIgnoreEmpty] = useState(true);

  const processText = (text: string) => {
    let lines = text.split(/\n/);
    if (trim) lines = lines.map(l => l.trim());
    if (ignoreEmpty) lines = lines.filter(l => l !== '');
    return lines;
  };

  const { intersection, uniqueA, uniqueB, union } = useMemo(() => {
    const linesA = processText(textA);
    const linesB = processText(textB);
    
    // Custom set operations to handle case sensitivity properly if needed, 
    // but using native Set is much faster. 
    // If ignoreCase is true, let's just map everything to lowercase for the Set logic.
    // NOTE: This loses the original casing in the output. 
    // To preserve casing, we'd need a map: Lowercase -> Original.
    
    const normalize = (s: string) => ignoreCase ? s.toLowerCase() : s;

    const mapA = new Map<string, string>();
    linesA.forEach(l => mapA.set(normalize(l), l)); // Keep last or first occurrence? Last overwrites.

    const mapB = new Map<string, string>();
    linesB.forEach(l => mapB.set(normalize(l), l));

    const keysA = new Set(mapA.keys());
    const keysB = new Set(mapB.keys());

    // Intersection: Keys present in both
    const intersectKeys = [...keysA].filter(k => keysB.has(k));
    // Unique A: Keys in A but not B
    const uniqueAKeys = [...keysA].filter(k => !keysB.has(k));
    // Unique B: Keys in B but not A
    const uniqueBKeys = [...keysB].filter(k => !keysA.has(k));
    // Union: All keys
    const unionKeys = new Set([...keysA, ...keysB]);

    // Map back to display strings (preferring A's version for intersection/union usually, or B's?)
    // For Intersection: use A's version.
    const intersection = intersectKeys.map(k => mapA.get(k)!);
    const uA = uniqueAKeys.map(k => mapA.get(k)!);
    const uB = uniqueBKeys.map(k => mapB.get(k)!);
    const un = [...unionKeys].map(k => mapA.get(k) || mapB.get(k)!);

    return { intersection, uniqueA: uA, uniqueB: uB, union: un };
  }, [textA, textB, ignoreCase, trim, ignoreEmpty]);

  const stats = [
    { label: '列表 A', count: processText(textA).length, color: 'text-blue-500' },
    { label: '列表 B', count: processText(textB).length, color: 'text-purple-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            集合运算工具
          </h1>
          <p className="text-muted-foreground mt-1">对比两个文本列表，计算交集、差集和并集。</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-secondary/50 rounded-lg border border-border/50">
           <Toggle label="忽略大小写" checked={ignoreCase} onChange={setIgnoreCase} />
           <div className="w-px h-4 bg-border mx-1" />
           <Toggle label="去除首尾空格" checked={trim} onChange={setTrim} />
           <div className="w-px h-4 bg-border mx-1" />
           <Toggle label="过滤空行" checked={ignoreEmpty} onChange={setIgnoreEmpty} />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputCard 
          title="列表 A" 
          value={textA} 
          onChange={setTextA} 
          color="border-blue-200 focus-within:border-blue-500 focus-within:ring-blue-500/20"
          badgeColor="bg-blue-100 text-blue-700"
          count={stats[0].count}
        />
        <InputCard 
          title="列表 B" 
          value={textB} 
          onChange={setTextB} 
          color="border-purple-200 focus-within:border-purple-500 focus-within:ring-purple-500/20"
          badgeColor="bg-purple-100 text-purple-700"
          count={stats[1].count}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResultCard 
          title="交集 (A ∩ B)" 
          data={intersection} 
          icon={<span className="text-xl font-bold">&cap;</span>}
          color="bg-emerald-50/50 border-emerald-100 text-emerald-900"
          headerColor="text-emerald-700"
        />
        <ResultCard 
          title="A 独有 (A - B)" 
          data={uniqueA} 
          icon={<span className="text-xl font-bold">&minus;</span>}
          color="bg-blue-50/50 border-blue-100 text-blue-900"
          headerColor="text-blue-700"
        />
        <ResultCard 
          title="B 独有 (B - A)" 
          data={uniqueB} 
          icon={<span className="text-xl font-bold">&minus;</span>}
          color="bg-purple-50/50 border-purple-100 text-purple-900"
          headerColor="text-purple-700"
        />
      </div>
      
       {/* Union - Full Width */}
       <ResultCard 
          title="并集 (A ∪ B)" 
          data={union} 
          icon={<span className="text-xl font-bold">&cup;</span>}
          color="bg-slate-50/50 border-slate-200 text-slate-900"
          headerColor="text-slate-700"
          className="md:col-span-3"
        />
    </div>
  );
}

function InputCard({ title, value, onChange, color, badgeColor, count }: {
  title: string,
  value: string,
  onChange: (s: string) => void,
  color: string,
  badgeColor: string,
  count: number
}) {
  return (
    <div className={cn("flex flex-col h-[400px] rounded-xl border bg-card shadow-sm transition-all", color)}>
      <div className="flex items-center justify-between p-4 border-b bg-muted/20">
        <div className="flex items-center gap-2">
           <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h3>
           <span className={cn("text-xs font-mono px-2 py-0.5 rounded-full", badgeColor)}>{count} 项</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onChange('')}
            className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
            title="清空"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => navigator.clipboard.readText().then(t => onChange(t))}
             className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
             title="粘贴"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
      <textarea 
        className="flex-1 w-full p-4 resize-none bg-transparent outline-none font-mono text-sm leading-relaxed"
        placeholder="在此粘贴文本项..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  )
}

function ResultCard({ title, data, icon, color, headerColor, className }: {
  title: string,
  data: string[],
  icon: React.ReactNode,
  color: string,
  headerColor: string,
  className?: string
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(data.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex flex-col h-[300px] rounded-xl border shadow-sm overflow-hidden", color, className)}
    >
      <div className="flex items-center justify-between p-3 border-b border-black/5 bg-white/50 backdrop-blur-sm">
        <div className={cn("flex items-center gap-2 font-semibold", headerColor)}>
           <div className="p-1 bg-white/50 rounded">{icon}</div>
           <span>{title}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono opacity-50">{data.length} 项</span>
            <button 
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-white rounded shadow-sm hover:shadow active:scale-95 transition-all"
                title="复制全部"
            >
                {copied ? "已复制!" : "复制全部"}
                <Copy size={12} />
            </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-0 bg-white/30">
        {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
                <Info size={24} />
                <span className="text-sm">无结果</span>
            </div>
        ) : (
            <div className="divide-y divide-black/5 font-mono text-sm">
                {data.map((item, i) => (
                    <ResultItem key={i} item={item} />
                ))}
            </div>
        )}
      </div>
    </motion.div>
  )
}

function ResultItem({ item }: { item: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div 
        className="group flex items-start justify-between gap-2 px-4 py-2 hover:bg-black/5 transition-colors cursor-pointer"
        onDoubleClick={handleCopy}
        title="双击复制"
    >
        <span className="break-all whitespace-pre-wrap">{item}</span>
        <button 
            onClick={(e) => { e.stopPropagation(); handleCopy(); }}
            className={cn(
              "p-1 rounded hover:bg-black/10 text-muted-foreground transition-all",
              copied ? "opacity-100 text-green-600 bg-green-100" : "opacity-0 group-hover:opacity-100"
            )}
            title="复制"
        >
            {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
    </div>
  )
}


function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (b: boolean) => void }) {
    return (
        <button 
            onClick={() => onChange(!checked)}
            className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all select-none",
                checked 
                    ? "bg-white text-foreground shadow-sm ring-1 ring-black/5" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
        >
            {label}
        </button>
    )
}
