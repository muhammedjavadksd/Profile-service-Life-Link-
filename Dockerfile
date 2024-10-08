FROM node:22.4.1-alpine
WORKDIR ./app/Profile
COPY .package*.json ./
COPY . .
RUN npm install
RUN npx tsc
RUN npm update
CMD ["npm","start"]