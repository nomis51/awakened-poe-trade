export const strictMatch = (regex: RegExp, str: string): boolean => {
    const result = regex.exec(str);
    return result !== null && result.index === 0;
}