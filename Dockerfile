FROM node:16
COPY server.js /app/
CMD [ "node","/app/server.js" ]