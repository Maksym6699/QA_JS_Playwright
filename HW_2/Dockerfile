FROM cypress/base:24.17.0

WORKDIR /app

ENV ENVIRONMENT=production
ENV CI=1
ENV HTTP_USERNAME=guest
ENV HTTP_PASSWORD=welcome2qauto
ENV CHROME_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install

COPY . .

RUN npx cypress verify
RUN apt-get update && apt-get install -y chromium && ln -sf /usr/bin/chromium /usr/bin/google-chrome && rm -rf /var/lib/apt/lists/*

CMD ["npm", "run", "cypress:run:docker"]