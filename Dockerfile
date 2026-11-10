# Install dependencies
FROM node:24.21.0-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# Production
FROM node:24.21.0-alpine AS production

LABEL maintainer="Alan Joseph Guzman Gutierrez"
LABEL description="Fragments Node.js microservice"

ENV NODE_ENV=production
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application files
COPY --chown=node:node package*.json ./
COPY --chown=node:node ./src ./src
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

USER 1000

EXPOSE 8080

CMD ["npm", "start"]
