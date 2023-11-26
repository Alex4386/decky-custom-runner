#!/bin/bash
CLI_LOCATION="$(pwd)/cli"
TARGET_PATH="/home/deck/Custom Launcher.zip"

echo "Local Build and Deployer for DeckyLoader"
echo "Written by Alex4386"

# main build routine.
sudo $CLI_LOCATION/decky plugin build $(pwd)
echo "Build Complete!"
sudo chown -R $USER $(pwd)/out

# Remove existing config
sudo rm -rf ~/homebrew/settings/Custom\ Launcher/config.json
sudo rm -rf ~/homebrew/plugins/Custom\ Launcher
sudo rm -rf ~/homebrew/plugins/Custom\ Launcher
sudo cp $(pwd)/out/Decky\ Terminal.zip ~/homebrew/plugins/
sudo systemctl restart plugin_loader.service
