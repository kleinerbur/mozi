import express from 'express';
import cors from 'cors';
import pino from 'pino';
import Assistant from './Assistant.js';

const logger = pino({
    level: 'debug',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            singleLine: true
        }
    }
});

const app = express();
app.use(cors());
const port = 2525; // Bus # in Speed

app.get('/', (req,res) => {
    res.send('Hi');
})

app.get('/date/:date/', async(req,res) => {
    const assistant = new Assistant();
    logger.info({
        msg: "New request", 
        params: req.params
    });
    if (/\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
        const date = new Date(Date.parse(req.params.date));
        logger.debug({
            msg: `Parsed date: ${date.toISOString().split('T')[0]}`,
            params: req.params
        });
        await assistant.pull(date);
        res.send({
            films: assistant.films,
            showings: assistant.showings
        });
        res.status(200);
        logger.info({
            msg: `Response sent successfully`,
            n_films: assistant.films.length,
            n_showings: assistant.showings.length
        });
    } else {
        logger.error({
            msg: "Invalid request",
            params: req.params
        });
        res.status(400);
        res.send({
            films: [],
            showings: [],
            error: `Invalid date format: '${req.params.date}' (the only supported format is 'yyyy-mm-dd')`
        });
    }
})

app.listen(port, logger.debug(`Server is listening on port ${port}`));
