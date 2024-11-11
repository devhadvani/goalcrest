#!/bin/sh
# Copy node_modules if not already in /app/node_modules
if [ ! -d "/app/node_modules" ]; then
  cp -r /node_modules /app/node_modules
fi
npm start
