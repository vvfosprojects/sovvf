export class Marker {
    constructor(
        public lat: number,
	    public lng: number,
	    public label?: string,
	    public draggable: boolean = false
    ) {
    }
}
