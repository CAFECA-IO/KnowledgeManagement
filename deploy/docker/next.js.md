## In the existing projects

### Create `Dockerfile`

- At the root of the project: create `Dockerfile`
    
    ```
    FROM node:18-alpine AS base
    
    # Install dependencies only when needed
    FROM base AS deps
    # Check <https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine> to understand why libc6-compat might be needed.
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    
    # Install dependencies based on the preferred package manager
    COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
    RUN \\
      if [ -f yarn.lock ]; then yarn --frozen-lockfile; \\
      elif [ -f package-lock.json ]; then npm ci; \\
      elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \\
      else echo "Lockfile not found." && exit 1; \\
      fi
    
    # Rebuild the source code only when needed
    FROM base AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    
    # Next.js collects completely anonymous telemetry data about general usage.
    # Learn more here: <https://nextjs.org/telemetry>
    # Uncomment the following line in case you want to disable telemetry during the build.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN npm run build
    
    # If using npm comment out above and use below instead
    # RUN npm run build
    
    # Production image, copy all the files and run next
    FROM base AS runner
    WORKDIR /app
    
    ENV NODE_ENV production
    # Uncomment the following line in case you want to disable telemetry during runtime.
    # ENV NEXT_TELEMETRY_DISABLED 1
    
    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs
    
    COPY --from=builder /app/public ./public
    
    # Set the correct permission for prerender cache
    RUN mkdir .next
    RUN chown nextjs:nodejs .next
    
    # Automatically leverage output traces to reduce image size
    # <https://nextjs.org/docs/advanced-features/output-file-tracing>
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
    
    USER nextjs
    
    EXPOSE 3000
    
    ENV PORT 3000
    # set hostname tolocalhost
    ENV HOSTNAME "0.0.0.0"
    
    # server.js is created by next build from the standalone output
    # <https://nextjs.org/docs/pages/api-reference/next-config-js/output>
    CMD ["node", "server.js"]
    
    ```
    
- add something to `next.config.js`
    
    ```
    module.exports = {
      // ... rest of the configuration.
      output: "standalone",
    };
    
    ```
- create `.dockerignore`
    
    ```
    Dockerfile
    
    .dockerignore
    
    node_modules
    
    npm-debug.log
    
    README.md
    
    .next
    
    .git
    ```

### Modify config to connect to a local backend server running on Docker    

- `.env`
    - `API_URL=<YOUR_IP_ADDRESS>:3001`
    - You can get your IP by typing `ipconfig getifaddr en0` in the terminal
 


### **Build the Docker Image**

- Install Docker on your machine ([official](https://docs.docker.com/get-docker/))
- At the root of the project:
    - `docker build -t <your-image-name> .`


### **Run the Docker**

- `docker run --rm -p 3000:3000 --name <container-name> <image-name>`


# Reference

- [Containerizing Next.js App with Docker: Quick Guide](https://dev.to/pulkit30/containerizing-nextjs-app-with-docker-quick-guide-51ml)
- [next.js with docker](https://github.com/vercel/next.js/tree/canary/examples/with-docker)
- [screenshot of process](https://github.com/CAFECA-IO/KnowledgeManagement/issues/93)

