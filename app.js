const express = require('express');
const lib = require('./lib/generate-canvas.js');

const app = express();

app.get('/', async (req, res) => {
    res.set('Content-Type', 'image/bmp');

    res.send(await lib.generateCanvas(req.query.size, req.query.invert));
});

app.listen(3000, () => console.log(`Listening on port 3000!`));
