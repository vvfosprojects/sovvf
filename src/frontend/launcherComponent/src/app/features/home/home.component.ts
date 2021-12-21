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
import { GetAllDettagliTipologie } from '../../shared/store/actions/dettagli-tipologie/dettagli-tipologie.actions';
import { GetTipologie } from '../../shared/store/actions/tipologie/tipologie.actions';
import { GetDistaccamenti, GetSediAllerta, GetSediTrasferimenti } from '../../shared/store/actions/distaccamenti/distaccamenti.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { TastoChiamataMappaState } from '../maps/store/states/tasto-chiamata-mappa.state';
import { GetBoxPersonale } from './store/actions/boxes/box-personale.actions';
import { GetBoxMezzi } from './store/actions/boxes/box-mezzi.actions';
import { GetBoxRichieste } from './store/actions/boxes/box-richieste.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit, OnDestroy {

    private subscription = new Subscription();
    viewState: ViewLayouts;
    columnState: Grids;

    @Select(NavbarState.navbarIsLoaded) navbarLoaded: Observable<boolean>;

    @Select(SediTreeviewState.isDirRegionale) isDirRegionale$: Observable<boolean>;
    isDirRegionale: boolean;
    @Select(SediTreeviewState.isCON) isCON$: Observable<boolean>;
    isCON: boolean;

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
        this.getAllDettagliTipologie();
        this.getIsCON();
        this.getIsDirRegionale();
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
            new GetDataHome(),
            new GetBoxRichieste(),
            new GetBoxMezzi(),
            new GetBoxPersonale(),
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

    getAllDettagliTipologie(): void {
        this.store.dispatch(new GetAllDettagliTipologie());
    }

    getIsCON(): void {
        this.subscription.add(this.isCON$.subscribe(value => this.isCON = value));
    }

    getIsDirRegionale(): void {
        this.subscription.add(this.isDirRegionale$.subscribe(value => this.isDirRegionale = value));
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
