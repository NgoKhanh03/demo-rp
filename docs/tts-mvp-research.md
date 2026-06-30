# Nghiên cứu MVP app TTS

> Ngày cập nhật: 2026-06-30. Phạm vi: MVP ứng dụng chuyển văn bản thành giọng nói (Text-to-Speech/TTS) cho người dùng cá nhân tại thị trường Việt Nam trước, có khả năng mở rộng sang creator/education.

## 1. Kết luận nhanh

Nên xây MVP theo hướng **"nghe nội dung dài bằng tiếng Việt nhanh hơn, tự nhiên hơn, có thể lưu lại thư viện audio"** thay vì chỉ là ô nhập text rồi phát âm thanh. Thị trường đã có các app lớn như Speechify và ElevenReader, nên MVP cần khác biệt bằng 3 điểm:

1. **Tập trung tiếng Việt và nội dung địa phương**: đọc bài web, PDF, ghi chú, tài liệu học tập bằng giọng Việt rõ, có tốc độ 0.75x-2.0x.
2. **Luồng sử dụng cực ngắn**: paste link/text/PDF → chọn giọng → nghe ngay → lưu lịch sử.
3. **Ưu tiên chi phí thấp ngay từ đầu**: chọn provider/giọng có cost thấp trước, giới hạn ký tự/ngày, cache audio theo hash nội dung, hàng đợi xử lý file dài, và fallback provider chất lượng cao chỉ cho gói trả phí hoặc creator.

Khuyến nghị MVP 6 tuần: **PWA + Share URL là đủ**, đăng nhập email hoặc Google, nhập text/link/PDF, tạo audio async chi phí thấp, player có highlight đoạn đang đọc, thư viện audio cá nhân, quota miễn phí, thanh toán gói Pro cho người dùng thường xuyên dùng cho công việc sau khi validate retention.

## 2. Tín hiệu thị trường

- Nhu cầu AI voice/TTS tăng mạnh: Grand View Research ước tính thị trường AI voice generators đạt khoảng **7,7 tỷ USD năm 2026** và **21,8 tỷ USD năm 2030**, CAGR 29,5% giai đoạn 2024-2030.
- Các sản phẩm đọc nội dung dài đã có traction lớn. Speechify công bố hơn **50M+ người dùng** và hỗ trợ đọc docs, articles, PDFs, emails, websites; Google Play mô tả có hơn 1.000 giọng ở 60+ ngôn ngữ.
- ElevenLabs Reader đã mở rộng toàn cầu và hỗ trợ nhiều ngôn ngữ; TechCrunch ghi nhận app cho phép upload articles, PDF documents hoặc e-books để nghe bằng nhiều ngôn ngữ/giọng.

Nguồn tham khảo:
- Grand View Research, AI Voice Generators Market: https://www.grandviewresearch.com/industry-analysis/ai-voice-generators-market-report
- Speechify Google Play: https://play.google.com/store/apps/details?id=com.cliffweitzman.speechify2&hl=en_US
- Speechify App Store: https://apps.apple.com/us/app/speechify-text-to-speech-pdf/id1209815023
- TechCrunch về ElevenLabs Reader: https://techcrunch.com/2024/08/19/elevenlabs-reader-app-is-now-available-globally/

## 3. Giả định đã chốt từ phản hồi sản phẩm

Các quyết định dưới đây thay thế nhóm câu hỏi mở ở cuối bản nghiên cứu trước:

1. **Economy là ngưỡng chất lượng tối thiểu cho retention lồng tiếng video** trong MVP; Standard/Premium chỉ dùng để A/B test hoặc upsell.
2. **Admin mặc định Economy cho cả 3 use case**: voiceover, học tập, đọc blog; các tier cao hơn bật theo cohort hoặc gói trả phí.
3. **PWA + Share URL là đủ** cho hành vi creator trên mobile ở MVP, chưa cần app native hoặc extension.
4. **Retention policy 30 ngày tạo đủ niềm tin nhưng có nguy cơ vượt ngưỡng storage cost**; MVP cần nén audio, xóa source text sớm hơn audio, và theo dõi storage/user/ngày.
5. **Work Pro demo 79.000-129.000 VND/tháng là đủ thấp** để kích hoạt beta trả phí; quota đề xuất ban đầu là 500.000 ký tự/tháng, kỳ vọng khoảng 30% user chạm quota và nâng cấp/overage. Daily soft cap 25.000 ký tự/ngày không đủ chặn abuse mà không ảnh hưởng activation, nên ưu tiên monthly quota, per-job limit và abuse detection.

## 4. Người dùng mục tiêu và pain points

### Persona A: Sinh viên/người tự học

- Có nhiều PDF, slide, tài liệu dài, bài blog tiếng Việt/Anh.
- Muốn nghe khi đi đường, tập gym, làm việc nhà.
- Pain points: đọc lâu mỏi mắt, TTS tiếng Việt thiếu tự nhiên, khó chuyển file dài thành audio, không nhớ đã nghe tới đâu.

### Persona B: Người dùng thường xuyên cho công việc

- Cần xử lý bài blog chuyên ngành, báo cáo, tài liệu nội bộ, nội dung nghiên cứu và brief khách hàng.
- Muốn "nghe trước, đọc sau" để lọc thông tin trong lúc di chuyển hoặc làm việc lặp lại.
- Pain points: tài liệu rời rạc, cần bảo mật, cần lịch sử/resume playback, và cần chi phí đủ hợp lý để dùng hằng ngày.

### Persona C: Creator/marketer nhỏ

- Đây là persona ưu tiên nhất trong beta vì **lồng tiếng video** được kỳ vọng tạo usage thường xuyên nhất.
- Muốn tạo voiceover cho video ngắn, podcast nháp, bài quảng cáo.
- Pain points: cần giọng đủ tự nhiên theo từng mức chất lượng, có quyền thương mại, tải file MP3/WAV, chỉnh ngắt nghỉ, và biết trước chi phí mỗi script.

## 5. Phân tích đối thủ

| Sản phẩm | Điểm mạnh | Khoảng trống cho MVP |
| --- | --- | --- |
| Speechify | Đa nền tảng, đọc PDF/web/email, nhiều giọng/ngôn ngữ, thương hiệu mạnh | Giá cao với người dùng VN; trải nghiệm tiếng Việt và nội dung địa phương có thể chưa tối ưu |
| ElevenReader/ElevenLabs | Giọng tự nhiên, hệ sinh thái voice AI mạnh, reader app hỗ trợ nhiều loại nội dung | Chưa định vị sâu cho học tập/tài liệu tiếng Việt; quyền riêng tư và chi phí API là rào cản |
| NaturalReader/TTSReader/công cụ web miễn phí | Dễ dùng, free tier | UX thường đơn giản, ít thư viện cá nhân, ít workflow file dài/highlight/resume |
| TTS tích hợp OS/browser | Miễn phí, có sẵn | Giọng kém tự nhiên hơn, ít tùy biến, không có workflow lưu audio/thư viện |

## 6. Đề xuất định vị MVP

**Thông điệp:** "Biến tài liệu tiếng Việt thành audio cá nhân trong vài giây. Nghe mọi lúc, tiếp tục đúng chỗ đang dở."

**Use case đầu tiên nên validate:**
- **Lồng tiếng video là use case ưu tiên #1**: người dùng paste script ngắn, chọn tier chất lượng, tải MP3 để dựng video, và tạo nhiều phiên bản cho cùng nội dung.
- Học tập: người dùng upload PDF/slide tiếng Việt dài 3-20 trang để nghe lại.
- Đọc bài blog: người dùng dùng Share URL hoặc paste link bài viết để tạo audio nhanh.
- App tạo audio đủ rõ, chi phí thấp, chia đoạn, highlight đoạn đang phát.
- Người dùng quay lại tạo voiceover mới hoặc nghe tiếp trong 24-72 giờ.

**North Star Metric:** số voiceover export hoàn tất mỗi creator/tuần; với nhóm học tập/blog, theo dõi thêm số phút audio được nghe hoàn tất mỗi người dùng/tuần.

**Metric phụ:**
- Activation: % người dùng tạo audio hoặc export voiceover đầu tiên trong 5 phút sau đăng ký.
- Retention D7: % quay lại tạo voiceover/nghe tiếp hoặc tạo audio mới.
- Cost efficiency: chi phí TTS / voiceover export và chi phí TTS / phút audio nghe thực tế.
- Conversion: % chạm quota free và nâng cấp.

## 7. Phạm vi tính năng MVP

### Must-have

1. **Nhập nội dung**
   - Paste text trực tiếp.
   - Paste URL bài viết và trích xuất nội dung chính.
   - Share URL vào PWA từ mobile/browser để tạo audio nhanh; coi PWA là đủ cho MVP.
   - Upload PDF cơ bản, giới hạn dung lượng/trang, kèm cam kết xóa dữ liệu rõ ràng.

2. **Tạo giọng đọc**
   - 2-3 giọng tiếng Việt chi phí thấp ban đầu; chỉ thêm giọng cao cấp nếu có nhu cầu trả phí rõ ràng.
   - Admin cấu hình tier chất lượng theo provider/model/voice/output format để test chất lượng và pricing mà không cần deploy lại.
   - Tốc độ đọc: 0.75x, 1.0x, 1.25x, 1.5x, 2.0x.
   - Chia nội dung thành đoạn nhỏ để xử lý async và retry.

3. **Audio player**
   - Play/pause, seek, speed, tải MP3 nếu cho phép.
   - Resume vị trí nghe cuối.
   - Highlight đoạn tương ứng trong transcript nếu provider trả timing hoặc nếu tự map theo chunk.

4. **Thư viện cá nhân**
   - Danh sách audio đã tạo.
   - Trạng thái: processing, ready, failed.
   - Xóa audio và nội dung gốc.

5. **Quota và billing-ready**
   - Free: giới hạn ký tự/ngày hoặc phút audio/tháng.
   - Ghi nhận usage theo user, provider, ký tự, thời lượng audio, chi phí ước tính.

### Should-have sau MVP

- Chrome extension chỉ cân nhắc sau beta; MVP giữ PWA + Share URL.
- OCR ảnh/scan PDF.
- Tóm tắt trước khi nghe.
- Playlist và queue nghe offline.
- Voiceover commercial mode cho creator/lồng tiếng video.

### Không làm ở MVP

- Voice cloning cá nhân.
- Realtime conversational voice.
- Marketplace giọng nói.
- App native iOS/Android đầy đủ nếu chưa có retention rõ.

## 8. Lựa chọn provider TTS

| Provider | Phù hợp | Ghi chú chi phí/cách tính |
| --- | --- | --- |
| OpenAI Realtime/audio generation | Prototype nhanh, có thể kết hợp voice + AI workflow | Không nên là mặc định nếu chi phí/audio minute cao hơn lựa chọn khác; dùng cho thử nghiệm chất lượng hoặc tính năng AI bổ sung. |
| Google Cloud Text-to-Speech/Gemini TTS | Ứng viên mặc định nếu giọng Việt đủ tốt và cost/ký tự thấp | Google Cloud TTS tính theo ký tự đầu vào; Gemini TTS tính theo token. Cần benchmark tiếng Việt và chi phí thực tế trước beta. |
| ElevenLabs | Phù hợp lồng tiếng video/creator hoặc giọng cao cấp | Không nên dùng mặc định cho đọc tài liệu dài nếu làm tăng cost; chỉ bật ở gói Pro/creator hoặc khi user chọn chất lượng cao. |
| Azure AI Speech | Enterprise, compliance, nhiều vùng cloud | Azure Speech nêu TTS billed per character; pricing page có nhiều SKU/commitment tiers và custom/personal voice bị giới hạn use case. |

Nguồn pricing/technical:
- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- Google Cloud TTS pricing: https://cloud.google.com/text-to-speech/pricing
- ElevenLabs API pricing: https://elevenlabs.io/pricing/api
- Azure Speech pricing: https://azure.microsoft.com/en-us/pricing/details/speech/

**Khuyến nghị kỹ thuật:** thiết kế `TtsProvider` interface ngay từ đầu để thay provider không ảnh hưởng UI/business logic. Với MVP thị trường Việt Nam, **provider mặc định phải tối ưu chi phí**, sau đó A/B với giọng chất lượng cao cho nhóm creator/lồng tiếng video để đo willingness-to-pay. Admin cần chỉnh được tier chất lượng theo từng use case để test retention và gross margin.

### Tier chất lượng TTS đề xuất

| Tier | Mục tiêu | Cấu hình admin nên chỉnh được | Khi dùng |
| --- | --- | --- | --- |
| Economy | Cost thấp nhất, đủ nghe/preview và đủ giữ retention voiceover MVP | Provider, model/voice rẻ, bitrate thấp-vừa, cache bắt buộc, giới hạn retry | Default cho free tier, Work Pro demo, voiceover, học tập, đọc blog |
| Standard | Cân bằng cost và độ tự nhiên | Provider/model trung bình, voice ổn định, bitrate vừa, retry chuẩn | A/B test hoặc cohort trả phí cần chất lượng cao hơn Economy |
| Premium | Giọng tự nhiên hơn cho output public | Provider/model/voice cao cấp, bitrate cao hơn, xử lý ngắt nghỉ tốt hơn | Lồng tiếng video, creator add-on, export MP3 cuối |
| Experimental | Test provider/voice mới | Bật/tắt theo cohort, quota riêng, log cost/retention | A/B test quality và pricing |

Ngưỡng chất lượng tối thiểu đã chốt cho MVP là **Economy** và kỳ vọng giữ được D7 retention/số voiceover exports như mục tiêu. Admin vẫn giữ Standard/Premium/Experimental vì Standard/Premium có uplift conversion đủ lớn để đáng upsell, nhưng default ban đầu của voiceover, học tập và đọc blog đều là Economy.

## 9. Kiến trúc MVP đề xuất

```text
Client Web/PWA
  ├─ Auth + library + player
  ├─ Share URL ingestion
  └─ Upload/paste/link ingestion

API Backend
  ├─ Content extraction service
  ├─ TTS job orchestration
  ├─ Usage/quota service
  └─ Billing-ready ledger

Worker Queue
  ├─ Chunk text
  ├─ Call TTS provider
  ├─ Merge audio / generate manifest
  └─ Store audio + transcript chunks

Storage
  ├─ Postgres: users, documents, jobs, audio_assets, usage_events
  └─ Object storage: mp3/wav chunks, merged files
```

### Data model tối thiểu

- `users`: id, email, plan, created_at.
- `documents`: id, user_id, title, source_type, source_url, text_hash, language, status.
- `tts_jobs`: id, document_id, provider, voice_id, quality_tier, speed, status, error, created_at, completed_at.
- `tts_quality_configs`: id, tier, provider, model, voice_id, output_format, bitrate, enabled, cohort, estimated_cost_multiplier.
- `audio_assets`: id, document_id, duration_sec, storage_url, manifest_url, size_bytes.
- `usage_events`: id, user_id, provider, chars, audio_seconds, estimated_cost_usd, created_at.
- `playback_positions`: user_id, document_id, position_sec, updated_at.

## 10. Cost guardrails

1. **Quota free cứng và thấp**: ví dụ 20.000-30.000 ký tự/tháng khi thử nghiệm private beta; tăng quota chỉ khi cost thực tế đạt ngưỡng an toàn.
2. **Cache theo `text_hash + voice + speed + provider`**: tránh tạo lại audio cho cùng nội dung public/blog; đặc biệt quan trọng cho Share URL.
3. **Chunking và retry có kiểm soát**: retry tối đa 2 lần/chunk; job dài chuyển queue background.
4. **Preflight cost estimate**: trước khi tạo audio dài, hiển thị số ký tự và quota còn lại.
5. **Retention 30 ngày có kiểm soát storage**: audio hết hạn sau 30 ngày theo retention policy mặc định, nhưng source text/tài liệu gốc nên xóa hoặc tách lưu trữ sớm hơn nếu user không cần chỉnh sửa; user có thể xóa thủ công sớm hơn.
6. **Storage budget guardrail**: vì retention 30 ngày có thể vượt ngưỡng an toàn, guardrail hiệu quả nhất là giới hạn số bản export lưu lại; vẫn theo dõi storage GB/user, nén audio Economy và cảnh báo admin khi storage cost/user vượt budget.
7. **Admin quality switch**: chuyển user/cohort giữa Economy, Standard, Premium, Experimental để đo retention, conversion và cost trước khi cố định pricing.

## 11. Rủi ro và cách giảm thiểu

| Rủi ro | Tác động | Giảm thiểu |
| --- | --- | --- |
| Chi phí TTS cao hơn willingness-to-pay | Gross margin âm | Quota chặt, cache, giới hạn file dài, tier Pro theo ký tự/phút |
| Chất lượng tiếng Việt chưa đủ cho nghe dài | Retention thấp | Test MOS nội bộ, cho user chọn giọng, đặt ngưỡng chất lượng tối thiểu nhưng vẫn ưu tiên cost thấp |
| Bản quyền nội dung upload/link | Rủi ro pháp lý | Chỉ dùng cá nhân, không public/share mặc định, DMCA/contact, không crawl paywall |
| Dữ liệu nhạy cảm trong tài liệu upload | Mất niềm tin | Có cam kết rõ: xóa tài liệu gốc theo yêu cầu, auto-delete nội dung/audio sau 30 ngày, mã hóa storage, không dùng training nếu provider cho opt-out |
| Latency tạo audio file dài | Activation thấp | Streaming preview 1 đoạn đầu, async job, thông báo trạng thái |
| Retention 30 ngày làm storage cost vượt ngưỡng | Margin giảm | Ưu tiên giới hạn số bản export lưu lại, sau đó nén audio Economy, xóa source text sớm hơn audio, dashboard storage cost/user |
| Creator cần chỉnh ngắt nghỉ/nối câu trước khi trả tiền | Conversion thấp nếu thiếu editor | Đưa editor pause/break/join cơ bản vào MVP cho voiceover bằng ký tự điều khiển như `...`, `[throught]`; timeline nâng cao để sau beta |

## 12. Kế hoạch triển khai 6 tuần

### Tuần 1: Discovery + prototype

- Landing page giả lập pricing/waitlist.
- Prototype flow paste text/Share URL → gọi provider chi phí thấp → phát audio.
- Test 20-30 creator/marketer với use case lồng tiếng video, Economy làm mặc định và 1 giọng Standard/Premium để so sánh retention/willingness-to-pay.

### Tuần 2: Core ingestion

- Auth, text input, URL extraction, Share URL, PDF text extraction cơ bản.
- Chuẩn hóa text, chia chunk, lưu document/job.

### Tuần 3: Worker + storage

- Queue async, gọi provider, merge audio hoặc manifest chunk.
- Lưu object storage, tracking usage/cost.

### Tuần 4: Player + library

- Player speed/seek/resume.
- Library, trạng thái job, xóa nội dung.
- Highlight transcript theo chunk.
- Voiceover editor cơ bản: chỉnh ngắt nghỉ/nối câu bằng ký tự điều khiển như `...`, `[throught]`, nối câu/đoạn và preview lại từng câu trước khi export.

### Tuần 5: Quota + beta hardening

- Quota free, Work Pro demo 500.000 ký tự/tháng, kỳ vọng 30% user chạm quota; bỏ daily soft cap 25.000 ký tự/ngày khỏi guardrail chính vì không chặn abuse đủ tốt, thay bằng per-job limit, rate limit và abuse detection.
- Admin dashboard nhỏ: jobs, cost, storage cost/user, số bản export lưu/user, provider error rate, quality tier/cohort switch; default mọi use case là Economy.
- Privacy policy, terms, data deletion.

### Tuần 6: Private beta + monetization test

- Mời 50-100 users.
- Thử paywall mềm khi hết quota.
- Đo activation, D7, cost/audio minute, qualitative feedback.

## 13. Pricing thử nghiệm

- **Free/demo**: 20.000-30.000 ký tự/tháng, lưu audio 30 ngày, 2 giọng Economy.
- **Work Pro demo**: 79.000-129.000 VND/tháng, **500.000 ký tự/tháng**, kỳ vọng 30% user chạm quota và nâng cấp/overage, lưu audio 30 ngày, Economy mặc định; đây là mức đủ thấp để kích hoạt beta trả phí và cân bằng activation/gross margin ban đầu.
- **Creator Pro/Premium**: upsell theo gói tháng, không bán từng export ở MVP; gồm quota cao hơn, Standard/Premium voice, tải WAV/MP3 chất lượng cao và quyền thương mại nếu provider license cho phép.

Pricing cần điều chỉnh theo cost thực tế sau 1-2 tuần beta. Không nên hứa "unlimited" cho TTS vì chi phí biến đổi theo ký tự/audio.

## 14. Checklist ra quyết định sau beta

Tiếp tục đầu tư nếu đạt ít nhất 3/5 điều kiện:

- ≥ 60% người dùng tạo audio đầu tiên trong phiên đầu.
- D7 retention ≥ 20% cho nhóm upload/PDF/link.
- Trung bình ≥ 5 voiceover exports/user/tuần trong nhóm creator active hoặc ≥ 30 phút nghe/user/tuần trong nhóm học tập/blog.
- Chi phí TTS ≤ 20-30% doanh thu dự kiến theo gói Work Pro demo/Creator Pro để giữ ưu tiên chi phí thấp.
- ≥ 5% user beta chạm quota và bày tỏ willingness-to-pay.

## 15. Quyết định triển khai MVP từ các câu hỏi cuối

Các câu hỏi quyết định chính đã được chốt và chuyển thành yêu cầu build đầu tiên:

1. **Per-job limit/rate limit**: Work Pro demo dùng 500.000 ký tự/tháng, per-job limit 12.000 ký tự/job, bỏ daily soft cap 25.000 ký tự/ngày khỏi guardrail chính; dùng monthly quota, per-job limit, rate limit và abuse detection.
2. **Giới hạn export lưu lại**: Free/demo 5 exports, Work Pro 30 exports, Creator Pro 120 exports; đây là guardrail storage chính vì retention 30 ngày có thể vượt ngưỡng an toàn.
3. **Control tokens voiceover**: ngoài `...` và `[throught]`, hỗ trợ `[pause]`, `[short pause]`, `[long pause]`, `[whispers]`, `[excited]`, `[sighs]`, và `<break time="1.5s" />` cho model hỗ trợ SSML. ElevenLabs docs nêu Eleven v3 không hỗ trợ SSML break tags và nên dùng audio tags/punctuation; help center nêu các model khác có thể dùng `<break time="1.5s" />` tối đa 3 giây.
4. **Creator Pro/Premium**: upsell theo gói tháng, không bán từng export ở MVP; đề xuất Creator Pro 199.000 VND/tháng với 1.500.000 ký tự/tháng và Creator Premium 399.000 VND/tháng với 4.000.000 ký tự/tháng, Standard/Premium voices, export WAV/MP3 và quyền thương mại nếu provider license cho phép.
5. **Gross margin với 30% chạm quota**: giả định đủ để test monetization nếu chi phí TTS giữ trong 20-30% doanh thu; MVP phải đo conversion từ nhóm chạm quota sang Work Pro/Creator Pro và overage trong 1-2 tuần beta.

Nguồn ElevenLabs về control/pause tags:
- ElevenLabs Best practices: https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices
- ElevenLabs Help Center về pauses/SSML phoneme tags: https://help.elevenlabs.io/hc/en-us/articles/24352686926609-Do-pauses-and-SSML-phoneme-tags-work-with-the-API
- ElevenLabs API Create speech: https://elevenlabs.io/docs/api-reference/text-to-speech/convert
