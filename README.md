# Automatic monitoring of room distributions
A voluntary project for the [Sprachschule Aktiv language school](https://www.sprachschule-aktiv-muenchen.de/) helping students to find the rooms in which their courses take place.

By building this simple web-app using Node.js and Express, automatic fetching and displaying of data without any need for manual interaction can be achieved.
![Screenshot](./screenshot.png)

## Raspberry Pi Setup

### Autostart setup
Place the autostart files in `/home/pi/.config/autostart/` and adjust their paths to the bash scripts.

### Setup Node.js 11.9.0 on armv6l
A Raspberry Pi Zero W will be used. Unfortunately, the processor type is not supported by Node anymore.
However, an old version can be installed:
- `curl -o node-v11.9.0-linux-armv6l.tar.gz https://nodejs.org/dist/v11.9.0/node-v11.9.0-linux-armv6l.tar.gz`
- `tar -xzf node-v11.9.0-linux-armv6l.tar.gz`
- `sudo cp -r node-v11.9.0-linux-armv6l/* /usr/local/`

To check if the installation succeded run `node -v` and `npm -v`.