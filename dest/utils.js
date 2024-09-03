export class Utils {
    static timeToMiliseconds(time) {
        if (time.length > 2)
            return this.timeToMiliseconds(time.substring(time.length - 2, time.length)) +
                this.timeToMiliseconds(time.substring(0, time.length - 3)) * 60;
        return parseInt(time) * 1000;
    }
    static milisecondsToTime(miliseconds) {
        let seconds = (miliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        seconds %= 60;
        minutes %= 60;
        let res = '';
        if (hours > 0) {
            res += hours + ':';
            if (minutes < 10)
                res += '0';
        }
        if (minutes > 0 || hours > 0) {
            res += minutes + ':';
            if (seconds < 10)
                res += '0';
        }
        return res + seconds.toFixed(this.decimals);
    }
}
Utils.decimals = 1;
//# sourceMappingURL=utils.js.map