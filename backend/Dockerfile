FROM node:23-alpine3.21

WORKDIR /app
RUN apk add curl
RUN curl -L https://unpkg.com/@pnpm/self-installer | node
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install
COPY tsconfig.json ./
COPY src src

EXPOSE 3000

CMD ["pnpm", "start"]