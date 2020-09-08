import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MezzoComposizione } from '../../interface/mezzo-composizione-interface';
import { makeCopy } from '../../helper/function';
import { COMPOSIZIONEOPTIONS } from '../../../core/settings/timeout-composizione';
import { OFFSET_SYNC_TIME } from '../../../core/settings/referral-time';
import { RequestRemoveBookMezzoComposizione } from '../../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import { Store } from '@ngxs/store';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza.state';
import { Composizione } from '../../enum/composizione.enum';

@Component({
    selector: 'app-prenotazione-progress-bar',
    templateUrl: './prenotazione-progress-bar.component.html',
    styleUrls: ['./prenotazione-progress-bar.component.css']
})
export class PrenotazioneProgressBarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() mezzoComp: MezzoComposizione;
    @Input() itemPrenotato: boolean;
    @Input() graphic: boolean;
    option = COMPOSIZIONEOPTIONS;
    currentTimeout: number;
    _interval: any;
    scadenza: any;

    constructor(private store: Store) {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['mezzoComp'] && changes['mezzoComp'].currentValue) {
            const istanteScadenzaSelezione = new Date(this.mezzoComp.istanteScadenzaSelezione).getTime();
            if (istanteScadenzaSelezione !== 0) {
                // console.log('scadenza Selezione', istanteScadenzaSelezione); //
                if (this.scadenza && this.scadenza !== istanteScadenzaSelezione) {
                    this.scadenza = makeCopy(istanteScadenzaSelezione);
                    clearInterval(this._interval);
                    this.getProgressBarValue();
                    // da vedere altrimenti si rimuoverebbe la prenotazione e subito dopo si rimetterebbe la prenotazione, invece non deve accadere...
                    // console.log('data di scadenza cambiata');
                }
                if (!this.scadenza && this.itemPrenotato && istanteScadenzaSelezione) {
                    this.scadenza = makeCopy(istanteScadenzaSelezione);
                    this.getProgressBarValue();
                    // console.log('data scadenza inserita');
                }
            } else if (this.scadenza > 0) {
                clearInterval(this._interval);
                // console.log('prenotazione rimossa manualmente');
            } else {
                // console.log('nessuna prenotazione in corso');
            }
        }
    }

    ngOnDestroy(): void {
        clearInterval(this._interval);
    }

    getProgressBarValue() {
        if (this.scadenza) {
            let alert = false;
            this._interval = setInterval(() => {
                const dataScadenza = new Date(this.mezzoComp.istanteScadenzaSelezione).getTime();
                const dataAttuale = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).getTime();
                this.currentTimeout = dataScadenza - dataAttuale;
                this.currentTimeout = this.currentTimeout / 1000;

                if (this.currentTimeout < this.option.alertTimeAgo) {
                    if (!alert) {
                        alert = true;
                        // console.log('Prenotazione in scadenza');
                    }
                }

                if (this.currentTimeout <= 0) {
                    const compMode = this.store.selectSnapshot(ComposizionePartenzaState).composizioneMode;
                    if (this.graphic || compMode === Composizione.Veloce) {
                        this.store.dispatch(new RequestRemoveBookMezzoComposizione(this.mezzoComp));
                    }
                    this.scadenza = null;
                    clearInterval(this._interval);
                    // console.log('Mezzo non più prenotato');
                }
            }, 500);
        }
    }
}
