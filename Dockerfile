FROM node:alpine3.18 as builder 

WORKDIR /app

COPY . .

ENV DATABASE_URL="postgresql://user:password@host:5432/database"

RUN npm install -g pnpm

RUN pnpm i

ENV NODE_ENV="production"

RUN pnpm build 

EXPOSE 8080

CMD [ "pnpm", "start" ]
