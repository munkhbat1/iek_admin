FROM node:16-alpine AS build
WORKDIR /app
COPY ./package.json ./
RUN yarn install
COPY ./ ./
RUN yarn build


FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY ./.env.production.local ./
RUN yarn install --production
EXPOSE 3000
CMD ["yarn", "start"]