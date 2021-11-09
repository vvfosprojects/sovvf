import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipologiaEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { Select, Store } from '@ngxs/store';
import { GetModuliColonnaMobile, ResetModuliSelezionati, SetModuloDeselezionato, SetModuloSelezionato } from '../store/actions/moduli-colonna-mobile/moduli-colonna-mobile.actions';
import { NgWizardConfig, STEP_STATE, THEME } from 'ng-wizard';
import { Observable, Subscription } from 'rxjs';
import { ModuliColonnaMobileState } from '../store/states/moduli-colonna-mobile/moduli-colonna-mobile.state';
import { ModuloColonnaMobile } from '../interface/modulo-colonna-mobile.interface';

@Component({
    selector: 'app-moduli-colonna-mobile-modal',
    templateUrl: './moduli-colonna-mobile-modal.component.html',
    styleUrls: ['./moduli-colonna-mobile-modal.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ModuliColonnaMobileModalComponent implements OnInit, OnDestroy {

    @Select(ModuliColonnaMobileState.moduliColonnaMobile) moduliColonnaMobile$: Observable<ModuloColonnaMobile>;
    moduliColonnaMobile: ModuloColonnaMobile;
    @Select(ModuliColonnaMobileState.moduliSelezionati) moduliSelezionati$: Observable<ModuloColonnaMobile[]>;
    moduliSelezionati: ModuloColonnaMobile[];
    @Select(ModuliColonnaMobileState.loadingModuliColonnaMobile) loadingModuliColonnaMobile$: Observable<boolean>;
    loadingModuliColonnaMobile: boolean;

    fase: string;

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
        cycleSteps: false,
        toolbarSettings: {
            toolbarExtraButtons: [
                {
                    text: 'CONFERMA COLONNE MOBILI',
                    class: 'btn btn-success',
                    event: () => {
                        this.onConfermaModuli();
                    }
                }
            ],
        }
    };

    private subscriptions: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal,
                private store: Store) {
        this.getModuliColonnaMobile();
        this.getModuliSelezionati();
        this.getLoadingModuliColonnaMobile();
    }

    ngOnInit(): void {
        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);
        const tipologiaEmergenza = tipologieEmergenza?.filter((t: TipologiaEmergenza) => t.id === this.zonaEmergenza.tipologia.id)[0];
        this.tipologiaEmergenza = tipologiaEmergenza;
        switch (this.fase) {
            case '1':
                this.tipologiaEmergenza.moduli.mob_Immediata.forEach((m: string) => {
                    this.store.dispatch(new GetModuliColonnaMobile(m));
                });
                break;
            case '2':
                this.tipologiaEmergenza.moduli.mob_Consolidamento.forEach((m: string) => {
                    this.store.dispatch(new GetModuliColonnaMobile(m));
                });
                break;
            case '3':
                this.tipologiaEmergenza.moduli.mob_Pot_Int.forEach((m: string) => {
                    this.store.dispatch(new GetModuliColonnaMobile(m));
                });
                break;
        }
    }

    ngOnDestroy(): void {
        this.store.dispatch(new ResetModuliSelezionati());
    }

    getModuliColonnaMobile(): void {
        this.subscriptions.add(
            this.moduliColonnaMobile$.subscribe((moduliColonnaMobile: any) => {
                this.moduliColonnaMobile = moduliColonnaMobile;
            })
        );
    }

    getModuliSelezionati(): void {
        this.subscriptions.add(
            this.moduliSelezionati$.subscribe((moduliSelezionati: any) => {
                this.moduliSelezionati = moduliSelezionati;
            })
        );
    }

    getLoadingModuliColonnaMobile(): void {
        this.subscriptions.add(
            this.loadingModuliColonnaMobile$.subscribe((loadingModuliColonnaMobile: boolean) => {
                this.loadingModuliColonnaMobile = loadingModuliColonnaMobile;
            })
        );
    }

    getStepDescription(nomeModulo: string): string {
        const count = this.moduliSelezionati?.filter((m: ModuloColonnaMobile) => m.nomeModulo === nomeModulo)?.length;
        let description: string;
        if (count === 1) {
            description = '' + count + ' selezionato';
        }
        if (count > 1) {
            description = '' + count + ' selezionati';
        }
        return description;
    }

    getRiepilogoStepDescription(): string {
        const count = this.moduliSelezionati?.length;
        const description = count ? count + ' totali' : '';
        return description;
    }

    stepChanged(event: any): void {
        // TODO: logica prossimo step wizard
    }

    isSelezionatoModulo(idModulo: string): boolean {
        return !!(this.moduliSelezionati.filter((m: ModuloColonnaMobile) => m.id === idModulo)[0]);
    }

    onSelezioneModulo(moduloColonnaMobile: ModuloColonnaMobile): void {
        const isSelezionato = this.moduliSelezionati.filter((m: ModuloColonnaMobile) => m.id === moduloColonnaMobile.id)[0];
        if (!isSelezionato) {
            this.store.dispatch(new SetModuloSelezionato(moduloColonnaMobile));
        } else {
            this.store.dispatch(new SetModuloDeselezionato(moduloColonnaMobile.id));
        }
    }

    onConfermaModuli(): void {
        this.close('ok', this.moduliSelezionati, this.fase);
    }

    close(esito: string, moduliSelezionati?: ModuloColonnaMobile[], fase?: string): void {
        this.modal.close({ esito, moduliSelezionati, fase });
    }
}
