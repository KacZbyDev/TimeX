
const decimals = 1

export default function milisecondsToSecondsFormat(miliseconds:number):string{
    return (miliseconds / 1000).toFixed(decimals)
}