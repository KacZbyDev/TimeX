export class Utils {
    private static readonly decimals:number = 1
    private static readonly subtimerFinish:HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')

    static playSubtimerFinish():void{
        this.subtimerFinish.play()
    }

    //takes a string of format: 12:34:56 and transforms it into miliseconds
    static timeToMiliseconds(time:string):number {
        if (time.length > 2)
            return this.timeToMiliseconds(time.substring(time.length - 2, time.length)) +
                this.timeToMiliseconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    //does the opposite of timeToMiliseconds
    static milisecondsToTime(miliseconds:number):string {
        let seconds:number = (miliseconds / 1000)
        let minutes:number = Math.floor(seconds / 60)
        let hours:number = Math.floor(minutes / 60)
        seconds %= 60
        minutes %= 60

        let res:string = ''
        if(hours > 0) {
            res += hours + ':'
            if(minutes < 10)
                res += '0'
        }
        if(minutes > 0 || hours > 0) {
            res += minutes + ':'
            if(seconds < 10)
                res += '0'
        }
        return res + seconds.toFixed(this.decimals) 
    }

    static timeToCorrectTime(time:string):string {
        return this.milisecondsToTime(this.timeToMiliseconds(time) / 1000)
    }
}