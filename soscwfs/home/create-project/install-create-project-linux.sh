echo "Appending Termux/Linux compatibility fix to $HOME/.bashrc";

echo '
# <create-project-fix>

# THIS IS A FIX TO INSTALL https://github.com/stringmanolo/create-project on Linux distributions. Design was originally made for Termux.

createProjectAddPath() {
  if [ -d "$1" ] && [[ ":$PATH:" != *":$1:"* ]]; then
    PATH="${PATH:+"$PATH:"}$1";
  fi
}

PREFIX="$HOME/data/data/com.termux/files/usr";

export PREFIX="$PREFIX";

createProjectAddPath "$PREFIX/bin/";


# </create-project-fix>
' >> "$HOME/.bashrc"

echo "Setting up PREFIX path...";
PREFIX="$HOME/data/data/com.termux/files/usr"

echo "Removing older create-project folder...";
yes | rm "./create-project" "$PREFIX/include/create-project-templates" "$PREFIX/bin/create-project" -r 2>&1 > /dev/null;

echo "Downloading create-project files...";
git clone https://github.com/StringManolo/create-project

echo "Giving execution permissions to create-project command...";
chmod +775 create-project/export/create-project;

echo "Creating bin folder to run command without root...";
mkdir -p "$PREFIX/bin";

echo "Moving command to bin folder..."
mv create-project/export/create-project "$PREFIX/bin/";

echo "Creating include folder to hold templates...";
mkdir -p "$PREFIX/include/";

echo "Moving default templates to include folder...";
mv create-project/export/create-project-templates "$PREFIX/include/";

echo "Removing installation files...";
yes | rm create-project -r;

echo "Fix ready to apply. Source the .bashrc file...";
