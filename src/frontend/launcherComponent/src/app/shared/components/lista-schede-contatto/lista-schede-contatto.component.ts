import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContatoriSchedeContatto } from '../../interface/contatori-schede-contatto.interface';
import { SchedaContatto } from '../../interface/scheda-contatto.interface';
import { RangeSchedeContattoEnum } from '../../enum/range-schede-contatto';
import { ClassificazioneSchedaContatto } from '../../enum/classificazione-scheda-contatto.enum';
import { PermissionFeatures } from '../../enum/permission-features.enum';
import { CheckboxInterface } from '../../interface/checkbox.interface';

@Component({
    selector: 'app-lista-schede-contatto',
    templateUrl: './lista-schede-contatto.component.html',
    styleUrls: ['./lista-schede-contatto.component.scss']
})
export class ListaSchedeContattoComponent implements OnInit {

    @Input() ricerca: string;
    @Input() pageSize: number;
    @Input() totalItems: number;
    @Input() page: number;
    @Input() tabAttivo: string;
    @Input() schedeContatto: SchedaContatto[];
    @Input() contatoriSchedeContatto: ContatoriSchedeContatto;
    @Input() idVisualizzati: string[];
    @Input() idCollapsed: string[];
    @Input() codiceSchedaContattoHover: string;
    @Input() statoModalita: boolean;
    @Input() idSelezionatiMerge: string[];
    @Input() classificazioneMerge: ClassificazioneSchedaContatto;
    @Input() loading: boolean;
    @Input() rangeVisualizzazione: RangeSchedeContattoEnum;
    @Input() hideRangeVisualizzazione: boolean;
    @Input() hideRaggruppa: boolean;
    @Input() nightMode: boolean;

    @Output() tabSelected: EventEmitter<any> = new EventEmitter<any>();
    @Output() hoverOut: EventEmitter<any> = new EventEmitter<any>();
    @Output() hoverIn: EventEmitter<string> = new EventEmitter<string>();
    @Output() collapsed: EventEmitter<any> = new EventEmitter<any>();
    @Output() undoMergeSchedaContatto: EventEmitter<any> = new EventEmitter<any>();
    @Output() dettaglioScheda: EventEmitter<any> = new EventEmitter<any>();
    @Output() editSchedaSelezionata: EventEmitter<CheckboxInterface> = new EventEmitter<CheckboxInterface>();
    @Output() checkboxError: EventEmitter<any> = new EventEmitter<any>();
    @Output() schedaContattoTelefonata: EventEmitter<SchedaContatto> = new EventEmitter<SchedaContatto>();
    @Output() schedaContattoGestita: EventEmitter<any> = new EventEmitter<any>();
    @Output() indietro: EventEmitter<any> = new EventEmitter<any>();
    @Output() toggleModalitaMerge: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() saveMerge: EventEmitter<any> = new EventEmitter<any>();
    @Output() changeFiltroRange: EventEmitter<RangeSchedeContattoEnum> = new EventEmitter<RangeSchedeContattoEnum>();
    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    rangeSchedeContattoEnumValues = Object.values(RangeSchedeContattoEnum);
    RangeVisualizzazione = RangeSchedeContattoEnum;
    ClassificazioneEnum = ClassificazioneSchedaContatto;
    permessiFeature = PermissionFeatures;

    constructor() {
    }

    ngOnInit(): void {
    }

    onSelectTab(tab: any): void {
        this.tabSelected.emit(tab);
    }

    onHoverIn(codiceScheda: string): void {
        this.hoverIn.emit(codiceScheda);
    }

    onHoverOut(): void {
        this.hoverIn.emit();
    }

    onCollapsed(codiceScheda: string): void {
        this.collapsed.emit(codiceScheda);
    }

    onUndoMergeSchedaContatto(codiceScheda: string): void {
        this.undoMergeSchedaContatto.emit(codiceScheda);
    }

    onDettaglioScheda(codiceScheda: string): void {
        this.dettaglioScheda.emit(codiceScheda);
    }

    onEditSchedaSelezionata(codiceScheda: CheckboxInterface): void {
        this.editSchedaSelezionata.emit(codiceScheda);
    }

    onCheckboxError(): void {
        this.checkboxError.emit();
    }

    onSetSchedaContattoTelefonata(scheda: SchedaContatto): void {
        this.schedaContattoTelefonata.emit(scheda);
    }

    onSetSchedaContattoGestita(scheda: SchedaContatto, value: boolean): void {
        this.schedaContattoGestita.emit({ scheda, value });
    }

    // Todo: eliminare
    // onTornaIndietro(): void {
    //     this.indietro.emit();
    // }

    onToggleModalitaMerge(): void {
        this.toggleModalitaMerge.emit();
    }

    onSaveMerge(): void {
        this.saveMerge.emit();
    }

    onSetFiltroRange(r: RangeSchedeContattoEnum): void {
        this.changeFiltroRange.emit(r);
    }

    onPageChange(page: number): void {
        this.pageChange.emit(page);
    }

}
