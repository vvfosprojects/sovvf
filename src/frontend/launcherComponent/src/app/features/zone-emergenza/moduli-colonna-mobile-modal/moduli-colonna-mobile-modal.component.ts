import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipologiaEmergenza, ZonaEmergenza } from '../../../shared/model/zona-emergenza.model';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { Select, Store } from '@ngxs/store';
import { GetModuliColonnaMobile } from '../store/actions/moduli-colonna-mobile/moduli-colonna-mobile.actions';
import { NgWizardConfig, STEP_STATE, THEME } from 'ng-wizard';
import { Observable, Subscription } from 'rxjs';
import { ModuliColonnaMobileState } from '../store/states/moduli-colonna-mobile/moduli-colonna-mobile.state';

@Component({
    selector: 'app-moduli-colonna-mobile-modal',
    templateUrl: './moduli-colonna-mobile-modal.component.html',
    styleUrls: ['./moduli-colonna-mobile-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModuliColonnaMobileModalComponent implements OnInit {

    @Select(ModuliColonnaMobileState.moduliColonnaMobile) moduliColonnaMobile$: Observable<any>;
    moduliColonnaMobile: any;
    @Select(ModuliColonnaMobileState.loadingModuliColonnaMobile) loadingModuliColonnaMobile$: Observable<boolean>;
    loadingModuliColonnaMobile: boolean;

    zonaEmergenza: ZonaEmergenza;
    tipologiaEmergenza: TipologiaEmergenza;

    stepStates = {
        normal: STEP_STATE.normal,
        disabled: STEP_STATE.disabled,
        error: STEP_STATE.error,
        hidden: STEP_STATE.hidden
    };

    config: NgWizardConfig = {
        theme: THEME.default,
        selected: 0,
        lang: { next: 'Avanti', previous: 'Indietro' },
        cycleSteps: false
    };

    private subscriptions: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private store: Store) {
        this.getModuliColonnaMobile();
        this.getLoadingModuliColonnaMobile();
    }

    ngOnInit(): void {
        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);
        const tipologiaEmergenza = tipologieEmergenza?.filter((t: TipologiaEmergenza) => t.id === this.zonaEmergenza.tipologia.id)[0];
        this.tipologiaEmergenza = tipologiaEmergenza;

        this.tipologiaEmergenza.moduli.mob_Immediata.forEach((m: string) => {
            this.store.dispatch(new GetModuliColonnaMobile(m));
        });
    }

    getModuliColonnaMobile(): void {
        this.subscriptions.add(
            this.moduliColonnaMobile$.subscribe((moduliColonnaMobile: any) => {
                this.moduliColonnaMobile = moduliColonnaMobile;
            })
        );
    }

    getLoadingModuliColonnaMobile(): void {
        this.subscriptions.add(
            this.loadingModuliColonnaMobile$.subscribe((loadingModuliColonnaMobile: boolean) => {
                this.loadingModuliColonnaMobile = true;
            })
        );
    }

    stepChanged(event: any): void {
        // TODO: logica prossimo step wizard
    }

    onSelectModulo(nomeModulo: string, moduloColonnaMobile: any): void {

    }

    close(esito: string): void {
        this.modal.close(esito);
    }
}
