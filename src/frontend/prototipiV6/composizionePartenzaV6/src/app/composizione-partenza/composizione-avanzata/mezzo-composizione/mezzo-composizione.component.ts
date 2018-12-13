import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';

// Model
import { MezzoComposizione } from '../../model/mezzo-composizione.model';

// Service
import { CompMezzoSquadraService } from '../../service/comp-mezzo-squadra/comp-mezzo-squadra.service';
import { Squadra } from 'src/app/shared/model/squadra.model';
import { BoxPartenza } from '../../model/box-partenza.model';

@Component({
    selector: 'app-mezzo-composizione',
    templateUrl: './mezzo-composizione.component.html',
    styleUrls: ['./mezzo-composizione.component.css']
})
export class MezzoComposizioneComponent implements OnInit, OnChanges {
    @Input() mezzoComp: MezzoComposizione;
    @Input() squadre: Squadra[];
    @Input() partenze: BoxPartenza[];
    @Input() idPartenzaAttuale: number;
    @Output() nuovoMezzo: EventEmitter<any> = new EventEmitter();
    @Output() mezzoCoordinate: EventEmitter<any> = new EventEmitter();

    mezzoSelezionato: MezzoComposizione;
    assegnato = false;
    hover = false;

    constructor(private compMezzoSquadra: CompMezzoSquadraService) {
        this.compMezzoSquadra.getMezzo().subscribe(mezzo => {
            this.mezzoSelezionato = mezzo;
        });
    }

    ngOnInit() {
    }

    ngOnChanges() {
        if (this.partenze.length > 0 && this.partenze[this.idPartenzaAttuale]) {
            this.compMezzoSquadra.setMezzo(this.partenze[this.idPartenzaAttuale].mezzoComposizione);
        }
    }

    click(mezzo) {
        this.compMezzoSquadra.setMezzo(mezzo);
        /* if (!this.mezzoSelezionato) {
          this.compMezzoSquadra.setMezzo(mezzo);
        } else if (this.mezzoSelezionato !== mezzo) {
          this.compMezzoSquadra.clearMezzo();
          this.compMezzoSquadra.setMezzo(mezzo);
        } else if (this.mezzoSelezionato === mezzo) {
          this.compMezzoSquadra.clearMezzo();
          this.compMezzoSquadra.clearSquadra();
        } */
    }

    hoverIn() {
        this.hover = true;
    }

    hoverOut() {
        this.hover = false;
    }

    clickNuovoMezzo() {
        // console.log('Nuovo mezzo');
        this.nuovoMezzo.emit();
    }

    // NgClass
    mezzoCompClass(mezzoComp) {
        let returnClass = '';
        if (this.mezzoSelezionato && this.mezzoSelezionato === mezzoComp) {
            returnClass = 'border-primary bg-grey';
        }

        if (this.hover) {
            returnClass = returnClass + ' bg-grey';
        }

        if (this.partenze.length > 0) {
            this.partenze.forEach((p: BoxPartenza) => {
                if (mezzoComp === p.mezzoComposizione && p.id !== this.idPartenzaAttuale) {
                    returnClass = 'disabled';
                }
            });
        }
        return returnClass;
    }

    iconaStatiClass(mezzoComp) {
        let returnClass = '';

        switch (mezzoComp.mezzo.stato) {
            case 'inSede':
                returnClass = 'text-secondary';
                break;
            case 'inViaggio':
                returnClass = 'text-info';
                break;
            case 'inRientro':
                returnClass = 'text-primary';
                break;
            case 'sulPosto':
                returnClass = 'text-success';
                break;

            default:
                break;
        }

        return returnClass;
    }

    mezzoDirection(mezzo: MezzoComposizione): void {
        this.mezzoCoordinate.emit(mezzo.coordinate);
    }
}
