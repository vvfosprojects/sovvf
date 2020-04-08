export function setArrow(num: number): string {
    if (num > 0)  {
        return 'fa-arrow-up';
    } else if (num < 0) {
        return 'fa-arrow-down';
    }
}

export function setBlinking(num: number): string {
    return num !== 0 ? 'blink-aggregate' : '';
}
