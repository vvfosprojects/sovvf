import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';

@Component({
    selector: 'app-lista-partenze-composizione',
    templateUrl: './lista-partenze-composizione.component.html',
    styleUrls: ['./lista-partenze-composizione.component.css']
})
export class ListaPartenzeComposizioneComponent {

    @Input() richiesta: SintesiRichiesta;
    @Input() visualizzaPercorsi: boolean;
    @Input() nightMode: boolean;

    @Output() toggleVisualizzaPercorsi: EventEmitter<any> = new EventEmitter<any>();

    onToggleVisualizzaPercorsi(): void {
        this.toggleVisualizzaPercorsi.emit(!this.visualizzaPercorsi);
    }

}
