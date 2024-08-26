import milisecondsToSecondsFormat from "./utils";

const refreshTime:number = 100;

let refreshInterval:number

let miliseconds:number = 1000;

let ul:HTMLElement | null

window.addEventListener('load', () => {
    ul = document.getElementById('list-content');
    if(ul) {
        ul!.textContent = milisecondsToSecondsFormat(miliseconds)
        refreshInterval = setInterval(updateTime, refreshTime)
    }
});

function updateTime(): void {
    miliseconds -= refreshTime;  
    if(miliseconds > 0)
        ul!.textContent = milisecondsToSecondsFormat(miliseconds)
    else
        refreshIntervalFinished()
}

function refreshIntervalFinished() :void{
    ul!.textContent = "finished"
    clearInterval(refreshInterval)
}
