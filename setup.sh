#!/bin/bash
clear

echo "Installing latest modules"
rm -rf node_modules
rm package-lock.json
ncu -u
npm install
npm audit fix

echo "Create folders need to run app"
mkdir /Users/jp/Applications/BingWallpaper
mkdir /Users/jp/Pictures/bing

echo "Copy code to run folder"
cp -r * /Users/jp/Applications/BingWallpaper

echo "Copy plist and install"
cp bing.wallpaper.mac.plist ~/Library/LaunchAgents
launchctl load ~/Library/LaunchAgents/bing.wallpaper.mac.plist