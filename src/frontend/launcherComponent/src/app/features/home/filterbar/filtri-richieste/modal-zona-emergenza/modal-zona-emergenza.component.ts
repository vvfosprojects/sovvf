import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { ZoneEmergenzaState } from '../../../store/states/filterbar/zone-emergenza.state';
import { makeCopy } from '../../../../../shared/helper/function-generiche';
import { ImpostazioniState } from '../../../../../shared/store/states/impostazioni/impostazioni.state';

@Component({
    selector: 'app-modal-zona-emergenza',
    templateUrl: './modal-zona-emergenza.component.html',
    styleUrls: ['./modal-zona-emergenza.component.css']
})
export class ModalZonaEmergenzaComponent implements OnInit, OnDestroy {

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    nessunaZonaSelected = false;
    nessunaZonaLocked = false;
    zoneEmergenzaLocked = false;
    subscription: Subscription = new Subscription();
    zonaEmergenzaArrayFake: any = [];

    constructor(private modal: NgbActiveModal, private store: Store) {
        const zoneEmergenza = makeCopy(this.store.selectSnapshot(ZoneEmergenzaState.zoneEmergenza));
        this.zonaEmergenzaArrayFake = zoneEmergenza;
        console.log('zonaEmergenzaArrayFake ', this.zonaEmergenzaArrayFake);
        this.getNightMode();
    }

    ngOnInIt(): void {
        this.nessunaZonaSelected = false;
        this.zonaEmergenzaArrayFake.forEach(e => e.selected = false);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.nightMode = nightMode;
            })
        );
    }

    onNightMode(): string {
        let value = '';
        if (!this.nightMode) {
            value = '';
        } else if (this.nightMode) {
            value = ' moon-mode';
        }
        return value;
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
        this.nessunaZonaLocked = true;
    }

    onClickNessunaZona(): void {
        this.nessunaZonaSelected = !this.nessunaZonaSelected;
        this.zoneEmergenzaLocked = true;
    }

    onResetZoneEmergenza(): void {
        this.zoneEmergenzaLocked = false;
        this.nessunaZonaLocked = false;
        this.nessunaZonaSelected = false;
        this.zonaEmergenzaArrayFake.forEach(e => e.selected = false);
    }

    ngOnInit(): void {
    }
}
