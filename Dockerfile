ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /app

# Copy the entire thing
COPY . .

# Install dependencies and build the bot
RUN npm i -g pnpm && pnpm install && pnpm build

# Run the bot application
CMD ["pnpm", "start"]
