#!/bin/bash
CLI_LOCATION="$(pwd)/cli"
echo "Building plugin in $(pwd)"

# Custom Build Routine
echo "Taking out defaults/main.py to /main.py"
mv $(pwd)/main.py $(pwd)/main.py.old
cp $(pwd)/defaults/main.py $(pwd)/main.py
cp -r $(pwd)/websockets/src/websockets $(pwd)/defaults/py_modules/websockets
mv $(pwd)/defaults/main.py $(pwd)/defaults/main.py.bak

# read -s sudopass

# printf "\n"

echo $sudopass | sudo $CLI_LOCATION/decky plugin build $(pwd)

# Custom build routine epilogue
mv $(pwd)/main.py.old $(pwd)/main.py
mv $(pwd)/defaults/main.py.bak $(pwd)/defaults/main.py
rm -rf $(pwd)/defaults/py_modules/websockets
