var Showing = require('./common/Showing');

class CinemaCity {
    constructor() {
        this.baseURL  = 'https://www.cinemacity.hu/hu/data-api-service/v1/quickbook/10102/';
        this.showings = [];
    }

    async pull(date) {
        var url = this.baseURL + 'cinemas/with-event/until/' + date.toISOString().slice(0, 10);
        var response = await fetch(url);
        var data = await response.json();
        var cinemas = {};
        Object.values(data['body']['cinemas']).forEach(
            function(cinema) {
                if (cinema['groupId'] === 'budapest') {
                    cinemas[cinema['id']] = {};
                    cinemas[cinema['id']] = cinema;
                    cinemas[cinema['id']]['displayName'] = 'CC ' + cinema['displayName'].replace(' - Budapest','');
                }
            }, {});

        const promises = Object.keys(cinemas).map(cinemaId =>
            fetch(this.baseURL
                + 'film-events/in-cinema/' + cinemaId
                + '/at-date/' + date.toISOString().slice(0, 10))
            .then(response => response.json())
        );
        const responses = await Promise.all(promises);
        for (const response of responses) {
            const films  = response['body']['films'];
            const events = response['body']['events'];
            for (const event of events) {
                const film = films.filter(film => film.id === event['filmId'])[0];
                let [h,m,s] = event['eventDateTime'].split('T')[1].split(':')
                let dateAndTime = new Date(date);
                dateAndTime.setHours(+h, +m, +s);
                this.showings.push(
                    new Showing(
                        film['name'].trim().replace('…','...'),       // title
                        dateAndTime,                                  // startTime
                        event['bookingLink'],                         // bookingLink
                        cinemas[event['cinemaId']]['displayName'],    // cinema
                        event['auditorium'],                          // auditorium
                        event['attributeIds'].includes('subbed'),     // isSubbed
                        event['attributeIds'].includes('original-lang-hu') ||
                        event['attributeIds'].includes('dubbed'),     // isDubbed
                        event['attributeIds'].includes('3d'),         // is3d
                        event['attributeIds'].includes('vip'),        // isVIP
                        event['attributeIds'].includes('dolby-atmos') // isDolbyAtmos
                    )
                );
            }
        }
        return this.showings;
    }
}

module.exports = CinemaCity;