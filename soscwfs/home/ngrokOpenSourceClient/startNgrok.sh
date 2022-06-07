#!/usr/bin/env sh

# Dependencies:
  # openssh
  # tmux

read -p 'Write the port of your server: -> ' PORT;

echo 'Performing reverse ssh connection...'

tmux new-session -d -s "ngrok" ssh -R 0:localhost:${PORT} tunnel.us.ngrok.com tcp ${PORT};

sleep 9s
tmux capture-pane -pt ngrok | head -n 8;

echo -e "\nEverything Done. You can bind your server to 127.0.0.1:$PORT now.";
