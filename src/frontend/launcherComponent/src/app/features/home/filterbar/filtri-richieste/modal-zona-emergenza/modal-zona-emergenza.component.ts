import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { ZoneEmergenzaState } from '../../../store/states/filterbar/zone-emergenza.state';
import { makeCopy } from '../../../../../shared/helper/function-generiche';

@Component({
    selector: 'app-modal-zona-emergenza',
    templateUrl: './modal-zona-emergenza.component.html',
    styleUrls: ['./modal-zona-emergenza.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalZonaEmergenzaComponent {

    nessunaZonaSelected = false;
    nessunaZonaLocked = false;
    zoneEmergenzaLocked = false;
    zonaEmergenzaArrayFake: any = [];

    constructor(private modal: NgbActiveModal, private store: Store) {
        const zoneEmergenza = makeCopy(this.store.selectSnapshot(ZoneEmergenzaState.zoneEmergenza));
        this.zonaEmergenzaArrayFake = zoneEmergenza;
    }

    ngOnInIt(): void {
        this.zonaEmergenzaArrayFake.forEach(e => e.selected = false);
    }

    chiudiModalFiltriTipologia(closeRes: string): void {
        if (closeRes === 'ok') {
            if (!this.zoneEmergenzaLocked && this.nessunaZonaLocked) {
                this.modal.close(this.zonaEmergenzaArrayFake.filter(x => x.selected).map(x => x.name));
            } else if (!this.nessunaZonaLocked && this.zoneEmergenzaLocked) {
                this.modal.close('Nessuna zona emergenza');
            } else {
                this.modal.close(null);
            }
        } else {
            this.modal.close(null);
        }
    }

    onBoxClick(i): void {
        this.zonaEmergenzaArrayFake[i].selected = !this.zonaEmergenzaArrayFake[i].selected;
        let unlockAll = true;
        this.zonaEmergenzaArrayFake.forEach(e => e.selected ? unlockAll = false : null);
        unlockAll ? this.nessunaZonaLocked = false : this.nessunaZonaLocked = true;
    }

    onClickNessunaZona(): void {
        this.nessunaZonaSelected = !this.nessunaZonaSelected;
        this.nessunaZonaLocked = false;
        this.zoneEmergenzaLocked = this.nessunaZonaSelected;
    }
}
