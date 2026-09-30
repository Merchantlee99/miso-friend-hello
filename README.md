# 미소 친구 소개 안내 사이트

미소 친구 소개 신청 화면과 게시 가이드의 소스 코드입니다.

## 주요 파일

- `src/pages/GuidePage.tsx`: 당근 글 올리기, 게시글 링크 전달, 지원자 응대, 초대링크 복사 안내
- `src/data/guide-templates.json`: 공고 제목·본문 1,000개
- `public/guide/`: 현재 가이드에서 사용하는 화면 사진
- `public/videos/` 및 `public/*.mp4`: 사이트에 보관된 안내 영상
- `media/`: 목적별로 이름을 정리한 사진·동영상 복사본

## 실행

```bash
pnpm install
pnpm run build
pnpm run dev
```

환경 변수 이름은 `.env.example`에서 확인할 수 있습니다.
