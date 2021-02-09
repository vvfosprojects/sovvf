import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TreeviewItem } from 'ngx-treeview';
import { RispostaTriage } from '../../../interface/risposta-triage.interface';

@Component({
    selector: 'app-step-domande',
    templateUrl: './step-domande.component.html',
    styleUrls: ['./step-domande.component.scss']
})
export class StepDomandeComponent implements OnChanges {

    @Input() triage: TreeviewItem;

    domandaVisualizzata: TreeviewItem;

    @Output() risposta: EventEmitter<RispostaTriage> = new EventEmitter<RispostaTriage>();

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.triage?.currentValue) {
            this.initPrimaDomanda();
        }
    }

    initPrimaDomanda(): void {
        this.domandaVisualizzata = this.triage;
    }

    setRisposta(risposta: TreeviewItem): void {
        this.nextDomanda(risposta);

        const parentValue = risposta.value.slice(2);
        const domanda = findItem(this.triage, parentValue)?.text;
        this.risposta.emit({ rispostaValue: risposta.value, domanda, risposta: risposta.text });

        function findItem(element: any, value: string): TreeviewItem {
            if (element.value === value) {
                return element;
            } else if (element.children != null) {
                let i: number;
                let result = null;
                for (i = 0; result == null && i < element.children.length; i++) {
                    result = findItem(element.children[i], value);
                }
                return result;
            }
            return null;
        }
    }

    nextDomanda(risposta: TreeviewItem): void {
        if (risposta?.children?.length) {
            this.domandaVisualizzata = risposta.children[0];
        } else {
            this.domandaVisualizzata = null;
        }
    }
}
