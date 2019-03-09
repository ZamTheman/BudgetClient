FROM nginx:alpine
LABEL author='Samuel Wahlberg'
COPY ./config/nginx.conf /etc/nginx/conf.d/default.conf