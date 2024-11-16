export class Sounds {
    private static readonly SUBTIMER_FINISH: HTMLAudioElement = new Audio('../res/timer-ending-sound.mp3')

    //TODO audio sometimes takes too much to actually play
    static playSubtimerFinish(): void {
        Sounds.SUBTIMER_FINISH.play()
    }
}