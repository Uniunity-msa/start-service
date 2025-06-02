# 1. Node.js 베이스 이미지 사용
FROM node:18

# 2. 컨테이너 내부 작업 디렉토리 지정
WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# 3. package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 코드 복사
COPY . .

# 5. 앱이 사용하는 포트 열기 (ex: 3000)
EXPOSE 3001

# 6. 서버 실행
CMD ["node", "main.js"]
# CMD ["./wait-for.sh", "mysql_host", "3306", "node", "main.js"]]
