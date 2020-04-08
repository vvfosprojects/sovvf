import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TipoTerreno } from '../../model/tipo-terreno';
import { TipoTerrenoEnum } from '../../enum/tipo-terreno.enum';
import { TipoTerrenoCheckboxInterface, UnitaMisuraTerreno } from '../../interface/tipo-terreno-checkbox.interface';

@Component({
    selector: 'app-selezione-tipi-terreno',
    templateUrl: './selezione-tipi-terreno.component.html',
    styleUrls: ['./selezione-tipi-terreno.component.css']
})
export class SelezioneTipiTerrenoComponent implements OnChanges, AfterViewInit {

    @Input() tipiTerreno: TipoTerreno[];
    @Output() tipiTerrenoSelezionati = new EventEmitter<TipoTerreno[]>();

    terrenoHa: boolean;
    tipiTerreniChecked: TipoTerrenoCheckboxInterface[] = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (this.tipiTerreniChecked.length === 0) {
            if (changes['tipiTerreno'].currentValue) {
                this.createCheckBoxTerreni(this.tipiTerreno);
            } else {
                this.createCheckBoxTerreni();
            }
        }
    }

    ngAfterViewInit(): void {
        if (this.tipiTerreniChecked.length === 0) {
            this.createCheckBoxTerreni();
        }
    }

    createCheckBoxTerreni(terreniArray?: TipoTerreno[]): void {
        for (const value in TipoTerrenoEnum) {
            if (typeof TipoTerrenoEnum[value] === 'string') {
                this.tipiTerreniChecked.push({
                    name: TipoTerrenoEnum[value],
                    checked: false,
                    value: 0,
                    unit: this.terrenoHa ? UnitaMisuraTerreno.Ha : UnitaMisuraTerreno.Mq
                });
            }
        }
        if (terreniArray) {
            terreniArray.forEach(terreno => {
                this.tipiTerreniChecked.forEach(terrenoChecked => {
                    if (terrenoChecked.name === terreno.descrizione) {
                        terrenoChecked.checked = true;
                        terrenoChecked.value = terreno.mq;
                    }
                });
            });
        }
    }

    validateChechBoxTerreni(): void {
        const terreniArray: TipoTerreno[] = [];
        this.tipiTerreniChecked.forEach(terreno => {
            if (terreno.checked) {
                let terrenoMq = terreno.value;
                if (terreno.unit === UnitaMisuraTerreno.Ha) {
                    terrenoMq = terreno.value * 10000;
                }
                terreniArray.push(new TipoTerreno(TipoTerrenoEnum[terreno.name], terrenoMq));
            }
        });
        this.tipiTerrenoSelezionati.emit(terreniArray);
    }

    onKeyMqTerreno(event: any, tipoTerreno: string) {
        this.tipiTerreniChecked.forEach(tipoTerrenoChecked => {
            if (tipoTerrenoChecked.name === tipoTerreno) {
                tipoTerrenoChecked.value = event.target.value;
                tipoTerrenoChecked.unit = this.terrenoHa ? UnitaMisuraTerreno.Ha : UnitaMisuraTerreno.Mq;
            }
        });
        this.validateChechBoxTerreni();
    }

    onCheckboxTerreno(name: string) {
        this.tipiTerreniChecked.forEach(tipoTerrenoChecked => {
            if (tipoTerrenoChecked.name === name) {
                tipoTerrenoChecked.checked = !tipoTerrenoChecked.checked;
                tipoTerrenoChecked.unit = this.terrenoHa ? UnitaMisuraTerreno.Ha : UnitaMisuraTerreno.Mq;
            }
        });
        this.validateChechBoxTerreni();
    }

    getUnitaMisura(): string {
        return this.terrenoHa ? 'Ha' : 'Mq';
    }

    setUnitaMisura(): void {
        this.terrenoHa = !this.terrenoHa;
        this.tipiTerreniChecked.forEach(tipoTerrenoChecked => {
            if (tipoTerrenoChecked.checked) {
                if (tipoTerrenoChecked.unit === UnitaMisuraTerreno.Mq) {
                    tipoTerrenoChecked.value = tipoTerrenoChecked.value / 10000;
                    tipoTerrenoChecked.unit = UnitaMisuraTerreno.Ha;
                } else {
                    tipoTerrenoChecked.value = tipoTerrenoChecked.value * 10000;
                    tipoTerrenoChecked.unit = UnitaMisuraTerreno.Mq;
                }
            }
        });
        this.validateChechBoxTerreni();
    }

}
