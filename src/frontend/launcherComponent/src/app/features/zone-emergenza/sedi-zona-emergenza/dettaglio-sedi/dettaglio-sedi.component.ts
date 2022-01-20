import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { EventoEmergenza, ZonaEmergenza } from '../../model/zona-emergenza.model';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { RoutesPath } from '../../../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { Observable, Subscription } from 'rxjs';
import { GetTipologieEmergenza, GetZonaEmergenzaById } from '../../store/actions/zone-emergenza/zone-emergenza.actions';
import { StopBigLoading } from '../../../../shared/store/actions/loading/loading.actions';
import { ZoneEmergenzaState } from '../../store/states/zone-emergenza/zone-emergenza.state';
import { ViewportState } from '../../../../shared/store/states/viewport/viewport.state';
import { ResetForm } from '@ngxs/form-plugin';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { Doa } from '../../interface/doa.interface';
import { Pca } from '../../interface/pca.interface';

@Component({
    selector: 'app-dettaglio-sedi-zona-emergenza',
    templateUrl: './dettaglio-sedi.component.html',
    styleUrls: ['./dettaglio-sedi.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class DettaglioSediComponent implements OnInit, OnDestroy {

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;
    @Select(ZoneEmergenzaState.zonaEmergenzaById) zonaEmergenzaById$: Observable<ZonaEmergenza>;
    zonaEmergenzaById: ZonaEmergenza;

    idZonaEmergenza: string;

    tConfig = {
        hasAllCheckBox: false,
        hasFilter: true,
        hasCollapseExpand: false,
        decoupleChildFromParent: false,
        maxHeight: 500
    } as TreeviewConfig;
    tItems: TreeviewItem[];


    private subscriptions: Subscription = new Subscription();

    constructor(private route: ActivatedRoute,
                private store: Store) {
        this.idZonaEmergenza = this.route.snapshot.paramMap.get('id');
        if (!this.idZonaEmergenza) {
            this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
        }

        this.store.dispatch(new GetZonaEmergenzaById(this.idZonaEmergenza));

        this.getDoubleMonitorMode();
        this.getZonaEmergenzaById();
    }

    ngOnInit(): void {
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

                    if (!this.getEventiCreazioneCraZonaEmergenza()?.length) {
                        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza + '/create-sedi/' + this.zonaEmergenzaById.id]));
                    } else {
                        this.createCRATreeview();
                    }
                }
            })
        );
    }

    getEventiCreazioneCraZonaEmergenza(): EventoEmergenza[] {
        return this.zonaEmergenzaById?.listaEventi.filter((e: EventoEmergenza) => e.tipoEvento === 'CreazioneCra');
    }

    createCRATreeview(): void {
        const eventiCreazioneCra = this.getEventiCreazioneCraZonaEmergenza();
        this.tItems = [];
        eventiCreazioneCra?.forEach((evento: EventoEmergenza, indexCra: number) => {
            this.tItems.push(
                new TreeviewItem({
                    value: '' + indexCra,
                    text: evento.cra.nome,
                    children: evento.cra.listaDoa?.map((doa: Doa, indexDoa: number) => {
                        return {
                            value: '' + indexCra + '-' + indexDoa,
                            text: doa.nome,
                            children: doa.listaPca?.map((pca: Pca, indexPca: number) => {
                                return {
                                    value: '' + indexCra + '-' + indexDoa + '-' + indexPca,
                                    text: pca.nome
                                };
                            })
                        };
                    })
                })
            );
        });
    }

    goToGestioneEmergenze(): void {
        this.store.dispatch(new Navigate(['/' + RoutesPath.ZoneEmergenza]));
    }
}
