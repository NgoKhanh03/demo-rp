import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, Gauge, Mic2, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import type { QualityConfig, QualityTier, TtsJob, UsageSnapshot, UseCase } from '../shared/types';
import './styles.css';

interface AppConfig {
  qualityConfigs: QualityConfig[];
  usage: UsageSnapshot;
  controlTokens: { token: string; description: string }[];
  retentionDays: number;
  monthlyUpsell: boolean;
}

const sampleScript = 'Mở đầu video thật tự nhiên... [pause] Sau đó nhấn mạnh lợi ích chính. [excited] Kết thúc bằng lời kêu gọi hành động rõ ràng.';
const useCaseLabels: Record<UseCase, string> = { voiceover: 'Lồng tiếng video', learning: 'Học tập', blog: 'Đọc blog' };

function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [jobs, setJobs] = useState<TtsJob[]>([]);
  const [title, setTitle] = useState('Voiceover demo sản phẩm');
  const [text, setText] = useState(sampleScript);
  const [useCase, setUseCase] = useState<UseCase>('voiceover');
  const [qualityTier, setQualityTier] = useState<QualityTier>('Economy');
  const [voice, setVoice] = useState('vi-economy-01');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const [configRes, jobsRes] = await Promise.all([fetch('/api/config'), fetch('/api/jobs')]);
    setConfig(await configRes.json());
    setJobs((await jobsRes.json()).jobs);
  }

  useEffect(() => { void load(); }, []);

  const quota = config?.usage;
  const remaining = Math.max(0, (quota?.monthlyQuota ?? 0) - (quota?.usedChars ?? 0));
  const quotaPct = quota ? Math.min(100, Math.round((quota.usedChars / quota.monthlyQuota) * 100)) : 0;
  const detectedTokens = useMemo(() => config?.controlTokens.filter((item) => text.includes(item.token)) ?? [], [config, text]);

  async function createJob(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text, useCase, qualityTier, voice }),
    });
    const payload = await response.json().catch(() => ({}));
    setBusy(false);
    if (!response.ok) {
      setError(payload.error ?? 'Không tạo được job TTS');
      return;
    }
    setJobs((current) => [payload.job, ...current]);
    setConfig((current) => current ? { ...current, usage: { ...current.usage, usedChars: current.usage.usedChars + text.length } } : current);
  }

  async function deleteJob(id: string) {
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
    setJobs((current) => current.filter((job) => job.id !== id));
  }

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow"><Sparkles size={16} /> Vietnamese TTS MVP</p>
          <h1>PWA tạo voiceover chi phí thấp cho creator Việt</h1>
          <p className="hero-copy">Economy là mặc định, Standard/Premium upsell theo gói tháng, lưu audio 30 ngày và giới hạn số bản export để giữ storage cost.</p>
          <div className="hero-actions">
            <a href="#composer" className="primary">Tạo voiceover</a>
            <span><ShieldCheck size={16} /> Retention 30 ngày</span>
          </div>
        </div>
        <div className="quota-card">
          <Gauge />
          <strong>{quotaPct}% quota đã dùng</strong>
          <div className="bar"><span style={{ width: `${quotaPct}%` }} /></div>
          <p>{remaining.toLocaleString('vi-VN')} ký tự còn lại / {quota?.monthlyQuota.toLocaleString('vi-VN') ?? '500.000'}</p>
          <small>Kỳ vọng 30% user chạm quota để kích hoạt nâng cấp/overage.</small>
        </div>
      </section>

      <section className="grid">
        <form id="composer" className="panel composer" onSubmit={createJob}>
          <div className="section-title"><Mic2 /> <h2>Composer</h2></div>
          <label>Tiêu đề<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} /></label>
          <div className="row">
            <label>Use case<select value={useCase} onChange={(event) => setUseCase(event.target.value as UseCase)}>{Object.entries(useCaseLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Tier<select value={qualityTier} onChange={(event) => setQualityTier(event.target.value as QualityTier)}>{config?.qualityConfigs.filter((item) => item.enabled).map((item) => <option key={item.tier} value={item.tier}>{item.label}</option>)}</select></label>
          </div>
          <label>Voice<input value={voice} onChange={(event) => setVoice(event.target.value)} /></label>
          <label>Script / URL / text<textarea value={text} onChange={(event) => setText(event.target.value)} maxLength={config?.usage.perJobLimit ?? 12000} /></label>
          <div className="meta"><span>{text.length.toLocaleString('vi-VN')} / {config?.usage.perJobLimit.toLocaleString('vi-VN') ?? '12.000'} ký tự/job</span><span>{detectedTokens.length} control tokens</span></div>
          {error && <p className="error">{error}</p>}
          <button disabled={busy}>{busy ? 'Đang tạo...' : 'Tạo audio mock'}</button>
        </form>

        <aside className="panel">
          <h2>Control tokens</h2>
          <p className="muted">Dựa trên tài liệu ElevenLabs: Eleven v3 dùng audio tags như [pause], [short pause], [long pause]; các model khác có thể dùng SSML break đến 3 giây. MVP vẫn giữ tag nội bộ [throught].</p>
          <div className="chips">{config?.controlTokens.map((item) => <button type="button" key={item.token} onClick={() => setText((current) => `${current} ${item.token}`)}>{item.token}</button>)}</div>
          <h3>Export limits</h3>
          <ul className="limits">
            <li>Free/demo: {config?.usage.maxSavedExports.free} exports</li>
            <li>Work Pro: {config?.usage.maxSavedExports.workPro} exports</li>
            <li>Creator Pro: {config?.usage.maxSavedExports.creatorPro} exports</li>
          </ul>
        </aside>
      </section>

      <section className="panel library">
        <h2>Thư viện audio</h2>
        {jobs.length === 0 ? <p className="muted">Chưa có export nào. Tạo job đầu tiên để xem trạng thái, token và retention.</p> : jobs.map((job) => (
          <article className="job" key={job.id}>
            <div>
              <strong>{job.title}</strong>
              <p>{useCaseLabels[job.useCase]} · {job.qualityTier} · {job.chars.toLocaleString('vi-VN')} ký tự · hết hạn {new Date(job.expiresAt).toLocaleDateString('vi-VN')}</p>
              <p className="tokens">{job.controls.length ? `Tokens: ${job.controls.join(', ')}` : 'Không phát hiện control token'}</p>
            </div>
            <div className="job-actions">
              <audio controls src={job.audioUrl} />
              <a href={job.audioUrl} download={`${job.title}.wav`}><Download size={16} /></a>
              <button className="icon" onClick={() => void deleteJob(job.id)}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
