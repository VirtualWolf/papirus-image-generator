# papirus-image-generator

This is a somewhat over-engineered setup to return a bitmap image for use with a [PaPiRus e-link display](https://github.com/PiSupply/PaPiRus) attached to a Raspberry Pi. It fetches two sets of temperature and humidity readings from URLs given in `config.json`, generates a PNG buffer with [node-canvas](https://github.com/Automattic/node-canvas), then generates a BMP from there with [jimp](https://github.com/oliver-moran/jimp).

The query parameter `size` is required and can be either `2.0` or `2.7`, for the 2.0" or 2.7" display. In `config.json`, `powerUsageRestUrl` is the address of an [Enlighten Envoy](https://enphase.com/en-us/products-and-services/envoy-and-combiner) device on your local network.

The file `display.py` is run with `URL=<URL of running papirus-image-generator>?size=<size> ./display.py` on the Pi that has the PaPiRus display attached.