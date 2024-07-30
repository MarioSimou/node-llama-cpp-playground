FROM node:iron-bookworm AS builder

WORKDIR /app

COPY . .

RUN npm i --omit=dev \
    && npm run build

FROM node:iron-bookworm

WORKDIR /app

ENV PORT=8080
ENV HOST="0.0.0.0"

COPY ./package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist/server.js /app/server.js

RUN npm run download:llama-cpp \
    && curl -L https://huggingface.co/msimou/Qwen2-0.5B-Instruct-GGUF/resolve/main/Qwen2-0.5B-Instruct-Q8_0.gguf -o /app/Qwen2-0.5B-Instruct-Q8_0.gguf

EXPOSE 8080
CMD ["node", "./server.js"]