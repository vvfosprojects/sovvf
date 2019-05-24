import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { SquadraComposizione } from '../../interface/squadra-composizione-interface';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

// Service

@Component({
    selector: 'app-squadra-composizione',
    templateUrl: './squadra-composizione.component.html',
    styleUrls: ['./squadra-composizione.component.css']
})
export class SquadraComposizioneComponent implements OnInit {
    @Input() squadraComp: SquadraComposizione;
    @Input() richiesta: SintesiRichiesta;
    @Output() selezionata = new EventEmitter<SquadraComposizione>();
    @Output() deselezionata = new EventEmitter<SquadraComposizione>();

    constructor() {
    }

    ngOnInit() {
    }

    onHoverIn() {
        this.squadraComp.hover = true;
    }

    onHoverOut() {
        this.squadraComp.hover = false;
    }

    onClick() {
        if (!this.squadraComp.selezionato) {
            this.squadraComp.selezionato = true;
            this.selezionata.emit(this.squadraComp);
        } else {
            this.squadraComp.selezionato = false;
            this.deselezionata.emit(this.squadraComp);
        }
    }

    liClass() {
        let returnClass = '';

        const hover = this.squadraComp.hover ? 'hover-si' : 'hover-no';
        const selezionato = this.squadraComp.selezionato ? 'selezionato-si' : 'selezionato-no';

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

            if (this.richiesta.competenze) {
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
