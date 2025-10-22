FROM node:23-alpine3.21

WORKDIR /app
RUN apk add curl
RUN curl -L https://unpkg.com/@pnpm/self-installer | node
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm i

COPY vite.config.ts ./
COPY components.json ./
COPY tsconfig.app.json ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY codegen.ts ./
COPY public public
COPY index.html ./
COPY src src

RUN pnpm run build

EXPOSE 5173

CMD ["pnpm", "run", "dev-gen"]

