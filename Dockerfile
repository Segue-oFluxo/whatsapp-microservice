FROM node:alpine
RUN mkdir -p /home/node/app/node_modules
WORKDIR /home/node/app
COPY ./prisma ./prisma 
COPY ./src ./src 
COPY ./package.json ./tsconfig.json ./tsup.config.ts .

COPY ./start.sh ./start.sh 

RUN chmod +x /home/node/app/start.sh
RUN npm i
RUN npm i -g pm2
RUN npm run build

CMD ["/home/node/app/start.sh"]