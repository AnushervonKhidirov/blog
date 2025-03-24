FROM oven/bun:1.2.5-alpine
COPY ./ /user/app/src
WORKDIR /user/app/src
RUN bun install