import { VoceFiltro } from '../../features/home/filterbar/filtri-richieste/voce-filtro.model';

export function setFiltroSelezionato(filtriRichieste: VoceFiltro[], filtro: VoceFiltro): VoceFiltro[] {
    filtriRichieste.forEach((fR: VoceFiltro, index: any) => {
        if (fR.codice === filtro.codice) {
            filtro = toggleFiltro(filtro);
            filtriRichieste[index] = filtro;
        }
    });
    return filtriRichieste;
}

export function toggleFiltro(filtro: VoceFiltro): VoceFiltro {
    filtro.selezionato = !filtro.selezionato;
    return filtro;
}

export function resetFiltriSelezionati(filtriRichieste: VoceFiltro[]): VoceFiltro[] {
    filtriRichieste.forEach((fR: VoceFiltro) => {
        fR.selezionato = false;
    });
    return filtriRichieste;
}

export function _isStatico(filtriStatici: VoceFiltro[], filtro: VoceFiltro): boolean {
    return filtriStatici.indexOf(filtro) !== -1;
}
