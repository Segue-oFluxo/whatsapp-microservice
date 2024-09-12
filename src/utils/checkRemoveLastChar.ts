export function checkRemoveLastChar(str: string, needle: string): string {
    if(str[str.length - 1] == needle) {
        return str.slice(0, -1);
    }
    return str;
}