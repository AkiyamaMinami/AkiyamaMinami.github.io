#!/usr/bin/env sh
# run 'sh deploy.sh'

# 确保脚本抛出遇到的错误
set -e

# 更新master文件
git init
git add -A
git commit -m 'update master'
git push origin master

# 生成静态文件
pnpm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:AkiyamaMinami/akiyamaminami.github.io.git master:gh-pages

cd -