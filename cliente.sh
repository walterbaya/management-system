#!/bin/sh

npx kill-port 3001

cd client 
cd palma-store 
npm start

$SHELL