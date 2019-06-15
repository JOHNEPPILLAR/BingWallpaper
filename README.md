# BingWallpaper

Daily Bing wallpaper for mac

# Notes

- In order to save space, the script assumes that _only 1 image_ is kept in the ~/Pictures/bing folder.
- Place all the files into a single folder. Here it is in the Applications folder within the user's home directory - `~/Applications/BingWallpaper`
- Open the plist file with your favorite editor and change the username to your username

# Plist File

- Copy the plist file to `~/Library/LaunchAgents`

```
cp bing.wallpaper.mac.plist ~/Library/LaunchAgents
```

- Edit the plist file to reflect your username
- Save and close
- Run the following terminal command

```
launchctl load ~/Library/LaunchAgents/bing.wallpaper.mac.plist
```

# Uninstall

- To uninstall run this command

```
launchctl unload ~/Library/LaunchAgents/bing.wallpaper.mac.plist
```

- Delete the `~/Applications/BingWallpaper` folder and its contents
- Delete the `~/Pictures/bing` folder and its contents
