import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Grids, ViewInterfaceButton, ViewInterfaceMaps, ViewLayouts } from '../../shared/interface/view.interface';
import { Select, Store } from '@ngxs/store';
import { ViewComponentState } from './store/states/view/view.state';
import { Composizione } from '../../shared/enum/composizione.enum';
import { ClearDataHome, GetDataHome } from './store/actions/home.actions';
import { NavbarState } from '../navbar/store/states/navbar.state';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { ImpostazioniState } from '../../shared/store/states/impostazioni/impostazioni.state';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';
import { PaginationState } from '../../shared/store/states/pagination/pagination.state';
import { GetDettagliTipologie } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { GetDistaccamenti, GetSediAllerta, GetSediTrasferimenti } from '../../shared/store/actions/distaccamenti/distaccamenti.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { TastoChiamataMappaState } from '../maps/store/states/tasto-chiamata-mappa.state';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();
    viewState: ViewLayouts;
    columnState: Grids;

    @Select(NavbarState.navbarIsLoaded) navbarLoaded: Observable<boolean>;

    // Chiamata From Mappa Active Value
    @Select(TastoChiamataMappaState.tastoChiamataMappaActive) tastoChiamataMappaActive$: Observable<boolean>;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    @Select(ViewComponentState.columnGrid) columnState$: Observable<Grids>;
    @Select(ViewComponentState.composizioneMode) composizioneMode$: Observable<Composizione>;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;
    @Select(ViewComponentState.viewStateMaps) viewStateMappa$: Observable<ViewInterfaceMaps>;

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;

    @Select(ImpostazioniState.boxAttivi) boxAttivi$: Observable<boolean>;
    boxAttivi: boolean;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;

    constructor(private store: Store) {
        this.getDettagliTipologie(true);
        this.getViewState();
        this.getColumnState();
        this.getBoxAttivi();
        this.getTipologie();
        this.getDistaccamenti();
        this.getSediAllerta();
        this.getSediTrasferimenti();
    }

    ngOnInit(): void {
        console.log('Componente Home creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Home),
            new GetDataHome()
        ]);
    }

    ngOnDestroy(): void {
        console.log('Componente Home distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataHome());
    }

    getTipologie(): void {
        this.store.dispatch(new GetTipologie());
    }

    getDistaccamenti(): void {
        this.store.dispatch(new GetDistaccamenti());
    }

    getSediAllerta(): void {
        this.store.dispatch(new GetSediAllerta());
    }

    getSediTrasferimenti(): void {
        this.store.dispatch(new GetSediTrasferimenti());
    }

    getDettagliTipologie(pageAttuale: boolean): void {
        let page = null;
        if (pageAttuale) {
            page = this.store.selectSnapshot(PaginationState.page);
        }
        this.store.dispatch(new GetDettagliTipologie(page));
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    getColumnState(): void {
        this.subscription.add(this.columnState$.subscribe(r => this.columnState = r));
    }

    getBoxAttivi(): void {
        this.subscription.add(this.boxAttivi$.subscribe(bA => this.boxAttivi = bA));
    }

}
