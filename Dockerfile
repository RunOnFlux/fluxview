FROM node:22-alpine AS build
WORKDIR /usr/app
# lockfile included on purpose: npm ci installs the exact resolved tree
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY ./docker/nginx/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /usr/app/dist /usr/share/nginx/html
ENTRYPOINT ["nginx", "-g", "daemon off;"]
