---
date: 2025-12-24
tags:
  - troubleshooting
  - backend
---

---

# **🚨 문제 상황**

```bash
[2025-12-22 18:04] Step 8/27 : RUN npm run build
[2025-12-22 18:04] ---> Running in 3af233bcedbc
[2025-12-22 18:04] > socc-front@0.1.0 build
[2025-12-22 18:04] > env-cmd -f .env.prod next build
[2025-12-22 18:04] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[2025-12-22 18:04] This information is used to shape Next.js' roadmap and prioritize features.
[2025-12-22 18:04] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[2025-12-22 18:04] <https://nextjs.org/telemetry>
[2025-12-22 18:04] ▲ Next.js 16.0.10 (Turbopack)
[2025-12-22 18:04] - Environments: .env
[2025-12-22 18:04] - Experiments (use with caution):
[2025-12-22 18:04] · optimizePackageImports
[2025-12-22 18:04] ✓ webpackMemoryOptimizations
[2025-12-22 18:04] Creating an optimized production build ...
```

NCP SourceBuild에서 Next.js 16 프로젝트를 Docker 빌드할 때, **"Creating an optimized production build..."** 단계에서 10분 이상 멈추는 현상이 발생했습니다. 로컬 환경에서는 정상적으로 빌드되지만, NCP CI/CD 환경에서만 무한 대기 상태에 빠졌습니다.

---

# **✅ 시도한 해결 방법**

## **1. 메모리 할당량 증가**

```docker
# Node.js 메모리 제한 설정 (빌드 최적화)
# NCP SourceBuild: 16GB 메모리 → 8GB 할당
ENV NODE_OPTIONS="--max-old-space-size=8192"
```

Next.js 빌드는 메모리를 많이 사용합니다. NCP SourceBuild가 16GB 메모리를 제공하지만, Node.js 기본 힙 메모리 제한은 약 4GB입니다. 이를 8GB로 늘려서 메모리 부족으로 인한 빌드 지연을 방지했습니다.

## **2. optimizePackageImports 적용**

```tsx
optimizePackageImports: ["lucide-react", "recharts", "date-fns", "react-icons", "ckeditor5"]
```

위 패키지들은 "barrel file" 구조를 사용합니다. 예를 들어 import { Check } from "lucide-react"를 하면 실제로는 수천 개의 아이콘을 모두 불러온 후 하나만 선택합니다. 이 설정을 적용하면 실제 사용하는 모듈만 번들링하여 빌드 시간과 번들 크기를 줄일 수 있습니다.

## **3. 로컬 폰트로 변경**

```tsx
// 변경 전: next/font/google 사용
import { Geist } from "next/font/google"
```

```tsx
// 변경 후: next/font/local 사용  
import localFont from "next/font/local"
```

next/font/google은 빌드 시 Google Fonts 서버에서 폰트를 다운로드합니다. Docker 빌드 환경에서는 네트워크 요청이 타임아웃되거나 차단될 수 있어서 빌드가 멈추는 원인이 됩니다. 폰트 파일을 프로젝트에 직접 포함시켜 네트워크 의존성을 제거했습니다.

## **4. 캐시 제거 + Telemetry 비활성화**

```docker
ENV NEXT_TELEMETRY_DISABLED=1
RUN rm -rf .next node_modules/.cache && npm run build
```

Next.js는 기본적으로 Vercel 서버에 익명 사용 통계를 전송합니다. 폐쇄망이나 프라이빗 환경에서는 이 네트워크 요청이 타임아웃될 때까지 대기하면서 빌드가 지연될 수 있습니다. 또한 이전 빌드의 캐시가 남아있으면 캐시 검증 과정에서 충돌이 발생할 수 있어서 매번 클린 빌드를 수행하도록 변경했습니다.

## **5. APP_ENV에 맞는 빌드 스크립트 실행**

```bash
[2025-12-22 18:04] Step 6/27 : RUN if [ -f ".env.${APP_ENV}" ]; then cp ".env.${APP_ENV}" .env; echo "${APP_ENV} 으로 빌드합니다."; else echo "⚠️ .env.${APP_ENV} 파일이 없습니다."; fi
```

```docker
RUN npm run build:${APP_ENV}
```

기존에는 APP_ENV=dev로 설정해서 .env.dev 파일을 복사했지만, 빌드 스크립트는 npm run build를 실행하여 .env.prod를 참조하는 불일치가 있었습니다. 환경변수에 따라 올바른 빌드 스크립트(build:dev, build:prod)를 실행하도록 수정했습니다.

## **6. Webpack 사용 (Turbopack 비활성화): ✅ 핵심 해결책**

```tsx
"build:dev": "env-cmd -f .env.dev next build --webpack"
```

Next.js 16부터 Turbopack이 production 빌드의 기본 번들러가 되었습니다. Turbopack은 Rust로 작성된 차세대 번들러로 빠른 빌드 속도를 목표로 하지만, 아직 특정 CI/CD 환경에서 호환성 문제가 있습니다.

NCP SourceBuild 환경에서 Turbopack이 모듈을 제대로 resolve하지 못하거나 파일시스템 캐싱에 문제가 발생하여 빌드가 무한 대기 상태에 빠졌습니다. --webpack 플래그를 추가하여 검증된 Webpack 번들러를 사용하도록 변경하니 정상적으로 빌드가 완료되었습니다.

---

# **🔍 Turbopack 빌드 실패 실제 사례들**

검색 결과, 비슷한 문제를 겪은 사례가 많이 있습니다.

## **1. 무한 루프 / 컴파일 멈춤 현상**

[GitHub Discussion #77102](https://github.com/vercel/next.js/discussions/77102)에서 보고된 사례:

> 증상: "Compiling..." 상태에서 멈춤, CPU 700%+, 메모리 20GB+ 지속 증가, 10분 이상 진행 불가

**원인**: Next.js 유지보수자(timneutkens)가 밝힌 바로는 **특정 import() 중첩 조합으로 인한 무한 루프**가 발생할 수 있음. 순환 참조(circular dependency)가 있을 때 Webpack은 경고만 표시하지만, Turbopack은 **무한 루프에 빠짐**.

## **2. Docker 환경에서 빌드 멈춤**

[GitHub Discussion #58422](https://github.com/vercel/next.js/discussions/58422)에서 보고된 사례:

> 로컬에서는 정상 빌드되지만, Docker CI/CD 환경에서 몇 시간 동안 멈춤

**해결**: oven/bun 이미지 대신 node:20.11.1-slim 이미지로 변경하니 해결됨. 베이스 이미지와 Turbopack 호환성 문제.

## **3. Turbopack 크래시, Webpack 정상**

[GitHub Issue #63924](https://github.com/vercel/next.js/issues/63924)에서 보고된 사례:

> Turbopack으로 실행하면 즉시 크래시, 같은 설정으로 Webpack은 정상 작동

**원인**: Turbopack의 ESM 모듈 로딩 방식이 특정 설정 파일(postcss.config.js 등)과 호환되지 않음

## **4. Next.js 16 업그레이드 후 빌드 실패**

[GitHub Issue #85371](https://github.com/vercel/next.js/issues/85371)에서 보고된 사례:

> Next.js 16 업그레이드 후 Turbopack 빌드 실패: "asset is not placeable in ESM chunks"

**해결**: serverExternalPackages 옵션으로 문제 패키지 제외

## **📌 왜 우리 환경에서 안 됐을까? (추측)**

|**가능한 원인**|**설명**|
|---|---|
|**순환 참조**|프로젝트 코드에 순환 import가 있을 수 있음|
|**NCP 컨테이너 환경**|Alpine Linux + 특정 파일시스템에서 Turbopack 캐시 동작 이상|
|**모듈 resolve 차이**|@tanstack/react-query, @radix-ui/react-progress 등을 Turbopack이 제대로 찾지 못함 (실제 에러 로그에서 확인됨)|
|**Rust 바이너리 호환성**|Turbopack은 Rust로 작성됨. 특정 아키텍처/OS에서 바이너리 호환 문제 가능|

## **결론**

**Turbopack은 아직 production CI/CD 환경에서 불안정**합니다. Next.js 공식 문서에서도 --webpack 플래그로 fallback할 수 있다고 안내하고 있습니다. Vercel 자체 환경이 아닌 NCP, AWS, GitHub Actions 등에서는 Webpack 사용을 권장합니다.

---

# **🔗 레퍼런스**

- [GitHub Discussion #60147 - Creating an optimized production build 멈춤](https://github.com/vercel/next.js/discussions/60147)
- [Next.js Turbopack API Reference](https://nextjs.org/docs/app/api-reference/turbopack)
- [Next.js 16 Upgrading Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
