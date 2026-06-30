import cors from 'cors';
import express from 'express';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import type { QualityConfig, QualityTier, TtsJob, UsageSnapshot, UseCase } from '../shared/types';

const app = express();
const port = Number(process.env.PORT ?? 8787);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const qualityConfigs: QualityConfig[] = [
  { tier: 'Economy', label: 'Economy - mặc định chi phí thấp', costMultiplier: 1, defaultFor: ['voiceover', 'learning', 'blog'], enabled: true },
  { tier: 'Standard', label: 'Standard - upsell theo gói', costMultiplier: 1.8, defaultFor: [], enabled: true },
  { tier: 'Premium', label: 'Premium - giọng creator cao cấp', costMultiplier: 3.2, defaultFor: [], enabled: true },
  { tier: 'Experimental', label: 'Experimental - A/B test nội bộ', costMultiplier: 1.4, defaultFor: [], enabled: false },
];

const usage: UsageSnapshot = {
  monthlyQuota: 500_000,
  usedChars: 86_420,
  expectedQuotaHitRate: 0.3,
  perJobLimit: 12_000,
  maxSavedExports: { free: 5, workPro: 30, creatorPro: 120 },
};

const jobs: TtsJob[] = [];

const createJobSchema = z.object({
  title: z.string().trim().min(1).max(120),
  text: z.string().trim().min(1).max(usage.perJobLimit),
  useCase: z.enum(['voiceover', 'learning', 'blog']),
  qualityTier: z.enum(['Economy', 'Standard', 'Premium', 'Experimental']).default('Economy'),
  voice: z.string().trim().min(1).max(80).default('vi-economy-01'),
});

const controlTokens = [
  { token: '...', description: 'Tạm dừng ngắn/tự nhiên giữa các cụm.' },
  { token: '[pause]', description: 'Tạm dừng rõ hơn cho Eleven v3.' },
  { token: '[short pause]', description: 'Tạm dừng ngắn có chủ đích.' },
  { token: '[long pause]', description: 'Tạm dừng dài hơn, dùng tiết chế.' },
  { token: '[whispers]', description: 'Đổi sắc thái sang thì thầm.' },
  { token: '[excited]', description: 'Tăng năng lượng/biểu cảm.' },
  { token: '[sighs]', description: 'Thêm cảm xúc thở dài.' },
  { token: '<break time="1.5s" />', description: 'SSML break cho model không phải Eleven v3, tối đa 3 giây theo tài liệu ElevenLabs.' },
  { token: '[throught]', description: 'Tag nội bộ do PM yêu cầu; mapping về pause/thought trong provider adapter.' },
];

function detectControls(text: string) {
  return controlTokens.map((item) => item.token).filter((token) => text.includes(token));
}

function estimateDuration(chars: number) {
  return Math.max(2, Math.round(chars / 14));
}

function mockAudioUrl(job: TtsJob) {
  const payload = encodeURIComponent(`Mock TTS ${job.qualityTier}: ${job.title}`);
  return `data:audio/wav;base64,${Buffer.from(payload).toString('base64')}`;
}

app.get('/api/config', (_req, res) => {
  res.json({ qualityConfigs, usage, controlTokens, retentionDays: 30, monthlyUpsell: true });
});

app.get('/api/jobs', (_req, res) => {
  res.json({ jobs: jobs.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

app.post('/api/jobs', (req, res) => {
  const parsed = createJobSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' });
  }

  if (jobs.length >= usage.maxSavedExports.workPro) {
    return res.status(409).json({ error: `Đã đạt giới hạn ${usage.maxSavedExports.workPro} bản export lưu lại cho Work Pro.` });
  }

  const input = parsed.data;
  const chars = input.text.length;
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const job: TtsJob = {
    id: nanoid(10),
    title: input.title,
    text: input.text,
    useCase: input.useCase,
    qualityTier: input.qualityTier as QualityTier,
    voice: input.voice,
    status: 'ready',
    chars,
    audioUrl: '',
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    controls: detectControls(input.text),
  };
  job.audioUrl = mockAudioUrl(job);
  jobs.unshift(job);
  usage.usedChars += chars;

  res.status(201).json({ job, estimate: { durationSeconds: estimateDuration(chars), quotaRemaining: Math.max(0, usage.monthlyQuota - usage.usedChars) } });
});

app.delete('/api/jobs/:id', (req, res) => {
  const index = jobs.findIndex((job) => job.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Job not found' });
  jobs.splice(index, 1);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`TTS MVP API listening on http://localhost:${port}`);
});
