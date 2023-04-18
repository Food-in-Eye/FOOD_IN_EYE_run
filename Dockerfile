FROM node:18.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

RUN npm install -g nodemon

RUN npm install -g react-cropper

RUN npm install -g browser-image-compression

# 개발시에는 마운트 하기 때문에 주석처리, 배포시에는 주석 풀 것
# COPY . .

ENV NODE_ENV=development

EXPOSE 3000

# 개발할 때의 커멘드
CMD ["nodemon", "--inspect=0.0.0.0:9229", "src/index.js"]

# 배포할 때의 커멘드
# CMD ["npm", "start"]