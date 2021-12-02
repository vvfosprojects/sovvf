import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventoEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { GetTipologieEmergenza, GetZonaEmergenzaById, SetEventoRichiestaGestitoZonaEmergenza, UpdateModuliMobImmediataZonaEmergenza } from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { ModuliColonnaMobileModalComponent } from '../moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
import { ModuloColonnaMobile } from '../interface/modulo-colonna-mobile.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { makeCopy } from '../../../shared/helper/function-generiche';

@Component({
    selector: 'app-dettaglio-zona-emergenza',
    templateUrl: './dettaglio-zona-emergenza.component.html',
    styleUrls: ['./dettaglio-zona-emergenza.component.css']
})
export class DettaglioZonaEmergenzaComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;
    @Select(SediTreeviewState.isDirRegionale) isDirRegionale$: Observable<boolean>;
    isDirRegionale: boolean;
    @Select(SediTreeviewState.isCON) isCON$: Observable<boolean>;
    isCON: boolean;

    idZonaEmergenza: string;

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store,
                private modalService: NgbModal) {
        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
        this.getIsDirRegionale();
        this.getIsCon();

        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }

        this.store.dispatch([
            new GetZonaEmergenzaById(this.idZonaEmergenza),
            new GetTipologieEmergenza()
        ]);
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
                }
            })
        );
    }

    getIsDirRegionale(): void {
        this.subscriptions.add(
            this.isDirRegionale$.subscribe((isDirRegionale: boolean) => {
                this.isDirRegionale = isDirRegionale;
            })
        );
    }

    getIsCon(): void {
        this.subscriptions.add(
            this.isCON$.subscribe((isCON: boolean) => {
                this.isCON = isCON;
            })
        );
    }

    getEventiRichiesteZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaEmergenza' && !e.gestita);
    }

    onColonneMobili(evento: EventoEmergenza): void {
        const colonneMobiliEmergenzaModal = this.modalService.open(ModuliColonnaMobileModalComponent, {
            windowClass: 'modal-holder xxlModal',
            centered: true
        });

        colonneMobiliEmergenzaModal.componentInstance.zonaEmergenza = this.zonaEmergenzaById;
        colonneMobiliEmergenzaModal.componentInstance.fase = '1';
        colonneMobiliEmergenzaModal.componentInstance.moduliMobImmediataRichiesti = evento.tipologiaModuli;

        colonneMobiliEmergenzaModal.result.then((result: { esito: string, moduliSelezionati: ModuloColonnaMobile[], fase: string }) => {
            switch (result.esito) {
                case 'ok':
                    switch (result.fase) {
                        case '1':
                            const eventoCopy = makeCopy(evento);
                            const eventoGestito = eventoCopy;
                            eventoGestito.gestita = true;
                            this.store.dispatch([
                                new UpdateModuliMobImmediataZonaEmergenza(this.zonaEmergenzaById, result.moduliSelezionati),
                                new SetEventoRichiestaGestitoZonaEmergenza(eventoGestito)
                            ]);
                            break;
                    }
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
        });
    }

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
