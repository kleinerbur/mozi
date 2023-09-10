const pino = require('pino');

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

module.exports = logger;