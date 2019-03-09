# Build using: docker build -t just-build -f nginx.prod.dockerfile .

##### Stage 1
FROM node:latest as builder
LABEL author="Samuel Wahlberg"
COPY package.json package-lock.json ./
RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app
WORKDIR /ng-app
COPY . .
RUN npm run ng build -- --prod --output-path=dist

##### Stage 2
FROM nginx:alpine
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /ng-app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]