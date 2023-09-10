import http  from 'http';
import https from 'https';

import fs      from 'fs';
import express from 'express';
import cors    from 'cors';
import pino    from 'pino';

import Assistant from './Assistant.js';

// Server config
var protocol;
var port;
var server_config;
if (process.argv[2] && process.argv[2] === '--insecure') {
    protocol = http;
    port = 2525;
    server_config = {}
} else {
    protocol = https;
    port = 443;
    server_config = {
        key:  fs.readFileSync('ssl/private.key', 'utf8'),
        cert: fs.readFileSync('ssl/certificate.crt', 'utf8')
    }
}

// Logger config
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
                    destination: `logs/${today}.log`,
                },
            }
        ]
    })
);

// Server initialization
const app = express();
app.use(cors());
const server = protocol.createServer(server_config, app);
server.listen(port, logger.info(`Server is listening on port ${port}`));

// Server routes
app.get('/', (req,res) => {
    logger.debug({
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

// Event handlers
server.once('error', (err) => {
    logger.fatal(err)
});

process.on('SIGINT', () => {
    logger.warn('[INTERRUPTED]');
    process.exit();
})

process.on('SIGTERM', () => {
    logger.warn('[TERMINATED]');
    process.exit();
})

process.on('exit', () => {
    logger.info('Shutting down...');
})
