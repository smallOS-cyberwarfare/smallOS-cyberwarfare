#!/usr/bin/env bash

if [[ -d soscwfs  ]]; then
  rm soscwfs/home/.ash_history 
  rm soscwfs/home/.bash_history
  rm soscwfs/home/.viminfo
  rm soscwfs/home/.config/shodan/api_key
  rm soscwfs/root/.ash_history
  rm soscwfs/root/.bash_history
  rm soscwfs/root/.viminfo
  rm soscwfs/home/.vim/.netrwhist
  rm soscwfs/root/.config/shodan/api_key
  rm soscwfs/root/.ssh/id_ecdsa
  rm soscwfs/root/.ssh/id_ecdsa.pub
  yes | rm soscwfs/tmp/* -r
  # Some files are .gitignored
  # yes | rm soscwfs/home/.local/share/sqlmap/output/* -r
  # yes | rm soscwfs/home/.tor/* -r
  echo 'Your telegram bot api token goes here. Get if from https://t.me/BotFather' > soscwfs/home/nbmxbsf/token.txt;
  echo 'THIS_IS_YOUR_TELEGRAM_BOT_LOGIN_PASSWORD_REPLACE_ALL_THIS_LINE_BY_NEW_ONE' > soscwfs/home/nbmxbsf/password.txt;

  git add --all && git commit -m "$1" && git push
else
  echo "Missing soscwfs folder!";
fi

