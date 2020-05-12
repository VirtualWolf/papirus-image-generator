const request = require('superagent');
const moment = require('moment-timezone');
const { createCanvas } = require("canvas");
const Jimp = require('jimp');
const config = require('../config.json');

const FONT_FAMILY = 'FreeSans';

module.exports.generateCanvas = async(size, invert) => {
    const outdoor = await request.get(config.outdoorRestUrl);
    const indoor = await request.get(config.indoorRestUrl);

    const data = {
        outdoor: outdoor.body,
        indoor: indoor.body,
        time: moment().tz(config.timezone || 'Etc/UTC').format('HH:mm'),
    };

    if (size === '2.7') {
        return await generate2_7InchImage(data, invert);
    } else if (size === '2.0') {
        return await generate2_0InchImage(data, invert);
    } else {
        return 'size parameter must be "2.0" or "2.7"';
    }
}

async function generate2_7InchImage(data, invert) {
    const power = await request.get(config.powerUsageRestUrl);

    const WIDTH = 264;
    const HEIGHT = 176;

    const smallFont = `bold 16px "${FONT_FAMILY}"`;
    const mediumSmallFont = `bold 34px "${FONT_FAMILY}"`;
    const mediumFont = `50px "${FONT_FAMILY}"`;
    const largeFont = `70px "${FONT_FAMILY}"`;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.antialias = 'none';
    ctx.fillStyle = invert ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = invert ? '#ffffff' : '#000000';

    ctx.font = largeFont;
    ctx.fillText(data.outdoor.temperature + '˚', 0, 60);
    ctx.fillText(data.indoor.temperature + '˚', 0, 122);

    ctx.font = mediumFont;
    ctx.textAlign = 'right';
    ctx.fillText(data.outdoor.humidity + '%', 264, 60);
    ctx.fillText(data.indoor.humidity + '%', 264, 122);

    ctx.font = smallFont;
    ctx.textAlign = 'left';
    ctx.fillText('consumption', 0, 144);
    ctx.fillText('production', 140, 144);

    ctx.font = mediumSmallFont;
    ctx.fillText((power.body.consumption[0].wNow/1000).toFixed(2) + 'kW', 0, 174);

    ctx.fillText((power.body.production[0].wNow/1000).toFixed(2) + 'kW', 140, 174);

    ctx.font = smallFont;
    ctx.textAlign = 'right';
    ctx.fillText(data.time, 260, 12);

    return await generateBitmapImage(canvas);
}

async function generate2_0InchImage(data, invert) {
    const WIDTH = 200;
    const HEIGHT = 96;

    const extraSmallFont = `bold 14px "${FONT_FAMILY}"`;
    const smallFont = `bold 16px "${FONT_FAMILY}"`;
    const mediumFont = `40px "${FONT_FAMILY}"`;
    const largeFont = `48px "${FONT_FAMILY}"`;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.antialias = 'none';
    ctx.fillStyle = invert ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = invert ? '#ffffff' : '#000000';

    ctx.font = largeFont;
    ctx.fillText(data.outdoor.temperature + '˚', 0, 46);
    ctx.fillText(data.indoor.temperature + '˚', 0, 94);

    ctx.font = extraSmallFont;
    ctx.fillText('outdoor', 0, 10);
    ctx.fillText('indoor', 0, 58);

    ctx.font = mediumFont;
    ctx.textAlign = 'right';
    ctx.fillText(data.outdoor.humidity + '%', 200, 46);
    ctx.fillText(data.indoor.humidity + '%', 200, 94);

    ctx.font = smallFont;
    ctx.fillText(data.time, 200, 12);

    return await generateBitmapImage(canvas);
}

async function generateBitmapImage(canvas) {
    const bitmap = await Jimp.read(canvas.toBuffer('image/png'));
    return await bitmap.getBufferAsync('image/bmp');
}