export const strictMatch = (regex: RegExp, str: string): boolean => {
    return !!str && regex.test(str)
}