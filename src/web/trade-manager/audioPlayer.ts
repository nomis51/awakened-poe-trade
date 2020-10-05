export const play = function (file: any): Promise<void> {
    const sound = new Audio(file)
    limitTo3Sec(sound);
    return sound.play()
}

export const playFromFile = function (filePath: string): Promise<void> {
    const sound = new Audio(`user-file://${filePath}`)
    limitTo3Sec(sound);
    return sound.play()
}

function limitTo3Sec(sound: HTMLAudioElement) {
    const i = setInterval(function () {
        if (sound.currentTime >= 3) {
            sound.pause()
            clearInterval(i);
        }
    }, 1000);
}
