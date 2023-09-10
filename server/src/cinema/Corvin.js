const ArtMozi = require('./ArtMozi');

class Corvin extends ArtMozi{
    constructor(requestID) {
        super(requestID);
        this.baseURL  = 'https://corvinmozi.hu/api/schedule/week';
        this.theatres = {
            '1447': 'Corvin'
        };
        this.showings = [];
    }
};

module.exports = Corvin;