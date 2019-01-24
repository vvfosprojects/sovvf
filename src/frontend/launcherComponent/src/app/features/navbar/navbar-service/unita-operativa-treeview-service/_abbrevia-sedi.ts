export class AbbreviaSedi {

    constructor() {
    }

    private maxLength = 21;

    private static splitWord(value: string): string[] {
        return value.split(' ');
    }

    private static lengthString(value: string, count: number): boolean {
        return value.length > count;
    }

    private static getWord(value: string): string {

        const mapDizionarioSedi = new Map([
            ['comando', 'com.'],
            ['distaccamento', 'dist.'],
            ['direzione', 'dir.'],
            ['regionale', 'reg.'],
            ['cittadino', 'citt.']
        ]);

        const truncate = mapDizionarioSedi.get(value.toLowerCase());

        return truncate ? capitalizeFirstLetter(truncate) : value;

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    }

    sedeString(value: string): string {

        const maxLength = this.maxLength;
        const stringLength = value.length;

        function truncateWord(_value) {
            let truncateString = '';
            let currentLength = stringLength;
            AbbreviaSedi.splitWord(_value).forEach((string, index, array) => {
                const wordTruncate = AbbreviaSedi.getWord(string);
                const diffWordLength = string.length - wordTruncate.length;
                currentLength -= diffWordLength;
                if (index === 0 || currentLength >= maxLength) {
                    truncateString += wordTruncate;
                } else {
                    truncateString += string;
                }
                truncateString += (index - (array.length - 1)) ? ' ' : '';
            });
            return truncateString;
        }

        return AbbreviaSedi.lengthString(value, maxLength) ? truncateWord(value) : value;
    }

}
