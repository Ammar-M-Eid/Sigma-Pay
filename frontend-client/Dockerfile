FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json tsconfig.json ./
COPY public ./public
COPY src ./src
ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
