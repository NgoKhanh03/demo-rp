export type QualityTier = 'Economy' | 'Standard' | 'Premium' | 'Experimental';
export type UseCase = 'voiceover' | 'learning' | 'blog';
export type JobStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface QualityConfig {
  tier: QualityTier;
  label: string;
  costMultiplier: number;
  defaultFor: UseCase[];
  enabled: boolean;
}

export interface UsageSnapshot {
  monthlyQuota: number;
  usedChars: number;
  expectedQuotaHitRate: number;
  perJobLimit: number;
  maxSavedExports: Record<'free' | 'workPro' | 'creatorPro', number>;
}

export interface TtsJob {
  id: string;
  title: string;
  text: string;
  useCase: UseCase;
  qualityTier: QualityTier;
  voice: string;
  status: JobStatus;
  chars: number;
  audioUrl?: string;
  createdAt: string;
  expiresAt: string;
  controls: string[];
}
