FROM node:24-bookworm-slim AS build
WORKDIR /build
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages ./packages
COPY fixtures ./fixtures
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm --filter @plurid/delog-server deploy --prod --legacy /output

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production \
    DELOG_HOST=0.0.0.0 \
    DELOG_PORT=56965 \
    DELOG_DATA_ROOT=/data
WORKDIR /app
COPY --from=build --chown=node:node /output ./
RUN mkdir /data && chown node:node /data
USER node
VOLUME ["/data"]
EXPOSE 56965
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
    CMD node -e "fetch('http://127.0.0.1:56965/ready', {signal: AbortSignal.timeout(3000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "build/cli.mjs", "serve"]
