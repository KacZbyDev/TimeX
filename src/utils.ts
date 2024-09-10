const decimals = 1

function milisecondsToSecondsFormat(miliseconds:number):string{
    return (miliseconds / 1000).toFixed(decimals)
}
export default milisecondsToSecondsFormat