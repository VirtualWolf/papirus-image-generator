# papirus-image-generator

This is a somewhat over-engineered setup to return a bitmap image for use either a 2.0" or 2.7" [PaPiRus e-link display](https://github.com/PiSupply/PaPiRus) attached to a Raspberry Pi. It fetches two sets of temperature and humidity readings from URLs given in `config.json`, generates a PNG buffer with [node-canvas](https://github.com/Automattic/node-canvas), then generates a bitmap from there with [jimp](https://github.com/oliver-moran/jimp).

The file `display.py` is run with `URL=<URL of running papirus-image-generator> ./display.py` on the Pi that has the PaPiRus display attached and will fetch the bitmap file from above and display it. Set up a repeating cron job to run it every minute:

```
*   *   *   *   *   URL=http://pi:3000 /home/pi/papirus-image-generator/display.py
```

## Options
### `config.json`
Contains two endpoints that `papirus-image-generator` expects to return the following format:
```
{
    "temperature": 20.2,
    "humidity": 45.1
}
```

### Query parameters
* `size` — Defaults to `2.7` if not specified, can be given as `2.0` for the smaller-size display.
* `invert` — Defaults to black on white if not specified, can be set to `true` to show white on black.

## Credits
The font [Pixellium](https://www.fontspace.com/pixellium-font-f30306) used in this project is licensed as Creative Commons (by-nd) Attribution No Derivatives.
