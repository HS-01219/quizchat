# 👩‍💻기술 스택
<table>
  <thead>
    <tr>
      <th>구분</th>
      <th>세부 항목</th>
      <th>사용 기술</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="1" align="center">공통</td>
      <td>언어 및 통신</td>
      <td>TypeScript, Socket.IO</td>
    </tr>
    <tr>
      <td rowspan="3" align="center">프론트엔드</td>
      <td>UI</td>
      <td>React, Emotion</td>
    </tr>
    <tr>
      <td>상태 관리</td>
      <td>Zustand</td>
    </tr>
    <tr>
      <td>디자인</td>
      <td>Figma</td>
    </tr>
    <tr>
      <td rowspan="3" align="center">백엔드</td>
      <td>서버</td>
      <td>Node.js, Express</td>
    </tr>
    <tr>
      <td>DB</td>
      <td>Redis, MariaDB</td>
    </tr>
    <tr>
      <td>배포</td>
      <td>AWS, Docker</td>
    </tr>
  </tbody>
</table>

# 👥 팀원 소개
|FE|FE|
|---|---|
|[김희영](https://github.com/heeyoung123)|[손지우](https://github.com/sonjiwoo1215)|
||- 퀴즈 UI 구현 및 퀴즈 시작/종료, 정답 제출 흐름 구현<br>- 채팅 UI 구현 및 실시간 메시지 송수신 처리<br>- 시스템 메시지와 사용자 메시지 구분 처리 및 UI 분기 처리|

|BE|BE|
|---|---|
|[최희수](https://github.com/HS-01219)|[조은채](https://github.com/jo-eunchae)|
|- 유저, 퀴즈 관련 소켓 통신 이벤트 구현<br>- AWS와 Docker를 이용한 배포<br>- FE 스크립트 오류 수정|- 메세지, 투표 관련 소켓 통신 이벤트<br>- GitHub Action을 통한 배포 자동화|



# 💿 실행 방법
## 환경변수
- backend 폴더 내 .env 파일 생성
```docker
# 서버 포트 번호
PORT=YOUR_PORT_NUMBER

# DB 정보
DB_HOST=YOUR_HOST_NAME
DB_PORT=YOUR_PORT_NUMBER
DB_USER=YOUR_USER_NAME
DB_PASSWORD=YOUR_PASSWORD

# redis 정보
REDIS_HOST=YOUR_HOST_NAME
REDIS_PORT=YOUR_PORT_NUMBER
REDIS_PASSWORD=YOUR_PASSWORD

FRONT_SERVER_URL=FRONT_URL
```

- frontend 폴더 내 .env 파일 생성
```docker
VITE_BACK_SERVER_URL = BACK_URL
```    

## docker-compose를 이용한 실행
```docker
# 백그라운드에 도커 실행 후 터미널에 입력
# 이 때 docker-compose.yml에 있는 포트 번호가 
# 당신의 env 파일 포트 번호와 일치해야 합니다.
docker compose up -d --build
```

## 로컬 실행
```docker
# 터미널에서 입력
# 백엔드
cd backend
npm install
npm run build
npm run start

# 새 터미널 창 열고 입력
# 프론트엔드
cd frontend
npm install
npm run build
npm run start

# 로컬 환경에서 redis 설치 후 실행
# 브라우저에서 localhost:YOUR_PORT_NUMBER 로 접속 
```

# 📌 기능 설명
## 유저/채팅
|입장/퇴장|닉네임 변경|실시간 채팅|
|---|---|---|
|![유저 입장 및 퇴장](./assets/join_leave_room.gif)|![닉네임 변경](./assets/update_nickname.gif)|![실시간 채팅](./assets/chat.gif)|

## 퀴즈
|시작|정답 입력|종료 버튼|
|---|---|---|
|![퀴즈 시작](./assets/start_quiz.gif)|ㅇㅇ|ㅇㅇ|

## 투표
|시작|진행|종료 버튼|
|---|---|---|
|ㅇㅇ|ㅇㅇ|ㅇㅇ|
