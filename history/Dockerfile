# For @imtbl/imx-sdk, lts-alpine to 14-alpine
FROM node:14-alpine
RUN apk add g++ make python3
RUN apk update && apk add git
WORKDIR /app
COPY . .
RUN yarn config set ignore-engines true
RUN yarn install --network-timeout 600000 && yarn run build && rm -fr src
