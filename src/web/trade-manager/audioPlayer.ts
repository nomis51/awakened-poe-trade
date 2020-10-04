export const play = function (file: any): Promise<void> {
    const sound = new Audio(file);
    return sound.play();
}

export const playFromFile = function (filePath: string): Promise<void> {
    const sound = new Audio(`file:///${filePath}`);
    return sound.play();
}