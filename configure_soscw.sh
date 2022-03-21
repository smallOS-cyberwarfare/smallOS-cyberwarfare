#!/usr/bin/env bash

# This script should only be runned once.

fileSystemPath='./soscwfs';

echo '
echo -e "nameserver 1.1.1.1\nnameserver 1.0.0.1" > /etc/resolv.conf
rm /etc/profile.d/setup.sh


' > ./"$fileSystemPath"/etc/profile.d/setup.sh


echo '

# ENV

for i in `env | sed '"'"'s/=.*//'"'"'` ; do
    unset $i
done

export HOME="/home"
export SHELL=/bin/sh
export PATH="";
export USER=root
export PAGER=less
export CHARSET=UTF-8
export LANG=C.UTF-8
export TERM=xterm-256color
export EDITOR=vi
export LC_COLLATE=C
export _=/usr/bin/env

addPath() {
  if [ -d "$1" ] && [[ ":$PATH:" != *":$1:"* ]]; then
    PATH="${PATH:+"$PATH:"}$1";
  fi
}

addPath /home/.local/bin
addPath "/usr/local/sbin"
addPath "/usr/local/bin"
addPath "/usr/sbin"
addPath "/usr/bin"
addPath "/sbin"
addPath "/bin"
unset -f addPath

yellow=$'"'"'\e[1;33m'"'"';
green=$'"'"'\e[1;32m'"'"';
reset=$'"'"'\e[0m'"'"';
PS1='"'"'\n\n${yellow}soscw${green} $(pwd)${reset}\n> '"'"';
PS2='"'"'${yellow}.${reset}  '"'"';
# ENV #


# MISC

which bash > /dev/null &&
shopt -s checkwinsize \
shopt -s cdable_vars \
shopt -s autocd \
shopt -s histappend;

export PROMPT_COMMAND='"'"'history -a'"'"';
export HISTSIZE=10000;
export HISTFILESIZE=20000;


alias ls='"'"'ls --color=auto'"'"';
alias dir='"'"'dir --color=auto'"'"';
alias vdir='"'"'vdir --color=auto'"'"';
alias grep='"'"'grep --color=auto'"'"';
alias fgrep='"'"'fgrep --color=auto'"'"';
alias egrep='"'"'egrep --color=auto'"'"';

alias l='"'"'ls'"'"';
alias la='"'"'ls -a'"'"';
alias v='"'"'vim'"'"';
alias c='"'"'clear'"'"';
alias cl='"'"'clear && ls'"'"';
alias ..='"'"'cd ..'"'"';
alias ...='"'"'cd ../..'"'"';
alias ....='"'"'cd ../../..'"'"';
alias .....='"'"'cd ../../../..'"'"';
alias pserv='"'"'python -m http.server'"'"';
alias gitc='"'"'git clone'"'"';
alias 775='"'"'chmod +775'"'"';
alias h='"'"'history'"'"';
alias q='"'"'exit'"'"';

if [ ! -f "/tmp/.small_command_1" ]; then
  clear
  cat /etc/motd
fi
' > ./"$fileSystemPath"/etc/profile.d/persistent.sh


echo -e '\e[1;33m' > ./"$fileSystemPath"/etc/motd;
echo '


                                                     #######  #####
                   ####  #    #   ##   #      #      #     # #     #
                  #      ##  ##  #  #  #      #      #     # #
                   ####  # ## # #    # #      #      #     #  #####
                       # #    # ###### #      #      #     #       #
                  #    # #    # #    # #      #      #     # #     #
                   ####  #    # #    # ###### ###### #######  #####

' >> ./"$fileSystemPath"/etc/motd;

echo -e '\e[1;32m' >> ./"$fileSystemPath"/etc/motd;

echo '
   ####  #   # #####  ###### #####  #    #   ##   #####  ######   ##   #####  ######
  #    #  # #  #    # #      #    # #    #  #  #  #    # #       #  #  #    # #
  #        #   #####  #####  #    # #    # #    # #    # #####  #    # #    # #####
  #        #   #    # #      #####  # ## # ###### #####  #      ###### #####  #
  #    #   #   #    # #      #   #  ##  ## #    # #   #  #      #    # #   #  #
   ####    #   #####  ###### #    # #    # #    # #    # #      #    # #    # ######

' >> ./"$fileSystemPath"/etc/motd
echo -e '\e[0m' >> ./"$fileSystemPath"/etc/motd;

echo "DONE."
