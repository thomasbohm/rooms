#!/bin/sh

# Disable screensaver
xset -dpms
xset s off
xset s noblank

# Hide the cursor
unclutter &

# Show a browser tab
matchbox-window-manager &
midori -e Fullscreen -a http://localhost:3000
