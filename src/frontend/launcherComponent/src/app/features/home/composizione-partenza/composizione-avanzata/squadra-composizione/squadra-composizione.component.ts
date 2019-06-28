import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-squadra-composizione',
    templateUrl: './squadra-composizione.component.html',
    styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
    @Input() squadraComp: SquadraComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Input() itemSelezionato: boolean;
    @Input() itemHover: boolean;
    @Input() itemPrenotato: boolean;
    @Input() itemBloccato: boolean;

    @Output() selezionata = new EventEmitter<SquadraComposizione>();
    @Output() deselezionata = new EventEmitter<SquadraComposizione>();
    @Output() hoverIn = new EventEmitter<SquadraComposizione>();
    @Output() hoverOut = new EventEmitter<SquadraComposizione>();
    @Output() sbloccata = new EventEmitter<SquadraComposizione>();

    constructor() {
    }

    ngOnInit() {
    }

    onClick() {
        if (!this.itemSelezionato) {
            this.selezionata.emit(this.squadraComp);
        } else {
            this.deselezionata.emit(this.squadraComp);
        }
    }

    onHoverIn() {
        this.hoverIn.emit(this.squadraComp);
    }

    onHoverOut() {
        this.hoverOut.emit(this.squadraComp);
    }

    liClass() {
        let returnClass = '';

        const hover = this.itemHover ? 'hover-si' : 'hover-no';
        const selezionato = this.itemSelezionato ? 'selezionato-si' : 'selezionato-no';

        switch (hover + '|' + selezionato) {
            case 'hover-si|selezionato-no':
                returnClass += 'border-warning';
                break;
            case 'hover-no|selezionato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
            case 'hover-si|selezionato-si':
                returnClass += 'border-danger diagonal-stripes bg-lightgrey';
                break;
        }

        return returnClass;
    }

    badgeDistaccamentoClass() {
        let result = 'badge-secondary';

        if (this.richiesta && this.squadraComp) {
            const distaccamentoMezzo = this.squadraComp.squadra.distaccamento.descrizione;

            if (this.richiesta.competenze && this.richiesta.competenze.length > 0) {
                if (this.richiesta.competenze[0].descrizione === distaccamentoMezzo) {
                    result = 'badge-primary';
                } else if (this.richiesta.competenze[1].descrizione === distaccamentoMezzo) {
                    result = 'badge-info';
                }
            }
        }

        return result;
    }
}
