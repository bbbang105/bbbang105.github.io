---
date: 2025-12-15
description: "macOS NFD 인코딩으로 인한 한글 파일명 자소 분리와 DB 검색 실패 문제를 해결합니다."

tags:
  - troubleshooting
  - backend
---

---

# 🚨 문제 상황

```sql
SELECT * FROM RAG_DOCUMENT_FILE
WHERE BOT_UID = 85
  AND IS_DELETED = 0
  AND ORIGINAL_FILENAME LIKE '%가이드%';
*-- 결과: 0건 (실제 데이터 존재함)*
```

- 데이터가 있음에도, LIKE 문으로 조회하지 못 하는 문제가 발생함
    - **키워드를 영어로 넣었을 때는 문제가 없음 → 한글 관련 문제로 예상**

### **환경**

- DB: MySQL 8.x
- Collation: utf8mb4_general_ci
- Character Set: 모두 utf8mb4

---

# **🔍 원인 분석**

## **1. 초기 의심: 인코딩 문제?**

### HEX 값으로 저장 상태 확인

```sql
SELECT ORIGINAL_FILENAME, HEX(ORIGINAL_FILENAME) FROM RAG_DOCUMENT_FILE;
```

### 결과

- 가이드.pdf → E18480E185A1E18480E185B5E18483E185B2...
    - **정상적인 UTF-8 인코딩**이지만, **NFD 형태임을 알게 됨**

## **2. 핵심 발견: NFD vs NFC**

### **정상적인 NFC (조합형)**

|**글자**|**HEX**|
|---|---|
|가|EAB080|
|이|EC9DB4|
|드|EB939C|

### **문제의 NFD (분해형)**

|**글자**|**HEX**|**구성**|
|---|---|---|
|가|E18480 E185A1|ㄱ + ㅏ|
|이|E18480 E185B5|ㅇ + ㅣ|
|드|E18483 E185B2|ㄷ + ㅡ|

## **3. 근본 원인: macOS의 파일 시스템**

**macOS는 파일명을 NFD (Normalization Form Decomposed) 형태로 저장함**

- **한글이 자모 단위로 분리됨 (`가 → ㄱ + ㅏ`)**
- Windows/Linux는 **NFC (Normalization Form Composed)** 사용 (가 → 가)

> 💡**사용자가 macOS에서 파일을 업로드하면 NFD로 저장되고, 검색 시 키보드 입력은 NFC이므로 매칭되지 않는다.**

> **[출처: [나무위키](https://namu.wiki/w/APFS)]**
> 
> APFS는 파일 이름을 있는 그대로의 raw bytes를 저장하기에 유니코드 NFD, NFC 노멀라이제이션 방식에 상관없이 둘다 저장할 수 있다.
> 
> **하지만 내부에서 모든 처리는 강제로 NFD로 이루어진다.** 예를 들어, 파일 이름 조회 또는 변경 시 내부에서 무조건 NFD 형태로 변환하고 처리하도록 설계되어 있다. **따라서 NFC로 저장하더라도, 시스템 콜에는 NFD 노멀라이제이션을 적용하기에 한글 자모음 분리 현상이 나타날 수 있다.**

---

# **✅ 해결 방법**

## **파일 저장 시 NFC로 정규화**

```java
import java.text.Normalizer;

*/**
 * 파일명 정규화 (NFD -> NFC 변환, macOS 한글 자소 분리 문제 해결)
 */*
private String normalizeFilename(String filename) {
    if (StringUtils.isBlank(filename)) {
        return "unknown";
    }
    return Normalizer.normalize(filename, Normalizer.Form.NFC);
}
```

## **🛠 Java Normalizer API**

### normalize **메서드**

```java
/**
 * Normalize a sequence of char values.
 * The sequence will be normalized according to the specified normalization
 * form.
 * @param src        The sequence of char values to normalize.
 * @param form       The normalization form; one of
 *                   {@link java.text.Normalizer.Form#NFC},
 *                   {@link java.text.Normalizer.Form#NFD},
 *                   {@link java.text.Normalizer.Form#NFKC},
 *                   {@link java.text.Normalizer.Form#NFKD}
 * @return The normalized String
 * @throws NullPointerException If {@code src} or {@code form}
 * is null.
 */
public static String normalize(CharSequence src, Form form) {
    return NormalizerBase.normalize(src.toString(), form);
}
```

|**파라미터**|**설명**|
|---|---|
|src|정규화할 문자열|
|form|정규화 형식 (NFC, NFD, NFKC, NFKD)|
|반환값|정규화된 문자열|

### **정규화 형식 (Normalization Form)**

|**Form**|**이름**|**설명**|**예시 (가)**|
|---|---|---|---|
|**NFC**|Canonical Composition|분해 후 **조합** (표준 조합형)|가 → 가 (1글자)|
|**NFD**|Canonical Decomposition|**분해**만 수행|가 → ㄱ + ㅏ (2글자)|
|**NFKC**|Compatibility Composition|호환 분해 후 조합|ℌ → H|
|**NFKD**|Compatibility Decomposition|호환 분해만 수행|ﬁ → f + i|
|||||

---

# 🔗 레퍼런스

[[Java] 파일 업로드 - MacOS 한글 자모음 분리](https://velog.io/@dondonee/Java-%ED%8C%8C%EC%9D%BC-%EC%97%85%EB%A1%9C%EB%93%9C-MacOS-%ED%95%9C%EA%B8%80-%EC%9E%90%EB%AA%A8%EC%9D%8C-%EB%B6%84%EB%A6%AC)

[NAVER D2](https://d2.naver.com/helloworld/76650)
