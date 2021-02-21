#!/bin/bash

echo ""
echo -e "\033[32m✔ 롤백을 하려는군요! 침착하세요. 제가 도와드릴께요"
echo -e "\033[0m"
echo ""
read -p "✔ 롤백하려는 버전명이 어떻게 되나요?(vX.X.X) > " rollback_ver  
echo "$rollback_ver 이군요. 확인해보겠습니다."
# 존재하는지 확인

ROLL_BACK=$(git rev-parse --verify $rollback_ver~1)
LIST=$(git tag --list --sort=version:refname 'v*')
echo "$LIST"