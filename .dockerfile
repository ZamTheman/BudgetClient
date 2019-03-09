FROM nginx
LABEL author='Samuel Wahlberg'
COPY ./dist/ /usr/share/nginx/html