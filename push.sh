#!/usr/bin/env bash

if [[ -d soscwfs  ]]; then
  rm soscwfs/home/.ash_history 
  rm soscwfs/home/.bash_history
  rm soscwfs/home/.viminfo
  rm soscwfs/home/.config/shodan/api_key
  rm soscwfs/root/.ash_history
  rm soscwfs/root/.bash_history
  rm soscwfs/root/.viminfo
  rm soscwfs/root/.config/shodan/api_key
  yes | rm soscwfs/home/.local/share/sqlmap/output/* -r
  yes | rm soscwfs/home/.tor/* -r

  git add --all && git commit -m "$1" && git push
else
  echo "Missing soscwfs folder!";
fi

