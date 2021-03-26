import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { SoccorsoAereoModalComponent } from '../../../../../shared/modal/soccorso-aereo-modal/soccorso-aereo-modal.component';
import { GetAzioniRichiesta } from '../../../store/actions/composizione-partenza/composizione-soccorso-aereo.actions';
import { SintesiRichiesta } from '../../../../../shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-composizione-confirm-button',
    templateUrl: './composizione-confirm-button.component.html',
    styleUrls: ['./composizione-confirm-button.component.css']
})
export class ComposizioneConfirmButtonComponent implements OnInit {

    @Input() boxPartenzaLenght: number;
    @Input() disableConfirmPartenza = true;
    @Input() richiesta: SintesiRichiesta;

    @Output() confirmPartenzaInViaggio = new EventEmitter();

    dettaglioSoccorsoAereo = false;

    constructor(private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new GetAzioniRichiesta());
    }

    ngOnInit(): void {
        this.checkDettaglioSoccorsoAereo();
    }

    _confirmPartenzaInViaggio(): void {
        this.confirmPartenzaInViaggio.emit();
    }

    checkDettaglioSoccorsoAereo(): void {
        if (this.richiesta && this.richiesta.eventi && this.richiesta.eventi.note) {
            const afmAccettato = this.richiesta.eventi.filter(x => x.note.includes('AFM accettato: Attesa assegnazione SOCAV'));
            const afmAnnullato = this.richiesta.eventi.filter(x => x.note.includes('AFM accettato: Annullato'));
            this.dettaglioSoccorsoAereo = afmAccettato.length > afmAnnullato.length;
        }
    }

    openSoccorsoAereoModal(open: any): void {
        let modalOptions;
        if (open) {
            modalOptions = {
                windowClass: '',
                backdrop: 'static',
                backdropClass: 'light-blue-backdrop',
                centered: true,
                keyboard: false,
                size: 'xl',
            } as NgbModalOptions;
        }
        const modal = this.modalService.open(SoccorsoAereoModalComponent, modalOptions);
        modal.componentInstance.richiesta = this.richiesta;
        modal.result.then((res: any) => {
            switch (res.status) {
                case 'ok':
                    break;
                case 'ko':
                    break;
            }
        });
    }

}
