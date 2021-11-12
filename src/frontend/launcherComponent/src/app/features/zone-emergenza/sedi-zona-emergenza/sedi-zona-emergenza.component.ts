import { Component, OnDestroy, OnInit } from '@angular/core';
import { ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { AddDoa, DeleteDoa, GetZonaEmergenzaById, SaveCraZonaEmergenza } from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { NgWizardConfig, THEME } from 'ng-wizard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Doa } from '../interface/doa.interface';
import { DoaModalComponent } from './doa-modal/doa-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DoaForm } from '../interface/doa-form.interface';

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
    @Select(ZoneEmergenzaState.doa) doa$: Observable<Doa[]>;
    doa: Doa[];

    idZonaEmergenza: string;

    config: NgWizardConfig = {
        theme: THEME.default,
        selected: 0,
        lang: { next: 'Avanti', previous: 'Indietro' },
        cycleSteps: false,
        toolbarSettings: {
            toolbarExtraButtons: [
                {
                    text: 'SALVA MODIFICHE',
                    class: 'btn btn-success',
                    event: () => {
                        this.saveCraZonaEmergenza();
                    }
                }
            ],
        }
    };

    craZonaEmergenzaForm: FormGroup;


    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store,
                private formBuilder: FormBuilder,
                private modalService: NgbModal) {
        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
        this.getDoa();

        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }
        this.store.dispatch(new GetZonaEmergenzaById(this.idZonaEmergenza));
        this.initForm();
    }

    get f(): any {
        return this.craZonaEmergenzaForm?.controls;
    }

    ngOnInit(): void {
        this.store.dispatch([
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        this.store.dispatch([
            new SetSediNavbarVisible()
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
                    if (this.zonaEmergenzaById.cra) {
                        this.patchForm();
                    }
                }
            })
        );
    }

    getDoa(): void {
        this.subscriptions.add(
            this.doa$.subscribe((doa: Doa[]) => {
                this.doa = doa;
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
            listaDoa: [null],
        });
    }

    patchForm(): void {
        this.craZonaEmergenzaForm.patchValue({
            nome: this.zonaEmergenzaById.cra.nome,
            indirizzo: this.zonaEmergenzaById.cra.indirizzo,
            latitudine: this.zonaEmergenzaById.cra.coordinate?.latitudine,
            longitudine: this.zonaEmergenzaById.cra.coordinate?.longitudine,
            comandanteRegionale: this.zonaEmergenzaById.dirigenti[0],
            responsabileDistrettoAreaColpita: this.zonaEmergenzaById.dirigenti[1],
            responsabile: this.zonaEmergenzaById.dirigenti[2],
            responsabileCampiBaseMezziOperativi: this.zonaEmergenzaById.dirigenti[3],
            responsabileGestionePersonaleContratti: this.zonaEmergenzaById.dirigenti[4],
            listaDoa: this.zonaEmergenzaById.cra.listaDoa,
        });
    }

    onAddDoa(): void {
        const inserisciDoaModal = this.modalService.open(DoaModalComponent, {
            windowClass: 'modal-holder',
            size: 'lg',
            centered: true
        });

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

    addDoa(doa: DoaForm): void {
        this.store.dispatch(new AddDoa(doa));
    }

    deleteDoa(codiceDoa: string): void {
        this.store.dispatch(new DeleteDoa(codiceDoa));
    }

    saveCraZonaEmergenza(): void {
        if (this.craZonaEmergenzaForm.valid) {
            this.store.dispatch(new SaveCraZonaEmergenza());
        }
    }
}
