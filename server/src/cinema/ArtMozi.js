var Showing = require('./common/Showing');

class ArtMozi {
    constructor() {
        this.baseURL  = 'https://artmozi.hu/api/schedule/week';
        this.theatres = {
            '1448': 'Puskin',
            '1449': 'Toldi',
            '1450': 'Művész',
            '1451': 'Tabán',
            '1452': 'Kino Café'
        };
        this.showings = [];
    }

    async pull(date) {
        let response = await fetch(this.baseURL);
        let json     = await response.json();
        const week   = json['weeks'][0];
        const inputDate = date.toISOString().split('T')[0].split('-').join('');

        response = await fetch(this.baseURL + '/' + week);
        json     = await response.json();

        if (!json['schedule'][inputDate])
            return [];

        for (const [filmId, schedule] of Object.entries(json['schedule'][inputDate])) {
            for (const [startTime, showingId] of Object.entries(schedule)) {
                let dateAndTime = new Date(date);
                let [h,m] = startTime.split(':');
                dateAndTime.setHours(+h, +m, 0);
                const showing = Object.values(showingId)[0];
                this.showings.push(new Showing(
                    json['movies'][filmId]['title'].trim().replace('…','...'), // title
                    dateAndTime,                                               // startTime
                    showing['link'],                                           // bookingLink
                    this.theatres[showing['cinema']],                          // cinema
                    showing['cinema_room'],                                    // auditorium
                    ['f', 'ovsub', 'oveng', 'hunengsub', 'Hun and Eng sub']
                    .includes(showing['dubSubCode']),                          // isSubbed
                    ['mb', 'sz']
                    .includes(showing['dubSubCode']),                          // isDubbed
                    showing['visualEffect'].includes('3d'),                    // is3d
                    false,                                                     // isVIP
                    false                                                      // isDolbyAtmos
                ));
            }
        }
        return this.showings;
    }
}

module.exports = ArtMozi;