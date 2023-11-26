#!/bin/sh

npx kill-port 3000

cd server
npm start

$SHELL
