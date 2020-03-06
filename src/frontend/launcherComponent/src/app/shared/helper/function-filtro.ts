import { VoceFiltro } from '../../features/home/filterbar/ricerca-group/filtri-richieste/voce-filtro.model';

export function setFiltroSelezionato(filtriRichieste: VoceFiltro[], filtro: VoceFiltro) {
    filtriRichieste.forEach((fR: VoceFiltro, index: any) => {
        if (fR.codice === filtro.codice) {
            filtro = toggleFiltro(filtro);
            filtriRichieste[index] = filtro;
        }
    });

    return filtriRichieste;
}

export function toggleFiltro(filtro: VoceFiltro) {
    filtro.selezionato = !filtro.selezionato;

    return filtro;
}

export function resetFiltriSelezionati(filtriRichieste: VoceFiltro[]) {
    filtriRichieste.forEach((fR: VoceFiltro) => {
        fR.selezionato = false;
    });
    return filtriRichieste;
}

export function _isStatico(filtriStatici: VoceFiltro[], filtro: VoceFiltro) {
    return filtriStatici.indexOf(filtro) !== -1;
}
