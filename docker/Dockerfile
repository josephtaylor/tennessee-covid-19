FROM node:13.3.0 AS compile-image

RUN npm install -g yarn

RUN yarn global add @angular/cli

WORKDIR /opt/ng
COPY package.json yarn.lock ./
RUN yarn install

COPY src src/
COPY angular.json tsconfig.json tsconfig.app.json tsconfig.spec.json karma.conf.js browserslist ./

RUN ng build --prod --base-href="/covid/"

FROM nginx

COPY docker/nginx /etc/nginx/

COPY --from=compile-image /opt/ng/dist/tennessee-covid-19 /usr/share/nginx/html
