var ArtMozi = require('./cinema/ArtMozi');
var Corvin = require('./cinema/Corvin');
var CinemaCity = require('./cinema/CinemaCity');

class Assistant {
    constructor() {
        this.films = [];
        this.showings = [];
        this.currentDate = new Date();

        this.artmozi = new ArtMozi();
        this.corvin  = new Corvin();
        this.cinemacity = new CinemaCity();
    }

    async pull(date) {
        this.showings = [].concat(...await Promise.all([
            this.artmozi.pull(date),
            this.corvin.pull(date),
            this.cinemacity.pull(date)
        ])).sort((a,b) => a.title.localeCompare(b.title)
                       || new Date(a.startTime) - new Date(b.startTime)
                       || a.cinema.localeCompare(b.cinema));
        this.films =
            [...new Set(
                this.showings
                    .filter(showing => showing !== null)
                    .map(showing => showing.title)
            )].sort((a,b) => a.localeCompare(b));
    }
}

module.exports = Assistant;