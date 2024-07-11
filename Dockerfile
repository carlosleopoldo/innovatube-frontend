FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli
RUN npm install
COPY . .
RUN npm run build --prod
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "dist"]
