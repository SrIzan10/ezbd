FROM oven/bun:1-alpine

WORKDIR /app

COPY . .

RUN bun install

RUN bun run docker:build

CMD ["bun", "start"]