import express from 'express';
import { generateCanvas } from './lib/generate-canvas';

const app = express();

app.get('/', async (req, res) => {
    try {
        const content = await generateCanvas({
            size: req.query.size as string || undefined,
            invert: req.query.invert as string === 'true'
                ? true
                : false,
        });
        res.set('Content-Type', 'image/bmp');

        res.send(content);
    } catch (err) {
        console.error(err);

        res.status(500).send(`Error: ${err.message}`);
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}!`));
