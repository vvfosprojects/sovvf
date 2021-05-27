import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno.state';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { TurnoExtra } from './turno/model/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar, ToggleSidebarOpened } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TurnoCalendario } from './turno/model/turno-calendario.model';
import { calcolaTurnoCalendario } from 'src/app/shared/helper/calcola-turno';
import { SetTurnoCalendario } from './store/actions/turno.actions';
import { AuthService } from '../../core/auth/auth.service';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { ViewComponentState } from '../home/store/states/view/view.state';
import { PermissionFeatures } from '../../shared/enum/permission-features.enum';
import { ToggleCodaChiamate, ToggleMezziInServizio, ToggleModifica, ToggleSchedeContatto, TurnOffComposizione } from '../home/store/actions/view/view.actions';
import { ViewInterfaceButton } from '../../shared/interface/view.interface';
import { ClearRichiestaModifica } from '../home/store/actions/form-richiesta/richiesta-modifica.actions';
import { ClearComposizioneAvanzata } from '../home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { ClearComposizioneVeloce } from '../home/store/actions/composizione-partenza/composizione-veloce.actions';
import { AnnullaChiamata } from '../home/store/actions/form-richiesta/scheda-telefonata.actions';
import { NotificheState } from '../../shared/store/states/notifiche/notifiche.state';
import { NotificaInterface } from '../../shared/interface/notifica.interface';
import { SetNotificheLette } from '../../shared/store/actions/notifiche/notifiche.actions';
import { NavbarState } from './store/states/navbar.state';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;
    @Select(TurnoState.turnoExtra) turnoExtra$: Observable<TurnoExtra>;
    turnoExtra: TurnoExtra;

    @Select(SediTreeviewState.listeSediNavbarLoaded) listeSediNavbarLoaded$: Observable<boolean>;

    @Select(RouterState.url) url$: Observable<string>;
    url: string;

    @Select(NotificheState.listaNotifiche) listaNotifiche$: Observable<NotificaInterface[]>;
    @Select(NotificheState.nuoveNotifiche) nuoveNotifiche$: Observable<number>;

    @Select(ViewComponentState.richiesteStatus) richiesteStatus$: Observable<boolean>;
    @Select(ViewComponentState.codaChiamateStatus) codaChiamateStatus$: Observable<boolean>;
    @Select(ViewComponentState.chiamataStatus) chiamataStatus$: Observable<boolean>;
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    @Select(ViewComponentState.mezziInServizioStatus) mezziInServizioStatus$: Observable<boolean>;
    @Select(ViewComponentState.schedeContattoStatus) schedeContattoStatus$: Observable<boolean>;

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];
    @Input() nightMode: boolean;
    @Input() disabledMezziInServizio: boolean;
    @Input() colorButtonView: ViewInterfaceButton;
    @Input() sidebarOpened: boolean;

    clock$: Observable<Date>;
    time: Date;

    colorButton = 'btn-dark';
    permessiFeature = PermissionFeatures;
    RoutesPath = RoutesPath;

    private subscription = new Subscription();

    constructor(private store: Store,
                private authenticationService: AuthService,
                private clock: ClockService) {
        this.setTime();
        this.getClock();
        this.getTurnoCalendario();
        this.getTurnoExtra();
        this.getUrl();
    }

    ngOnInit(): void {
        console.log('Componente Navbar creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Navbar distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch([
            new ToggleSidebarOpened(false),
            new ClearDataNavbar()
        ]);
    }

    getClock(): void {
        this.clock$ = this.clock.getClock();
        this.subscription.add(
            this.clock$.subscribe((tick: Date) => {
                this.time = tick;
                this.checkTurno();
            })
        );
    }

    setTime(): void {
        this.time = new Date();
    }

    getTurnoCalendario(): void {
        this.subscription.add(
            this.turnoCalendario$.subscribe((turnoC: TurnoCalendario) => {
                this.turnoCalendario = turnoC;
            })
        );
    }

    getTurnoExtra(): void {
        this.subscription.add(
            this.turnoExtra$.subscribe((turnoExtra: TurnoExtra) => {
                this.turnoExtra = turnoExtra;
                if (turnoExtra) {
                    this.colorButton = 'btn-danger';
                }
            })
        );
    }

    getUrl(): void {
        this.subscription.add(
            this.url$.subscribe((url: string) => {
                this.url = url;
                if ((url && url !== '/login' && url !== '/auth/caslogout' && url.indexOf('/auth?ticket=') === -1)) {
                    this.store.dispatch(new GetDataNavbar());
                }
            })
        );
    }

    checkTurno(): void {
        if (!this.turnoCalendario) {
            this.setTurno();
        } else {
            const turno = calcolaTurnoCalendario();
            if (this.turnoCalendario.corrente !== turno.corrente) {
                this.setTurno();
            }
        }
    }

    setTurno(): void {
        this.store.dispatch(new SetTurnoCalendario());
    }

    setNotificheLette(): void {
        this.store.dispatch(new SetNotificheLette());
    }

    onChiamateInterventi(): void {
        const codaChiamateStatus = this.store.selectSnapshot(ViewComponentState.codaChiamateStatus);
        const mezziInServizioStatus = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);
        const schedeContattoStatus = this.store.selectSnapshot(ViewComponentState.schedeContattoStatus);
        const chiamataStatus = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
        const modificaRichiestaStatus = this.store.selectSnapshot(ViewComponentState.modificaRichiestaStatus);
        const composizioneStatus = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
        if (codaChiamateStatus) {
            this.toggleCodaChiamate();
        } else if (mezziInServizioStatus) {
            this.toggleMezziInSerivizo();
        } else if (schedeContattoStatus) {
            this.toggleSchedeContatto();
        } else if (chiamataStatus) {
            this.toggleChiamataStatus();
        } else if (modificaRichiestaStatus) {
            this.toggleModificaRichiesta();
        } else if (composizioneStatus) {
            this.turnOffComposizionePartenza();
        }
    }

    onToggleSidebar(): void {
        const sidebarOpened = this.store.selectSnapshot(NavbarState.sidebarOpened);
        this.store.dispatch(new ToggleSidebarOpened(!sidebarOpened));
    }

    toggleMezziInSerivizo(): void {
        this.returnToHome();
        this.store.dispatch(new ToggleMezziInServizio());
    }

    toggleSchedeContatto(): void {
        this.returnToHome();
        this.store.dispatch(new ToggleSchedeContatto());
    }

    toggleCodaChiamate(): void {
        this.returnToHome();
        this.store.dispatch(new ToggleCodaChiamate());
    }

    toggleChiamataStatus(): void {
        this.returnToHome();
        this.store.dispatch(new AnnullaChiamata());
    }

    toggleModificaRichiesta(): void {
        this.returnToHome();
        this.store.dispatch([
            new ToggleModifica(),
            new ClearRichiestaModifica()
        ]);
    }

    turnOffComposizionePartenza(): void {
        this.returnToHome();
        this.store.dispatch([
            new TurnOffComposizione(),
            new ClearComposizioneAvanzata(),
            new ClearComposizioneVeloce()
        ]);
    }

    returnToHome(): void {
        this.store.dispatch([
            new Navigate([RoutesPath.Home])
        ]);
    }

}
