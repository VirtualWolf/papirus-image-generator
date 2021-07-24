import request from 'superagent';
import { registerFont, createCanvas, Canvas } from 'canvas';
import Jimp from 'jimp';
const config = require('../../config.json');

registerFont('fonts/pixellium.ttf', {family: 'Pixellium'});

const FONT_FAMILY = 'Pixellium';

interface SensorData {
    temperature: number,
    humidity: number,
}

interface Data {
    outdoor: SensorData,
    indoor: SensorData,
}

export async function generateCanvas({size = '2.7', invert = false}: {size?: string, invert?: boolean}) {
    const outdoor = await request.get(config.outdoor);
    const indoor = await request.get(config.indoor);

    const data = {
        outdoor: outdoor.body,
        indoor: indoor.body,
    }

    return size === '2.7'
        ? await generate2_7InchImage(data, invert)
        : await generate2_0InchImage(data, invert);
}

async function generate2_7InchImage(data: Data, invert: boolean) {
    const WIDTH = 264;
    const HEIGHT = 176;

    const mediumFont = `64px "${FONT_FAMILY}"`;
    const largeFont = `112px "${FONT_FAMILY}"`;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.antialias = 'none';
    ctx.fillStyle = invert ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = invert ? '#ffffff' : '#000000';

    ctx.font = largeFont;
    ctx.fillText(data.outdoor.temperature.toFixed(1) + '˚', 2, 70);
    ctx.fillText(data.indoor.temperature.toFixed(1) + '˚', 2, 164);

    ctx.font = mediumFont;
    ctx.textAlign = 'right';
    ctx.fillText(data.outdoor.humidity.toFixed(0) + '%', 264, 70);
    ctx.fillText(data.indoor.humidity.toFixed(0) + '%', 264, 164);

    return await generateBitmapImage(canvas);
}

async function generate2_0InchImage(data: Data, invert: boolean) {
    const WIDTH = 200;
    const HEIGHT = 96;

    const mediumFont = `48px "${FONT_FAMILY}"`;
    const largeFont = `80px "${FONT_FAMILY}"`;

    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext("2d");

    ctx.antialias = 'none';
    ctx.fillStyle = invert ? '#000000' : '#ffffff';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = invert ? '#ffffff' : '#000000';

    ctx.font = largeFont;
    ctx.fillText(data.outdoor.temperature + '˚', 2, 46);
    ctx.fillText(data.indoor.temperature + '˚', 2, 94);

    ctx.font = mediumFont;
    ctx.textAlign = 'right';
    ctx.fillText(data.outdoor.humidity + '%', 200, 46);
    ctx.fillText(data.indoor.humidity + '%', 200, 94);

    return await generateBitmapImage(canvas);
}

async function generateBitmapImage(canvas: Canvas) {
    const bitmap = await Jimp.read(canvas.toBuffer('image/png'));
    return await bitmap.getBufferAsync('image/bmp');
}
