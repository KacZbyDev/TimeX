export class Sounds {
    private static readonly SUBTIMER_FINISH: HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')

    static playSubtimerFinish(): void {
        Sounds.SUBTIMER_FINISH.play()
    }
}