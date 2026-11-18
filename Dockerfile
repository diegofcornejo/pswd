FROM docker.io/node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN HUSKY=0 npm ci
COPY . .
RUN npm run build

FROM docker.io/caddy:latest
COPY ./Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /var/www/html

EXPOSE 8080
