import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EventoEmergenza, ZonaEmergenza } from '../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import {
    GetTipologieEmergenza,
    GetZonaEmergenzaById,
    RequestCra,
    RequestTipologieModuli,
    SetFiltriAttiviGeneriModuliColonnaMobile,
    SetFiltriAttiviStatiModuliColonnaMobile,
    SetFiltriGeneriModuliColonnaMobile,
    SetFiltriStatiModuliColonnaMobile,
    UpdateModuliMobImmediataZonaEmergenza
} from '../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../shared/store/states/viewport/viewport.state';
import { SediTreeviewState } from '../../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { ModuliColonnaMobileModalComponent } from '../moduli-colonna-mobile-modal/moduli-colonna-mobile-modal.component';
import { ModuloColonnaMobile } from '../interface/modulo-colonna-mobile.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { makeCopy } from '../../../shared/helper/function-generiche';
import { RichiestaModuliModalComponent } from '../richiesta-moduli-modal/richiesta-moduli-modal.component';
import { ResetForm } from '@ngxs/form-plugin';
import { RichiestaCraModalComponent } from '../richiesta-cra-modal/richiesta-cra-modal.component';
import { FiltriZonaEmergenzaInterface } from '../interface/filtri-zona-emergenza.interface';

@Component({
    selector: 'app-dettaglio-zona-emergenza',
    templateUrl: './dettaglio-zona-emergenza.component.html',
    styleUrls: ['./dettaglio-zona-emergenza.component.css']
})
export class DettaglioZonaEmergenzaComponent implements OnInit, OnChanges, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;
    @Select(ZoneEmergenzaState.filtri) filtri$: Observable<FiltriZonaEmergenzaInterface>;
    filtri: FiltriZonaEmergenzaInterface;
    @Select(ZoneEmergenzaState.filtriAttivi) filtriAttivi$: Observable<FiltriZonaEmergenzaInterface>;
    filtriAttivi: FiltriZonaEmergenzaInterface;
    @Select(ZoneEmergenzaState.listaModuliImmediataZonaEmergenzaById) listaModuliImmediataZonaEmergenzaById$: Observable<ModuloColonnaMobile[]>;
    listaModuliImmediataZonaEmergenzaById: ModuloColonnaMobile[];
    listaModuliImmediataZonaEmergenzaByIdFiltered: ModuloColonnaMobile[];
    @Select(SediTreeviewState.isDirRegionale) isDirRegionale$: Observable<boolean>;
    isDirRegionale: boolean;
    @Select(SediTreeviewState.isCON) isCON$: Observable<boolean>;
    isCON: boolean;

    idZonaEmergenza: string;

    activeIdNavRichiesteModuli = 1;
    activeIdNavModuliAssegnati = 1;
    moduliAssegnatiExpanded: boolean;

    statiModuliGraphData: any[];
    generiModuliGraphData: any[];
    comandiModuliGraphData: any[];

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };
    gradient = true;
    showLegend = false;
    showLabels = true;
    isDoughnut = false;
    legendPosition = 'right';

    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store,
                private modalService: NgbModal) {
        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
        this.getFiltri();
        this.getFiltriAttivi();
        this.getListaModuliImmediataZonaEmergenzaById();
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

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.activeIdNavModuliAssegnati.currentValue) {
            console.log('test');
        }
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

    getFiltri(): void {
        this.subscriptions.add(
            this.filtri$.subscribe((filtri: FiltriZonaEmergenzaInterface) => {
                if (filtri) {
                    this.filtri = filtri;
                }
            })
        );
    }

    getFiltriAttivi(): void {
        this.subscriptions.add(
            this.filtriAttivi$.subscribe((filtriAttivi: FiltriZonaEmergenzaInterface) => {
                if (filtriAttivi) {
                    this.filtriAttivi = filtriAttivi;
                    const statiModuliColonnaMobile = filtriAttivi.statiModuliColonnaMobile;
                    const generiModuliColonnaMobile = filtriAttivi.generiModuliColonnaMobile;
                    if (!statiModuliColonnaMobile?.length && !generiModuliColonnaMobile?.length) {
                        this.listaModuliImmediataZonaEmergenzaByIdFiltered = this.listaModuliImmediataZonaEmergenzaById;
                    }
                    if (statiModuliColonnaMobile?.length && generiModuliColonnaMobile?.length) {
                        // tslint:disable-next-line:max-line-length
                        this.listaModuliImmediataZonaEmergenzaByIdFiltered = this.listaModuliImmediataZonaEmergenzaById.filter((moduloColonnaMobile: ModuloColonnaMobile) => statiModuliColonnaMobile.includes(moduloColonnaMobile.stato) && generiModuliColonnaMobile.includes(moduloColonnaMobile.nomeModulo));
                    }
                    if (statiModuliColonnaMobile?.length && !generiModuliColonnaMobile?.length) {
                        this.listaModuliImmediataZonaEmergenzaByIdFiltered = this.listaModuliImmediataZonaEmergenzaById.filter((moduloColonnaMobile: ModuloColonnaMobile) => statiModuliColonnaMobile.includes(moduloColonnaMobile.stato));
                    }
                    if (generiModuliColonnaMobile?.length && !statiModuliColonnaMobile?.length) {
                        this.listaModuliImmediataZonaEmergenzaByIdFiltered = this.listaModuliImmediataZonaEmergenzaById.filter((moduloColonnaMobile: ModuloColonnaMobile) => generiModuliColonnaMobile.includes(moduloColonnaMobile.nomeModulo));
                    }
                }
            })
        );
    }

    getListaModuliImmediataZonaEmergenzaById(): void {
        this.subscriptions.add(
            this.listaModuliImmediataZonaEmergenzaById$.subscribe((listaModuliImmediataZonaEmergenzaById: ModuloColonnaMobile[]) => {
                if (listaModuliImmediataZonaEmergenzaById?.length) {
                    this.listaModuliImmediataZonaEmergenzaById = listaModuliImmediataZonaEmergenzaById;
                    this.resetListaModuliImmediataZonaEmergenzaById();
                    this.setStatiModuliGraphData();
                    this.setGeneriModuliGraphData();
                    this.setComandiModuliGraphData();
                    const uniqueStati = [...new Set(listaModuliImmediataZonaEmergenzaById.map((item: ModuloColonnaMobile) => item.stato))];
                    const uniqueGeneri = [...new Set(listaModuliImmediataZonaEmergenzaById.map((item: ModuloColonnaMobile) => item.nomeModulo))];
                    this.store.dispatch([
                        new SetFiltriStatiModuliColonnaMobile(uniqueStati),
                        new SetFiltriGeneriModuliColonnaMobile(uniqueGeneri)
                    ]);
                }
            })
        );
    }

    resetListaModuliImmediataZonaEmergenzaById(): void {
        this.listaModuliImmediataZonaEmergenzaByIdFiltered = this.listaModuliImmediataZonaEmergenzaById;
    }

    onToggleModuliAssegnati(): void {
        this.moduliAssegnatiExpanded = !this.moduliAssegnatiExpanded;
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

    getEventi(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi;
    }

    getEventiRichiesteZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaEmergenza' && !e.gestita);
    }

    getEventiRichiesteGestiteZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaEmergenza' && e.gestita);
    }

    getEventiRichiestaCreazioneCraZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaCreazioneCRA' && !e.gestita);
    }

    getEventiRichiestaCreazioneGestitiCraZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'RichiestaCreazioneCRA' && e.gestita);
    }

    onChangeFiltroStatoColonnaMobile(statiModuliColonnaMobile: string[]): void {
        this.store.dispatch(new SetFiltriAttiviStatiModuliColonnaMobile(statiModuliColonnaMobile));
    }

    onChangeFiltroGenereColonnaMobile(generiModuliColonnaMobile: string[]): void {
        this.store.dispatch(new SetFiltriAttiviGeneriModuliColonnaMobile(generiModuliColonnaMobile));
    }

    onColonneMobili(evento?: EventoEmergenza): void {
        const colonneMobiliEmergenzaModal = this.modalService.open(ModuliColonnaMobileModalComponent, {
            windowClass: 'modal-holder xxlModal',
            centered: true
        });

        colonneMobiliEmergenzaModal.componentInstance.zonaEmergenza = this.zonaEmergenzaById;
        colonneMobiliEmergenzaModal.componentInstance.fase = '1';
        colonneMobiliEmergenzaModal.componentInstance.moduliMobImmediataRichiesti = evento ? evento.tipologiaModuli : 'all';

        colonneMobiliEmergenzaModal.result.then((result: { esito: string, moduliSelezionati: ModuloColonnaMobile[], fase: string }) => {
            switch (result.esito) {
                case 'ok':
                    switch (result.fase) {
                        case '1':
                            const eventoCopy = evento ? makeCopy(evento) : null;
                            const eventoGestito = eventoCopy ? eventoCopy : null;
                            if (eventoGestito) {
                                eventoGestito.gestita = true;
                            }
                            this.store.dispatch(new UpdateModuliMobImmediataZonaEmergenza(this.zonaEmergenzaById, result.moduliSelezionati, eventoGestito));
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

    onRichiestaCra(): void {
        if (this.isCON || this.isDirRegionale) {
            return;
        }

        const richiestaModuliEmergenzaModal = this.modalService.open(RichiestaCraModalComponent, {
            windowClass: 'modal-holder',
            centered: true
        });

        richiestaModuliEmergenzaModal.componentInstance.zonaEmergenza = this.zonaEmergenzaById;

        richiestaModuliEmergenzaModal.result.then((esito: string) => {
            switch (esito) {
                case 'ok':
                    this.store.dispatch(new RequestCra());
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
            this.store.dispatch(new ResetForm({ path: 'zoneEmergenza.richiestaCraDoaZonaEmergenzaForm' }));
        });
    }

    onCreazioneSedi(eventoRichiestaCra: EventoEmergenza): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza + '/create-sedi/' + this.zonaEmergenzaById.id + '/' + eventoRichiestaCra.istante]));
    }

    onVisualizzaSedi(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza + '/detail-sedi/' + this.zonaEmergenzaById.id]));
    }

    reducerRichiestaModuli(): void {
        if (this.isCON || this.isDirRegionale) {
            return;
        }

        const richiestaModuliEmergenzaModal = this.modalService.open(RichiestaModuliModalComponent, {
            windowClass: 'modal-holder',
            centered: true
        });

        const tipologieEmergenza = this.store.selectSnapshot(ZoneEmergenzaState.tipologieZonaEmergenza);

        richiestaModuliEmergenzaModal.componentInstance.zonaEmergenza = this.zonaEmergenzaById;
        richiestaModuliEmergenzaModal.componentInstance.tipologieEmergenza = tipologieEmergenza;

        richiestaModuliEmergenzaModal.result.then((esito: string) => {
            switch (esito) {
                case 'ok':
                    this.store.dispatch(new RequestTipologieModuli());
                    break;
                case 'ko':
                    break;
                default:
                    break;
            }
            this.store.dispatch(new ResetForm({ path: 'zoneEmergenza.richiestaModuliZonaEmergenzaForm' }));
        });
    }

    setStatiModuliGraphData(): any {
        const uniqueStati = [...new Set(this.listaModuliImmediataZonaEmergenzaById.map((item: ModuloColonnaMobile) => item.stato))];
        const graphData = [];
        if (uniqueStati?.length) {
            uniqueStati.forEach((stato: string) => {
                graphData.push({
                    name: stato,
                    value: this.listaModuliImmediataZonaEmergenzaById.filter((item: ModuloColonnaMobile) => item.stato === stato).length
                });
            });
        }
        this.statiModuliGraphData = graphData;
    }

    setGeneriModuliGraphData(): any {
        const uniqueGeneri = [...new Set(this.listaModuliImmediataZonaEmergenzaById.map((item: ModuloColonnaMobile) => item.nomeModulo))];
        const graphData = [];
        if (uniqueGeneri?.length) {
            uniqueGeneri.forEach((genere: string) => {
                graphData.push({
                    name: genere,
                    value: this.listaModuliImmediataZonaEmergenzaById.filter((item: ModuloColonnaMobile) => item.nomeModulo === genere).length
                });
            });
        }
        this.generiModuliGraphData = graphData;
    }

    setComandiModuliGraphData(): any {
        const uniqueComandi = [...new Set(this.listaModuliImmediataZonaEmergenzaById.map((item: ModuloColonnaMobile) => item.codComando))];
        const graphData = [];
        if (uniqueComandi?.length) {
            uniqueComandi.forEach((codComando: string) => {
                graphData.push({
                    name: codComando,
                    value: this.listaModuliImmediataZonaEmergenzaById.filter((item: ModuloColonnaMobile) => item.codComando === codComando).length
                });
            });
        }
        this.comandiModuliGraphData = graphData;
    }

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
