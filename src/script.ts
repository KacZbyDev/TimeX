const refreshTime:number = 100;
const decimals = 1

let refreshInterval:number

let miliseconds:number = 1000;

let ul:any

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

function milisecondsToSecondsFormat(miliseconds:number):string{
    return (miliseconds / 1000).toFixed(decimals)
}