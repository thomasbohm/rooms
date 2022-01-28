#!/bin/bash

# xset s noblank
# xset s off
# xset -dpms

chromium-browser --kiosk --noerrdialogs --incognito --disable-infobars --disable-component-update "http://localhost:3000/" &
# unclutter &