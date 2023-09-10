const ArtMozi    = require('./cinema/ArtMozi');
const Corvin     = require('./cinema/Corvin');
const CinemaCity = require('./cinema/CinemaCity');

class Assistant {
    constructor(requestID) {
        this.films    = [];
        this.showings = [];
        this.cinemas  = [
            new ArtMozi(requestID),
            new Corvin(requestID),
            new CinemaCity(requestID)
        ]
    }

    async pull(date) {
        this.showings = [].concat(...await Promise.all(
            this.cinemas.map(cinema => cinema.pull(date))
        )).sort((a,b) => 
            a.title.localeCompare(b.title)
            || new Date(a.startTime) - new Date(b.startTime)
            || a.cinema.localeCompare(b.cinema)
        );
        this.films = [...new Set(
            this.showings
                .filter(showing => showing !== null)
                .map(showing => showing.title)
        )].sort((a,b) => a.localeCompare(b));
    }
}

module.exports = Assistant;