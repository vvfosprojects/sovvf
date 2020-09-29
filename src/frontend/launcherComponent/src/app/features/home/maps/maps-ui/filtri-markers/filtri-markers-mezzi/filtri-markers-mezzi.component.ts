import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltroMezzi } from '../../../maps-model/filtro-mezzi.interface';
import { StatoMezzo } from '../../../../../../shared/enum/stato-mezzo.enum';
import { DescrizioneTipologicaMezzo } from '../../../../composizione-partenza/interface/filtri/descrizione-filtro-composizione-interface';
import { CheckboxInterface } from '../../../../../../shared/interface/checkbox.interface';

@Component({
    selector: 'app-filtri-markers-mezzi',
    templateUrl: './filtri-markers-mezzi.component.html',
    styleUrls: ['./filtri-markers-mezzi.component.css']
})
export class FiltriMarkersMezziComponent implements OnInit {

    @Input() filtroMezziAttivi: FiltroMezzi;
    @Input() genereMezzo: DescrizioneTipologicaMezzo[];

    @Output() changeMezziAltriComandi = new EventEmitter<boolean>();
    @Output() changeStati = new EventEmitter<StatoMezzo[]>();
    @Output() changeGenere = new EventEmitter<DescrizioneTipologicaMezzo[]>();

    checkboxMezziAltriComandiState = { id: 'mezziAltriComandi', status: false, label: 'Mezzi Altri Comandi' };
    statiMezzo = Object.values(StatoMezzo);
    statiSelezionati: string[] = [];
    generiSelezionati: string[] = [];

    ngOnInit(): void {
        this.statiSelezionati = this.filtroMezziAttivi.stato;
        this.generiSelezionati = this.filtroMezziAttivi.tipologia;
    }

    onChangeMezziAltriComandi($event: CheckboxInterface) {
        console.log('onChangeMezziAltriComandi', $event);
        this.checkboxMezziAltriComandiState.status = $event.status;
        this.changeMezziAltriComandi.emit($event.status);
    }

    onChangeGenere($event) {
        console.log('onChangeGenere', $event);
        this.changeGenere.emit($event);
    }

    onChangeStati($event) {
        console.log('onChangeStati', $event);
        this.changeStati.emit($event);
    }

}
