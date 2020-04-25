const express = require('express');
const { registerFont, createCanvas } = require("canvas");
const Jimp = require('jimp');
const request = require('superagent');
const moment = require('moment-timezone');
const config = require('./config.json');

const app = express();

app.get('/', async (req, res) => {
    res.set('Content-Type', 'image/bmp');

    res.send(await generateTemperatureBitmap(req.query.invert));
});

app.listen(3000, () => console.log(`Listening on port 3000!`));

async function generateTemperatureBitmap(invert) {
    const outdoor = await request.get(config.outdoorRestUrl);
    const indoor = await request.get(config.indoorRestUrl);
    const time = moment().tz(config.timezone || 'Etc/UTC').format('HH:mm');

    // This is the dimensions of the 2" PaPiRus display
    const WIDTH = 200;
    const HEIGHT = 96;

    const font = 'FreeSans';

    const extraSmallFont = `bold 14px "${font}"`;
    const smallFont = `bold 16px "${font}"`;
    const mediumFont = `40px "${font}"`;
    const largeFont = `48px "${font}"`;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.antialias = 'none';
    ctx.fillStyle = invert ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = invert ? '#ffffff' : '#000000';

    ctx.font = largeFont;
    ctx.fillText(outdoor.body.temperature + '˚', 0, 46);
    ctx.fillText(indoor.body.temperature + '˚', 0, 94);

    ctx.font = extraSmallFont;
    ctx.fillText('outdoor', 0, 10);
    ctx.fillText('indoor', 0, 58);

    ctx.font = mediumFont;
    ctx.textAlign = 'right';
    ctx.fillText(outdoor.body.humidity + '%', 200, 46);
    ctx.fillText(indoor.body.humidity + '%', 200, 94);

    ctx.font = smallFont;
    ctx.fillText(time, 200, 12);

    const bitmap = await Jimp.read(canvas.toBuffer('image/png'));
    return await bitmap.getBufferAsync('image/bmp');
}