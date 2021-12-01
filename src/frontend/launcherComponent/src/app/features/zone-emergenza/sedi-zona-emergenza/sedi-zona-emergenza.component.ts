import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { AddDoa, AddPca, DeleteDoa, DeletePca, GetTipologieEmergenza, GetZonaEmergenzaById, SaveCraZonaEmergenza } from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { NgWizardConfig, THEME } from 'ng-wizard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doa } from '../interface/doa.interface';
import { DoaModalComponent } from './doa-modal/doa-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoaForm } from '../interface/doa-form.interface';
import { roundToDecimal } from '../../../shared/helper/function-generiche';
import { PcaForm } from '../interface/pca-form.interface';
import { PcaModalComponent } from './pca-modal/pca-modal.component';
import AddressCandidate from '@arcgis/core/tasks/support/AddressCandidate';
import { ResetForm } from '@ngxs/form-plugin';

@Component({
    selector: 'app-sedi-zona-emergenza',
    templateUrl: './sedi-zona-emergenza.component.html',
    styleUrls: ['./sedi-zona-emergenza.component.css']
})
export class SediZonaEmergenzaComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;

    idZonaEmergenza: string;

    config: NgWizardConfig = {
        theme: THEME.default,
        selected: 0,
        lang: { next: 'Avanti', previous: 'Indietro' },
        cycleSteps: false
    };

    craZonaEmergenzaForm: FormGroup;

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store,
                private formBuilder: FormBuilder,
                private modalService: NgbModal) {
        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }

        this.store.dispatch(new GetZonaEmergenzaById(this.idZonaEmergenza));

        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
    }

    get f(): any {
        return this.craZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.initForm();
        this.store.dispatch([
            new SetSediNavbarVisible(false),
            new GetTipologieEmergenza(),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new SetSediNavbarVisible(),
            new ResetForm({ path: 'zoneEmergenza.craZonaEmergenzaForm' })
        ]);
        this.subscriptions.unsubscribe();
    }

    getDoubleMonitorMode(): void {
        this.subscriptions.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
            })
        );
    }

    getZonaEmergenzaById(): void {
        this.subscriptions.add(
            this.zonaEmergenzaById$.subscribe((zonaEmergenza: ZonaEmergenza) => {
                if (zonaEmergenza) {
                    this.zonaEmergenzaById = zonaEmergenza;
                    if (this.zonaEmergenzaById.dirigenti?.length && this.craZonaEmergenzaForm) {
                        this.patchDirigentiForm();
                    }
                    if (this.zonaEmergenzaById.cra && this.craZonaEmergenzaForm) {
                        this.patchForm();
                    }
                }
            })
        );
    }

    initForm(): void {
        this.craZonaEmergenzaForm = this.formBuilder.group({
            nome: [null, [Validators.required]],
            indirizzo: [null, [Validators.required]],
            latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            comandanteRegionale: [null, [Validators.required]],
            responsabileDistrettoAreaColpita: [null, [Validators.required]],
            responsabile: [null, [Validators.required]],
            responsabileCampiBaseMezziOperativi: [null, [Validators.required]],
            responsabileGestionePersonaleContratti: [null, [Validators.required]],
            listaDoa: [null]
        });

        if (this.zonaEmergenzaById?.dirigenti?.length) {
            this.patchDirigentiForm();
        }
        if (this.zonaEmergenzaById?.cra) {
            this.patchForm();
        }
    }

    patchForm(): void {
        this.craZonaEmergenzaForm.patchValue({
            nome: this.zonaEmergenzaById.cra.nome,
            indirizzo: this.zonaEmergenzaById.cra.indirizzo,
            latitudine: this.zonaEmergenzaById.cra.coordinate?.latitudine,
            longitudine: this.zonaEmergenzaById.cra.coordinate?.longitudine,
            listaDoa: this.zonaEmergenzaById.cra.listaDoa,
        });
    }

    patchDirigentiForm(): void {
        this.craZonaEmergenzaForm.patchValue({
            comandanteRegionale: this.zonaEmergenzaById.dirigenti[0],
            responsabileDistrettoAreaColpita: this.zonaEmergenzaById.dirigenti[1],
            responsabile: this.zonaEmergenzaById.dirigenti[2],
            responsabileCampiBaseMezziOperativi: this.zonaEmergenzaById.dirigenti[3],
            responsabileGestionePersonaleContratti: this.zonaEmergenzaById.dirigenti[4],
        });
        this.f.comandanteRegionale.disable();
        this.f.responsabileDistrettoAreaColpita.disable();
        this.f.responsabile.disable();
        this.f.responsabileCampiBaseMezziOperativi.disable();
        this.f.responsabileGestionePersonaleContratti.disable();
    }

    onAddDoa(zonaEmergenza: ZonaEmergenza): void {
        const inserisciDoaModal = this.modalService.open(DoaModalComponent, {
            windowClass: 'modal-holder',
            size: 'xl',
            centered: true
        });

        const moduliMobImmediataZonaEmergenza = this.zonaEmergenzaById.listaModuliImmediata;
        const moduliMobPotIntZonaEmergenza = this.zonaEmergenzaById.listaModuliPotInt;
        const moduliMobConsolidamentoZonaEmergenza = this.zonaEmergenzaById.listaModuliConsolidamento;
        const moduli = [];
        if (moduliMobImmediataZonaEmergenza) {
            moduli.push(...moduliMobImmediataZonaEmergenza);
        }
        if (moduliMobPotIntZonaEmergenza) {
            moduli.push(...moduliMobPotIntZonaEmergenza);
        }
        if (moduliMobConsolidamentoZonaEmergenza) {
            moduli.push(...moduliMobConsolidamentoZonaEmergenza);
        }

        inserisciDoaModal.componentInstance.moduli = moduli;
        inserisciDoaModal.componentInstance.zonaEmergenza = zonaEmergenza;

        inserisciDoaModal.result.then((result: { esito: string, doa: DoaForm }) => {
            switch (result.esito) {
                case 'ok':
                    this.addDoa(result.doa);
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
        });
    }

    onAddPca(doa: Doa): void {
        const inserisciPcaModal = this.modalService.open(PcaModalComponent, {
            windowClass: 'modal-holder',
            size: 'xl',
            centered: true
        });

        // const moduliMobImmediataZonaEmergenza = this.zonaEmergenzaById.listaModuliImmediata;
        // const moduliMobPotIntZonaEmergenza = this.zonaEmergenzaById.listaModuliPotInt;
        // const moduliMobConsolidamentoZonaEmergenza = this.zonaEmergenzaById.listaModuliConsolidamento;
        // const moduli = [];
        // if (moduliMobImmediataZonaEmergenza) {
        //     moduli.push(...moduliMobImmediataZonaEmergenza);
        // }
        // if (moduliMobPotIntZonaEmergenza) {
        //     moduli.push(...moduliMobPotIntZonaEmergenza);
        // }
        // if (moduliMobConsolidamentoZonaEmergenza) {
        //     moduli.push(...moduliMobConsolidamentoZonaEmergenza);
        // }

        // console.log('moduli', moduli);
        // inserisciPcaModal.componentInstance.moduli = moduli;

        inserisciPcaModal.result.then((result: { esito: string, pca: PcaForm }) => {
            switch (result.esito) {
                case 'ok':
                    this.addPca(result.pca, doa.codice);
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
        });
    }

    onSetIndirizzo(candidate: AddressCandidate): void {
        console.log('onSetIndirizzo', candidate);
        const lat = roundToDecimal(candidate.location.latitude, 6);
        const lng = roundToDecimal(candidate.location.longitude, 6);

        this.f.indirizzo.patchValue(candidate.address);
        this.f.latitudine.patchValue(lat);
        this.f.longitudine.patchValue(lng);
    }

    addDoa(doa: DoaForm): void {
        this.store.dispatch(new AddDoa(doa));
    }

    deleteDoa(codice: string): void {
        this.store.dispatch(new DeleteDoa(codice));
    }

    addPca(pca: PcaForm, codiceDoa: string): void {
        this.store.dispatch(new AddPca(pca, codiceDoa));
    }

    deletePca(codice: string): void {
        this.store.dispatch(new DeletePca(codice));
    }

    saveCraZonaEmergenza(): void {
        if (this.craZonaEmergenzaForm.valid) {
            this.store.dispatch(new SaveCraZonaEmergenza());
        }
    }

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
