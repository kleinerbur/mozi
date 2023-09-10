var ArtMozi = require('./ArtMozi');

class Corvin extends ArtMozi{
    constructor() {
        super();
        this.baseURL  = 'https://corvinmozi.hu/api/schedule/week';
        this.theatres = {
            '1447': 'Corvin'
        };
        this.showings = [];
    }
};

module.exports = Corvin;