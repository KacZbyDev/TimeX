import { Menus } from './menus.js'
import { Timer } from './timer.js'

export enum TimerState {
    Active,
    Paused,
    Stopped,
    Finished,
    Edit
};

export class Utils {
    private static readonly DECIMALS: number = 1 //how many decimals are displayed by the big timer
    public static readonly REFRESH_DELAY: number = 10 //how many miliseconds it takes for the time to update

    //takes a string of format: 12:34:56 and transform it into seconds
    static timeToSeconds(time: string): number {
        if (time.length > 2)
            return this.timeToSeconds(time.substring(time.length - 2, time.length)) +
                this.timeToSeconds(time.substring(0, time.length - 3)) * 60

        return parseInt(time) * 1000
    }

    //converts miliseconds into 12:34:56.7 format
    static milisecondsToTime(miliseconds: number): string {
        let seconds: number = (miliseconds / 1000)
        let minutes: number = Math.floor(seconds / 60)
        let hours: number = Math.floor(minutes / 60)
        seconds %= 60
        seconds = parseFloat(seconds.toFixed(Utils.DECIMALS))
        minutes %= 60
        
        let res: string = ''
        if (hours > 0) {
            res += hours + ':'
            if (minutes < 10)
                res += '0'
        }
        if (minutes + hours > 0) {
            res += minutes + ':'
            if (seconds < 10)
                res += '0'
        }
        
        return res + seconds.toFixed(Utils.DECIMALS)
    }

    static switchElements(element1:HTMLElement, element2:HTMLElement): void {
        let placeholder: HTMLElement = document.createElement('div');
                
        element1.replaceWith(placeholder); 
        element2.replaceWith(element1); 
        placeholder.replaceWith(element2); 
    }

    static toggleStop(): void {
        if(Timer.currentState >= TimerState.Finished || Menus.isMenuVisible)
            return

        if(Timer.currentState == TimerState.Active) {
            document.getElementById('pause-button')!.textContent = '►'
            Timer.pauseTimer()
            Timer.currentState = TimerState.Stopped
            return
        }

        document.getElementById('pause-button')!.textContent = '| |'
        Timer.currentState = TimerState.Paused
        Timer.resumeTimer()
    }

    private static lastState:TimerState
    static toggleEditMode(): void {
        if(Timer.currentState < TimerState.Edit) {
            Timer.pauseTimer()
            
            Utils.lastState = Timer.currentState
            Timer.currentState = TimerState.Edit

            document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
                element.classList.remove('hidden') 
            });
            $('#blurred-backround').removeClass('hidden');
            $('#list-of-elements').addClass('z-50')
            return
        }

        document.querySelectorAll('[class^="edit-button"]').forEach((element) => {
            element.classList.add('hidden')
        });
        $('#blurred-backround').addClass('hidden')
        $('#list-of-elements').removeClass('z-50')
 
        Timer.currentState = Utils.lastState
        Timer.resumeTimer()
    }
}
