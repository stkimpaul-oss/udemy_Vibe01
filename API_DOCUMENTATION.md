# API 문서

이 프로젝트는 RESTful API를 제공하여 웹사이트를 방문하지 않아도 데이터를 가져올 수 있습니다.

## 기본 URL

```
http://localhost:3000/api
```

프로덕션 환경에서는 실제 도메인으로 변경하세요.

## 엔드포인트

### 1. Health Check

API 상태를 확인합니다.

**요청:**
```
GET /api/health
```

**응답:**
```json
{
  "status": "ok",
  "message": "API is running",
  "timestamp": "2024-12-24T01:00:00.000Z"
}
```

---

### 2. 모든 프로젝트 목록

모든 프로젝트 목록을 반환합니다.

**요청:**
```
GET /api/projects
```

**응답:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "모바일 앱 프로젝트",
      "description": "프로젝트에 대한 간단한 설명...",
      "longDescription": "이 프로젝트는 현대적인 모바일 앱 개발...",
      "technologies": ["Next.js", "TypeScript"],
      "imageUrl": "https://images.unsplash.com/...",
      "githubUrl": "https://github.com/yourusername/project1",
      "portfolioUrl": "https://project1-demo.vercel.app"
    },
    ...
  ],
  "count": 3
}
```

---

### 3. 특정 프로젝트 상세 정보

ID로 특정 프로젝트의 상세 정보를 반환합니다.

**요청:**
```
GET /api/projects/[id]
```

**예시:**
```
GET /api/projects/1
```

**응답:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "모바일 앱 프로젝트",
    "description": "프로젝트에 대한 간단한 설명...",
    "longDescription": "이 프로젝트는 현대적인 모바일 앱 개발...",
    "technologies": ["Next.js", "TypeScript"],
    "imageUrl": "https://images.unsplash.com/...",
    "githubUrl": "https://github.com/yourusername/project1",
    "portfolioUrl": "https://project1-demo.vercel.app"
  }
}
```

**에러 응답 (프로젝트를 찾을 수 없을 때):**
```json
{
  "success": false,
  "error": "프로젝트를 찾을 수 없습니다."
}
```

---

### 4. 포트폴리오 기본 정보

포트폴리오의 기본 정보를 반환합니다.

**요청:**
```
GET /api/portfolio
```

**응답:**
```json
{
  "success": true,
  "data": {
    "name": "Paul",
    "title": "Full Stack Developer",
    "description": "Paul's First Next.js 프로젝트 - 개발자 포트폴리오에 오신 것을 환영합니다.",
    "email": "your-email@example.com",
    "github": "https://github.com/yourusername",
    "skills": [
      "Next.js",
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "Git",
      "GitHub"
    ]
  }
}
```

---

## 사용 예시

### cURL

```bash
# Health Check
curl http://localhost:3000/api/health

# 모든 프로젝트 가져오기
curl http://localhost:3000/api/projects

# 특정 프로젝트 가져오기
curl http://localhost:3000/api/projects/1

# 포트폴리오 정보 가져오기
curl http://localhost:3000/api/portfolio
```

### JavaScript (Fetch API)

```javascript
// 모든 프로젝트 가져오기
fetch('http://localhost:3000/api/projects')
  .then(response => response.json())
  .then(data => console.log(data));

// 특정 프로젝트 가져오기
fetch('http://localhost:3000/api/projects/1')
  .then(response => response.json())
  .then(data => console.log(data));

// 포트폴리오 정보 가져오기
fetch('http://localhost:3000/api/portfolio')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript (Async/Await)

```javascript
async function getProjects() {
  try {
    const response = await fetch('http://localhost:3000/api/projects');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getProjects();
```

### Python

```python
import requests

# 모든 프로젝트 가져오기
response = requests.get('http://localhost:3000/api/projects')
data = response.json()
print(data)
```

---

## 에러 처리

모든 API는 일관된 에러 형식을 반환합니다:

```json
{
  "success": false,
  "error": "에러 메시지"
}
```

**HTTP 상태 코드:**
- `200`: 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 오류

---

## 참고사항

- 모든 API는 JSON 형식으로 응답합니다.
- CORS가 활성화되어 있어 다른 도메인에서도 접근 가능합니다.
- 프로덕션 환경에서는 적절한 인증 및 보안 설정을 추가하는 것을 권장합니다.

