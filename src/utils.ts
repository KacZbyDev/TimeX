import { Timer } from './timer.js'

export class Utils {

    private static readonly DECIMALS:number = 1
    public static readonly REFRESH_DELAY: number = 10 //how many miliseconds it takes for the time to update

    private static readonly SUBTIMER_FINISH:HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')

    static playSubtimerFinish():void{
        this.SUBTIMER_FINISH.play()
    }

    static resize(e: MouseEvent) {
        const maxSize = window.innerWidth - document.getElementById('timer')!.getBoundingClientRect().width - 10;
        const startingEffectAtX = maxSize - 100;

        if (Timer.isResizing) {
            let newWidth = e.clientX - Timer.listOfSubtimers.getBoundingClientRect().left;

            //If it is in the effect zone it moves slower
            if (newWidth > startingEffectAtX) {
                newWidth = startingEffectAtX + (newWidth - startingEffectAtX) / 5;
            }

            //Apply limits
            newWidth = Math.max(newWidth, Timer.listInitialSize);
            newWidth = Math.min(newWidth, maxSize);

            // Apply new width
            Timer.listOfSubtimers.style.width = `${newWidth}px`;
        }
    }

    static stopResize():void {
        Timer.isResizing = false;

        window.removeEventListener('mousemove', this.resize);
        window.removeEventListener('mouseup', this.stopResize);
    }

    //takes a string of format: 12:34:56 and transforms it into seconds
    static timeToSeconds(time:string):number {
        if (time.length > 2)
            return this.timeToSeconds(time.substring(time.length - 2, time.length)) +
                this.timeToSeconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    //converts miliseconds into 12:34:56.7 format
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
        return res + seconds.toFixed(this.DECIMALS) 
    }

    static addTimer (name:string, duration:string) : void {
        let parentList:HTMLElement = document.getElementById('list-content')!
        let newElement:HTMLElement = document.getElementById('subtimer-example')!.cloneNode(true) as HTMLElement
        
        newElement.querySelector('.name')!.textContent = name
        
        newElement.querySelector('.duration')!.textContent = duration
        
        parentList.appendChild(newElement)
    }
}