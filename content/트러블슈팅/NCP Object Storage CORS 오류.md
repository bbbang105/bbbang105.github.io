---
date: 2025-12-20
description: NCP Object Storage에서 프론트엔드 접근 시 발생한 CORS 오류를 s3cmd로 해결합니다
tags:
  - troubleshooting
  - backend
---

---

# 🚨 문제 상황

```bash
Access to fetch at '<https://kr.object.ncloudstorage.com/dev-optizen-upload/audios/2025/12/22/2791/USER_54669b8e.wav>' from origin '<http://localhost:3000>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.Understand this error
useWavesurfer.ts:54  GET <https://kr.object.ncloudstorage.com/dev-optizen-upload/audios/2025/12/22/2791/USER_54669b8e.wav> net::ERR_FAILED 200 (OK)
```

- **프론트에서 스토리지 URL로 접근할 때 CORS 오류 발생**

---

# ✅ 해결 방법

[PutBucketCORS](https://api.ncloud-docs.com/docs/storage-objectstorage-putbucketcors)

- **버킷 공개 설정**
- **API로 CORS 설정**

## **🧑🏻‍💻 NCP Object Storage CORS 설정 명령어 정리**

### **1. s3cmd 설치**

```bash
brew install s3cmd
```

### **2. ~/.s3cfg 설정 파일 생성**

```bash
cat > ~/.s3cfg << 'EOF'
[default]
access_key = YOUR_ACCESS_KEY
secret_key = YOUR_SECRET_KEY
host_base = kr.object.ncloudstorage.com
host_bucket = %(bucket)s.kr.object.ncloudstorage.com
use_https = True
EOF
```

### **3. cors.xml 파일 생성**

```bash
echo '<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="<http://s3.amazonaws.com/doc/2006-03-01/>">
  <CORSRule>
    <AllowedOrigin><http://localhost:3000></AllowedOrigin>
    <AllowedOrigin><https://dev-chat-socc.logosai.co.kr></AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>' > cors.xml
```

### **4. CORS 적용**

```bash
s3cmd setcors cors.xml s3://dev-optigen-upload
```
