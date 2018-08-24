export class Marker {
    constructor(
        public lat: number,
	    public lng: number,
        public label?: string,
        public icon?: string,
        public rilevante?: boolean,
	    public draggable: boolean = true
    ) {
    }
}
