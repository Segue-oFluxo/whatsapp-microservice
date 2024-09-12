#!/usr/bin/env sh

npm run migrate:prod
pm2-runtime dist/index.js