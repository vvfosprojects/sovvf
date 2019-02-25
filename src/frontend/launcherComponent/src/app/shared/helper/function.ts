export function makeCopy(value): any {
    return (JSON.parse(JSON.stringify(value)));
}
