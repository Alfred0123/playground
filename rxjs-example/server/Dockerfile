#---- base ----

FROM node:16-slim AS base
WORKDIR /app
# procps / nest dev server hot reload 관련 error
RUN apt-get update -y && apt-get install -y python3 build-essential procps

#---- build ----

FROM base as build
COPY . ./

# ARG TARGET_ENV
RUN npm install
RUN npm run build
# RUN pnpm install --production
# RUN npm run build:$TARGET_ENV

#---- Release ----
FROM base AS release

ARG TARGET_ENV
ENV ENV=$TARGET_ENV

COPY --chown=node:node --from=build /app/dist/ ./dist
COPY --chown=node:node --from=build /app/package.json ./package.json

RUN npm install --production

USER node

EXPOSE 3000
CMD ["node", "dist/src/main.js"]

