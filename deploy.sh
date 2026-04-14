#!/bin/bash
set -e

git reset --hard
git checkout master
git pull origin master

npm i -g yarn
yarn global add serve
yarn
yarn build

if pm2 describe CAMERA_SHOP >/dev/null 2>&1; then
  pm2 restart CAMERA_SHOP
else
  pm2 start "serve -s build -l 3010" --name CAMERA_SHOP
fi

pm2 save