import { Subtimer } from './subtimer.js'
import { Utils } from './utils.js'
import { Repeater } from './repeater.js'

window.addEventListener('load', () => {
    Timer.initialize()
});

export class Timer {
    public static currentMiliseconds: number
    public static elapsedTime:number

    public static timerRefresherStopped:boolean = true
    public static timerRefresher: NodeJS.Timeout

    public static bigTimerDisplay: HTMLElement
    public static progress_bar: HTMLElement

    public static list: Element//the list in which the current subtimer is 
    public static currentElement:Element | null

    private static currentSubtimer: Subtimer

    static initialize():void {
        this.bigTimerDisplay = document.getElementById('big-timer-time')!
        this.progress_bar = document.getElementById('progress-bar')!
        this.list = document.getElementById('list-content')!
        
        this.startTimer()
    }
    
    static startTimer():void {
        this.currentElement = this.list.firstElementChild!
        
        this.startNewSubtimer()
        
        //the time before the timer updated
        this.elapsedTime = Date.now()
        
        if(this.timerRefresherStopped) {//if the timerRefresher is not started
            this.timerRefresherStopped = false
            this.timerRefresher = setInterval(() => this.updateTime(), Utils.REFRESH_DELAY)
        }
    }
    
    static updateTime(): void {
        if (this.currentMiliseconds <= 0)
            this.subtimerFinished()

        if(this.timerRefresherStopped)
            return;

        //update bigTimer
        let percent = this.currentMiliseconds / this.currentSubtimer.duration * 100
        this.progress_bar.style.setProperty('--value', percent + '')
        this.bigTimerDisplay.textContent = Utils.milisecondsToTime(this.currentMiliseconds);

        // currentSubtimer.element.className = 'subtimer-active';
        (<HTMLElement> this.currentSubtimer.element).style.setProperty('--value', percent + '')

        //the time elapsed after the last call
        this.currentMiliseconds -= Date.now() - this.elapsedTime
        this.elapsedTime = Date.now()
    }

    static subtimerFinished(): void {
        Utils.playSubtimerFinish()

        //get the next element in the list
        this.currentElement = this.currentElement!.nextElementSibling

        //if it finds the next element
        if (this.currentElement) {
            if (this.currentElement.className.includes('repeater')) {
                this.list = this.currentElement

                Repeater.setListToFirstSubtimerParent(this.list)

                //starts with the second child because the first one is for repeater configuration
                this.currentElement = this.list.children[1]
            }

            //reset subtimer progress
            this.currentSubtimer.element.className = 'subtimer'

            this.startNewSubtimer()

            this.elapsedTime = Date.now()
            return
        }

        if (this.list.className.includes('repeater'))
            this.repeaterReachEnd()
        else {
            this.timerRefresherStopped = true
            clearInterval(this.timerRefresher)

            this.bigTimerDisplay.textContent = 'DONE'
            this.currentSubtimer.element.className = 'subtimer'
            this.progress_bar.style.setProperty('--value', '0')
        }
    }

    static repeaterReachEnd():void {
    //gets the values stored in the repeaters
    let repeaterValues = this.list.querySelector('.repeater-values')!
    let currentRepeats = parseInt(repeaterValues.querySelector('.current-repeats')!.textContent!) + 1
    let totalRepeats = parseInt(repeaterValues.querySelector('.total-repeats')!.textContent!)
    
    repeaterValues.firstElementChild!.textContent = currentRepeats + ''

    //if repeater repeated enough times
    if (currentRepeats >= totalRepeats) {  
        this.currentElement = this.list
        this.list = this.list.parentElement!
    } else {
        this.currentElement = this.list.firstElementChild
        Repeater.resetChildren(this.list)
    }

    this.subtimerFinished()
    }

    static startNewSubtimer():void {
        //create a subtimer object by passing the currentElement
        this.currentSubtimer = new Subtimer(this.currentElement!)

        //the time displayed by bigTimer
        this.currentMiliseconds = this.currentSubtimer.duration

        document.getElementById('current-subtimer-name')!.textContent! = this.currentSubtimer.name
    }
}