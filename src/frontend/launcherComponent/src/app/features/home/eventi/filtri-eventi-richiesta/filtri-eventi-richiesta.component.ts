import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FiltroTargaMezzo } from '../interface/filtro-targa-mezzo.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';

@Component({
    selector: 'app-filtri-eventi-richiesta',
    templateUrl: './filtri-eventi-richiesta.component.html',
    styleUrls: ['./filtri-eventi-richiesta.component.css']
})
export class FiltriEventiRichiestaComponent implements OnChanges {

    @Input() codiceRichiesta: string;
    @Input() listaTargaMezzo: FiltroTargaMezzo[];
    @Input() initValue: string[];
    @Input() iconeNomeClasseEvento: boolean;
    @Input() elencoEventi: EventoRichiesta[];

    @Output() targheSelezionate = new EventEmitter<string[]>();
    @Output() toggleIconeNomeClasseEvento = new EventEmitter<boolean>();

    form: FormGroup;
    targheSelezionateUnique: FiltroTargaMezzo[] = [];

    constructor(private formBuilder: FormBuilder) {
        this.form = this.formBuilder.group({
            targheSelezionate: [{ value: '', disabled: true }]
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.listaTargaMezzo && changes.listaTargaMezzo.currentValue) {
            // Per rimuovere targhe duplicate
            const listaTargaMezzoFirst: FiltroTargaMezzo[] = changes.listaTargaMezzo.currentValue;
            this.targheSelezionateUnique = [];
            const uniqueObject = {};
            for (const i in listaTargaMezzoFirst) {
                const objTitle = listaTargaMezzoFirst[i]['targa'];
                uniqueObject[objTitle] = listaTargaMezzoFirst[i];
            }
            for (const i in uniqueObject) {
                this.targheSelezionateUnique.push(uniqueObject[i]);
            }
            if (this.targheSelezionateUnique.length > 0) {
                this.targaControl.enable();
            }
        }
        if (changes && changes.initValue && changes.initValue.currentValue) {
            const initValue: string = changes.initValue.currentValue;
            if (initValue) {
                this.targaControl.setValue(initValue);
            }
        }
    }

    get targaControl(): any {
        return this.form.controls.targheSelezionate;
    }

    onChange(): void {
        this.targheSelezionate.emit(this.targaControl.value);
    }

    mostraTesto(): string {
        if (this.targheSelezionateUnique && this.targheSelezionateUnique.length > 0) {
            return 'Filtra per targa mezzo';
        } else {
            return 'Nessun mezzo trovato';
        }
    }

    getIconaBottone(): string {
        let returnIcon = '';
        if (this.iconeNomeClasseEvento) {
            returnIcon = 'fa-align-left';
        } else {
            returnIcon = 'fa-eye';
        }
        return returnIcon;
    }

}
