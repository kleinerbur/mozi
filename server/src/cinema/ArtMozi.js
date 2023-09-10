const Cinema  = require('./common/Cinema');
const Showing = require('./common/Showing');

class ArtMozi extends Cinema {
    constructor(requestID) {
        super(requestID);
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
        super.debug({
            msg: 'Fetching data...'
        });
        let weeks = await fetch(this.baseURL)
                    .then(response => response.json())
                    .catch(err => super.error({
                        msg:   'Failed to fetch list of weeks',
                        error: err
                    }));

        if (weeks) {
            const week = weeks['weeks'][0];
            const inputDate = date.toISOString().split('T')[0].split('-').join('');

            let data = await fetch(`${this.baseURL}/${week}`)
                                .then(response => response.json())
                                .catch(err => super.error({
                                    msg:   'Failed to fetch data',
                                    error: err
                                }));

            if (data && data['schedule'][inputDate]) {
                for (const [filmId, schedule] of Object.entries(data['schedule'][inputDate])) {
                    for (const [startTime, showingId] of Object.entries(schedule)) {
                        let dateAndTime = new Date(date);
                        let [h,m] = startTime.split(':');
                        dateAndTime.setHours(+h, +m, 0);
                        const showing = Object.values(showingId)[0];
                        this.showings.push(new Showing(
                            data['movies'][filmId]['title'].trim().replace('…','...'), // title
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
            }
        }
        return this.showings;
    }
}

module.exports = ArtMozi;