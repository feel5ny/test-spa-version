#!/bin/bash

MESSAGE=$(git log -1 HEAD --pretty=format:%s)

if [[ "$MESSAGE" == release\:* ]]; then
        echo "확인완료"
else
        echo "마지막 커밋 확인 ($MESSAGE)"
        exit 9
fi