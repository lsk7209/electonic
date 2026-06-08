# 미국 전기요금 pSEO 사이트 — 기획 / Claude Code 핸드오프 스펙 v1.2

> 한 줄 정의: **EIA 공공 데이터(PD)로 미국 주·유틸별 전기요금을 "계산값+분석형 정보성 콘텐츠"로 재가공해, 평균 청구서·추세·비교·요금 인상 해설·절감 가이드를 제공하고 AdSense로 수익화하는 pSEO 사이트.**

작성: 2026-06-07 / 상태: 3인·5인 페르소나 스트레스테스트 반영, Phase 0 착수 대기
변경 이력:
- v1.0→v1.1: 정보성 레이어 / 추정기 정직화 / EEAT 투명성 / 유틸 수요 게이트
- v1.1→v1.2: ①규제·자유화 주 2-템플릿 ②AIO 방어룰 ③절감+LIHEAP 클러스터 ④신선도 하드룰+Bulk ⑤법무 베이스라인 ⑥광고 차등·심사 타이밍 ⑦추정기 사용량/시즌 선택

---

## 1. 확정된 전략 결정 (locked)

| 항목 | 결정 | 비고 |
|---|---|---|
| 데이터 소스 | **EIA API v2 단독** | Public Domain |
| 수익화 | **AdSense Auto Ads (디스플레이만)** | 리드젠/제휴 제외 |
| 콘텐츠 | 데이터 페이지(state 허브+utility) + **정보성/뉴스** + **절감·지원 에버그린** | 정보성·에버그린이 볼륨 핵심 |
| 주 페이지 | **규제 / 자유화 2-템플릿 분리** | 정확성·관련성 동시 |
| 범위 | **전기만** | 가스=별도 도메인 |
| 차별화 | 계산값 moat + 분석형 콘텐츠 + 인터랙티브 툴 | 복붙·재배포 클린 + AIO 저항 |
| 확장 우선순위 | 정보성·에버그린 > 도시 레이어 | 도시 fuzzy 매핑 후순위 |
| 컴플라이언스 | 개인정보처리방침+CMP, 클라이언트사이드 추정기, WCAG 기본 | 11장 |

### 의도적으로 뺀 것
- 요금제 비교/리드젠(plan 데이터 없음+라이선스+거인) / 도시 fuzzy 매핑(후순위).

---

## 2. 데이터 소스 (EIA API v2)

- `https://api.eia.gov/v2/electricity/...` (무료 key) · 라이선스 **Public Domain**
- state 가격 **월(EIA-826)**, utility **연(EIA-861)** + 대형 유틸 일부 월(861M)

| 용도 | 폼 | 단위 | 갱신 |
|---|---|---|---|
| 주별 평균 소매요금(주거/상업/산업) | 826 | 주×월 | 월 |
| 유틸별 매출·판매·고객수·평균단가 | 861 | 유틸×연 | 연 |

### ⚠️ 신선도 하드룰 (★중요★)
- **861은 시차 큼**: 2024년 데이터가 2025-11 최종 공개 → 2026 중반 유틸 페이지 = ~1.5년 묵음.
- **모든 "current / [year] 인상" 콘텐츠는 826 월별(주 단위)로만 소싱.** 861은 "연 레퍼런스"로만, **vintage 라벨 필수**.
- 백필은 API 난타 말고 **EIA Bulk Download(하루 2회)** 사용.

### Phase 0 (코드 전 필수) — EIA 필드 매핑
- [ ] retail-sales facet/컬럼 · state 월별 시리즈 path · 861 라우트+고객수/매출/판매+**연도(vintage)** · 서비스지역 메타 · PD 재확인

---

## 3. 3-레이어 아키텍처

1. **Raw(PD)**: 주·유틸 요금/매출/판매/고객수
2. **계산(moat)**: 평균 청구서(범위)·추세·순위·델타
3. **AI 해석**: 추세·인상 원인·절감법·비교 코멘트

---

## 4. 계산 moat — "평균 월 전기요금" 추정기 (히어로)

단일 숫자 금지(평균가는 고정요금·구간제·TOU 혼합 매출/판매값).

```
표시 = "[주] 예상 월 전기요금: $X ~ $Y" (범위)
중앙값 = 월 사용량(kWh) × 주거 평균단가(¢/kWh) / 100
사용량 입력 = 저 / 평균(~900kWh) / 고  또는 시즌(여름·겨울) 선택  ← v1.2
```
고지(하단, 눈에 띄게):
- "평균 요금 기반 추정. 고정 기본요금·구간제·TOU·실제 요금제 미반영 — 실제 청구서와 다를 수 있음."
- 자유화 주: "경쟁 요금제 시장. 위 수치는 규제/평균 벤치마크이며 실제 플랜 가격은 다름."
- 부가: "[가장 싼 주] 대비 연간 차액"

State/Utility 계산값: 추세 라인차트·YoY·전국순위·인접주/주평균 대비 ±%, 유틸은 주평균 대비 ±%·규모·랭킹 + vintage 라벨.

---

## 5. 콘텐츠 레이어

### (A) 데이터 페이지 — 규제 vs 자유화 2-템플릿 ★v1.2★
- **규제 주**: "요금은 PUC가 결정 → 추세·인상 이유·절감법" (쇼핑 없음)
- **자유화 주(~13주+DC)**: "쇼핑 가능 → 평균 벤치마크 + 플랜 상이 안내" (향후 plan 떡밥)

### (B) 정보성/뉴스 — 볼륨 엔진
| 템플릿 | 쿼리 예 | 소스 |
|---|---|---|
| average electric bill in [state] | "average electric bill in texas" | 826 |
| [utility] rate increase [year] | "oncor rate increase 2026" | **826 only(신선도룰)** |
| why is electricity expensive in [state] | — | 추세·순위+AI |
| cheapest electricity states [year] | 랭킹 리스트 | 826 전주 |

### (C) 절감·지원 에버그린 클러스터 ★v1.2★
- "[state]에서 전기요금 줄이는 법" / "electric bill help [state]" / **LIHEAP(저소득 지원) 안내**
- 진짜 도움 = EEAT+, 에버그린, AdSense 친화

### AIO 방어 룰 ★v1.2★
- 단순 팩트 페이지(average bill 등)는 AI Overview에 잠식됨 → **반드시 인터랙티브 추정기/비교 툴 동봉**해 zero-click 저항.

---

## 6. 페이지 구조 & URL

```
/                                        → 전국 개요 + 추정기 + 순위표
/[state]/                                → State 허브 (규제/자유화 분기)
/[state]/[utility-slug]/                 → Utility (수요 게이트 통과분만)
/guides/average-electric-bill-[state]/   → 정보성
/guides/[utility]-rate-increase-[year]/  → 정보성(826 기반)
/save/[state]/  /assistance/[state]/     → 절감·LIHEAP
/methodology/ /sources/ /about/ /privacy/ → EEAT+법무
/[state]/[city-slug]/  (Phase 2)         → 도시
```

### 유틸 수요 게이트
- 죽은 클론 금지. 브랜드 검색량 OR 고객수 임계값 통과분만 단독 페이지. 미통과 소형 유틸은 **주 페이지 테이블 흡수**. (임계값 Phase 0)

---

## 7. EEAT 투명성

- `/methodology/`(계산 로직·한계) · `/sources/`(EIA 폼·갱신·PD) · `/about/`
- 전 페이지: **vintage 라벨 + EIA 출처 링크 + last updated**

---

## 8. 법무·컴플라이언스 베이스라인 ★v1.2 신규★

- **상표**: "Oncor/PG&E" 등 제목·URL 사용은 nominative use로 OK이나 **"[utility]와 무관" 고지 + 로고 사용 금지**. "save money" 단정 회피.
- **프라이버시**: AdSense 쿠키 → **개인정보처리방침 + CMP(동의관리)** 필수(CA·EU). 추정기는 **전부 클라이언트사이드(입력 미전송·미저장) → PII 0**.
- **접근성**: WCAG 기본 준수(미국 ADA 드라이브-바이 소송 리스크↓).
- 디스클레이머는 **눈에 띄게**(묻지 말 것).

---

## 9. 콘텐츠·AI 생성

- Gemini Flash/Pro 1차·Claude 백업 / `article-writer`+`persona-writer`
- 차별화 임계 강제: 페이지당 고유 데이터포인트 ≥N + 고유 차트 + per-page 산문(팩트 게이트). "숫자 하나만 교체" 금지.

---

## 10. AdSense & Scaled Content Abuse 방어

- 웨이브/램프 발행, day-one 대량 인덱싱 금지 / **7일 dry run** / dedup(cosine·n-gram) / 검수 큐 / 수요 게이트 / 실질·시각적 차별화 / 추정기 디스클레이머
- **광고 차등 ★v1.2★**: 툴·비교(상업 의도) 무겁게 / 순수 정보 가볍게. 추정기 주변 과밀 금지(CWV·UX 보호).
- **심사 타이밍 ★v1.2★**: thin/공사중 신청 금지 → EEAT+법무 페이지 + 강한 30~50개 인덱싱 후 신청.

---

## 11. 기술 스택

- Next.js 15 App Router + Vercel Pro(SSG/ISR) / Turso(libSQL)+Drizzle / Vercel Cron(월) / AdSense Auto Ads / GitHub(NomaDamas) / AI: Gemini 1차
- **DB 스키마 = 시계열**(state·sector·period·value·**vintage**), EIA 과거값 리비전 대응
- **CMP** 통합(쿠키 동의), 추정기 클라이언트사이드

```
Cron(월) → EIA fetch(826/861) + Bulk Download(백필)
  → 계산(범위·추세·순위·델타) → Turso upsert(vintage) → 변경분 ISR revalidate
```

---

## 12. 단계별 로드맵

| Phase | 내용 | 게이트 |
|---|---|---|
| **0** | EIA 필드 매핑 + PD 재확인 + 도메인 + 유틸 수요/임계값 캘리브 | 코드 전 필수 |
| **1** | 스키마→ingest(Bulk 백필)→state(2템플릿)+유틸(게이트)+정보성+절감/LIHEAP+추정기(범위·사용량)+EEAT+법무 페이지+AI해석. 빌드하되 인덱싱 X | — |
| **1.5** | 7일 dry run·dedup·검수 큐 | 통과 |
| **1.6** | 웨이브 발행 → 강한 30~50개 인덱싱 후 AdSense 신청 | — |
| **2** | 도시 레이어(단일 지배 유틸 1:1) | 엔진 검증 후 |
| **확장** | 가스=별도 도메인 | 도메인 격리 |

### 콘텐츠 캘린더 ★v1.2★
- 시즌물(여름·겨울 청구서)은 **시즌 6~8주 전 dry run 시작** → 웨이브 게이트와 충돌 없이 적시 발행.

---

## 13. 열린 항목
1. 도메인 네이밍(영어): powerratemap / mywattbill / ratewatt / billmeter 류
2. 유틸 수요 게이트 기준+임계값 (Phase 0)
3. EIA 정확한 라우트/필드/vintage (Phase 0)
4. 추정기 범위 오차폭 산정식 · 사용량 레벨 구간값

---

## 14. 리스크 & 게이트 요약
- 라이선스: EIA=PD ✓ (Phase 0 재확인)
- 정확성: 평균가≠실청구서 → 범위+사용량선택+고지, 규제/자유화 분리
- **신선도**: 826(월) 백본 / 861(연) 레퍼런스+vintage / "인상[year]"=826만
- Scaled Content Abuse: 수요 게이트+실질 차별화+품질 볼륨
- **AIO**: 단순 페이지에 인터랙티브 툴 동봉
- **법무**: 상표 무관 고지·로고 금지 / 개인정보+CMP / 클라이언트사이드 PII 0 / WCAG
- EEAT: 방법론·출처·vintage 투명성
