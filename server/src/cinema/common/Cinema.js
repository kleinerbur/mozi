const logger = require("../../logger");

class Cinema {
    constructor(requestID) {
        if (this.constructor == Cinema) {
            logger.fatal("Cannot instantiate abstract class 'Cinema'.");
        }
        this.requestID = requestID;
    }

    trace(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.trace(log);
    }
    debug(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.debug(log);
    }
    info(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.info(log);
    }
    warn(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.warn(log);
    }
    error(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.error(log);
    }
    fatal(log) {
        log.class     = this.constructor.name;
        log.requestID = this.requestID;
        logger.fatal(log);
    }
}

module.exports = Cinema;