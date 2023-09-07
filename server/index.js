import express from 'express';
import cors from 'cors';
import pino from 'pino';
import Assistant from './Assistant.js';

const today = new Date().toISOString().split('T')[0]
const logger = pino(
    {
        level: 'debug',
        timestamp: pino.stdTimeFunctions.isoTime
    },
    pino.transport({
        targets: [
            {
                level: 'debug',
                target: 'pino-pretty',
                options: {
                    colorize: true,
                    singleLine: true
                }
            },
            {
                level: 'debug',
                target: 'pino/file',
                options: {
                    destination: `${today}.log`,
                },
            }
        ]
    })
);

const app = express();
app.use(cors());
const port = 2525; // Bus # in Speed

app.get('/', (req,res) => {
    logger.info({
        msg: 'Got pinged!',
        headers: req.headers
    })
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
process.on('SIGINT', () => {
    logger.debug('Shutting down...')
    process.exit()
})