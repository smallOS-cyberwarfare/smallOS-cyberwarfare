#!/usr/bin/env sh

# Dependencies:
  # openssh
  # tmux 

if [ ! -d ~/.ssh ]; then
  mkdir ~/.ssh
fi

if [ -f /root/.ssh/id_ecdsa ]; then
  rm /root/.ssh/id_ecdsa;
fi

if [ -f /root/.ssh/id_ecdsa.pub ]; then
  rm /root/.ssh/id_ecdsa.pub;
fi

ssh-keygen -t ecdsa -b 256 -f /root/.ssh/id_ecdsa -q -P '' -N ''
echo 'Your public ECDSA key is:';
cat /root/.ssh/id_ecdsa.pub;

echo -e "\n\nOpen in your Browser https://dashboard.ngrok.com/auth/ssh-keys/new and paste the key. \nCreate an account if you need to\n\n* If you create a new account make sure to confirm email before proced futher"

read -p 'Press enter when you done with email confirmation and pasting the public ssh key in ngrok panel...' 

read -p 'Write the port of your server: -> ' PORT;

echo 'Performing reverse ssh connection...'

tmux new-session -d -s "ngrok" ssh -R 0:localhost:${PORT} tunnel.us.ngrok.com tcp ${PORT};

sleep 9s
tmux capture-pane -pt ngrok | head -n 8

echo "Everything Done. You can bind your server to 127.0.0.1:$PORT now.";

echo -e "\nExamples:\npython -m http.server $PORT\nncat -lvk localhost $PORT\nnc -s localhost -p $PORT";
