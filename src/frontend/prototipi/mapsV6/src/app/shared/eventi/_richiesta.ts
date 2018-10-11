export class EventiListaRichieste {

    constructor(private markerC) {
    }

    richiestaClick(richiesta) {
        console.log('richiestaClick');
    }

    richiestaHoverIn(richiesta) {
        console.log('richiestaHoverIn');
    }

    richiestaHoverOut(richiesta) {
        console.log('richiestaHoverOut');
    }

    unClick() {
        console.log('unClick');
    }

    getMarkerR(id) {
        return this.markerC.richiesteMarker.find(x => x.id === id);
    }
}
