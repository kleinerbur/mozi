class Showing {
    constructor(title, startTime,  bookingLink, cinema, auditorium, isSubbed, isDubbed, is3d, isVIP, isDolbyAtmos) {
        this.title        = title;
        this.startTime    = startTime;
        this.bookingLink  = bookingLink;
        this.cinema       = cinema;
        this.auditorium   = auditorium;
        this.isSubbed     = isSubbed;
        this.isDubbed     = isDubbed;
        this.is3d         = is3d;
        this.isVIP        = isVIP;
        this.isDolbyAtmos = isDolbyAtmos;
    }

    inspect = function(depth, opts) {
        return JSON.stringify(this);
    };
}

export default Showing;