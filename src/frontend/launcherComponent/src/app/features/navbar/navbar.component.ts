import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ClockService } from './clock/clock-service/clock.service';
import { Store, Select } from '@ngxs/store';
import { TurnoState } from './store/states/turno.state';
import { Ruolo, Utente } from '../../shared/model/utente.model';
import { TurnoExtra } from './turno/turno-extra.model';
import { ClearDataNavbar, GetDataNavbar } from './store/actions/navbar.actions';
import { SediTreeviewState } from '../../shared/store/states/sedi-treeview/sedi-treeview.state';
import { TurnoCalendario } from './turno/turno-calendario.model';
import { calcolaTurnoCalendario } from 'src/app/shared/helper/calcola-turno';
import { SetTurnoCalendario } from './store/actions/turno.actions';
import { AuthService } from '../../core/auth/auth.service';
import { NewVersionState } from '../../shared/store/states/nuova-versione/nuova-versione.state';
import { GetNewVersion, OpenModalNewFeaturesInfo, OpenModalNewVersionSoon } from '../../shared/store/actions/nuova-versione/nuova-versione.actions';
import { SetNotificheLette } from '../../shared/store/actions/notifiche/notifiche.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { Navigate, RouterState } from '@ngxs/router-plugin';
import { Logout } from '../auth/store/auth.actions';
import { ViewComponentState } from '../home/store/states/view/view.state';
import { PermissionFeatures } from '../../shared/enum/permission-features.enum';
import { ToggleChiamata, ToggleMezziInServizio, ToggleModifica, ToggleSchedeContatto, TurnOffComposizione } from '../home/store/actions/view/view.actions';
import { ViewInterfaceButton } from '../../shared/interface/view.interface';
import { ViewportState } from '../../shared/store/states/viewport/viewport.state';
import {SunMode} from '../../shared/store/actions/viewport/viewport.actions';
import { ClearRichiestaModifica } from '../home/store/actions/scheda-telefonata/richiesta-modifica.actions';
import { ClearComposizioneAvanzata } from '../home/store/actions/composizione-partenza/composizione-avanzata.actions';
import { ClearComposizioneVeloce } from '../home/store/actions/composizione-partenza/composizione-veloce.actions';
import { AnnullaChiamata } from '../home/store/actions/scheda-telefonata/chiamata.actions';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

    @Input() user: Utente;
    @Input() ruoliUtenteLoggato: Ruolo[];

    @Input() disabledMezziInServizio: boolean;
    @Input() colorButtonView: ViewInterfaceButton;

    @Select(ViewportState.sunMode) sunMode$: Observable<boolean>;
    sunMode: boolean;
    @Select(TurnoState.turnoCalendario) turnoCalendario$: Observable<TurnoCalendario>;
    turnoCalendario: TurnoCalendario;
    @Select(TurnoState.turnoExtra) turnoExtra$: Observable<TurnoExtra>;
    turnoExtra: TurnoExtra;
    @Select(NewVersionState.newVersion) newVersion$: Observable<boolean>;
    newVersion: boolean;
    @Select(NewVersionState.newVersionSoon) newVersionSoon$: Observable<boolean>;
    newVersionSoon: boolean;
    @Select(NewVersionState.newFeaturesInfo) newFeaturesInfo$: Observable<boolean>;
    newFeaturesInfo: boolean;

    @Select(SediTreeviewState.listeSediNavbarLoaded) listeSediNavbarLoaded$: Observable<boolean>;

    @Select(RouterState.url) url$: Observable<string>;
    url: string;

    @Select(ViewComponentState.richiesteStatus) richiesteStatus$: Observable<boolean>;
    @Select(ViewComponentState.chiamataStatus) chiamataStatus$: Observable<boolean>;
    @Select(ViewComponentState.composizioneStatus) composizioneStatus$: Observable<boolean>;
    @Select(ViewComponentState.mezziInServizioStatus) mezziInServizioStatus$: Observable<boolean>;
    @Select(ViewComponentState.schedeContattoStatus) schedeContattoStatus$: Observable<boolean>;

    clock$: Observable<Date>;
    time: Date;

    colorButton = 'btn-dark';
    permessiFeature = PermissionFeatures;
    RoutesPath = RoutesPath;

    private subscription = new Subscription();

    constructor(private store: Store,
                private authenticationService: AuthService,
                private clock: ClockService) {
        this.getSunMode();
        this.setTime();
        this.getClock();
        this.getTurnoCalendario();
        this.getTurnoExtra();
        this.getNewVersion();
        this.getNewVersionSoon();
        this.getNewFeaturesInfo();
        this.getUrl();
    }

    ngOnInit(): void {
        console.log('Componente Navbar creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Navbar distrutto');
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearDataNavbar());
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

    getSunMode(): void {
      this.subscription.add(
        this.sunMode$.subscribe((sunMode: boolean) => {
          this.sunMode = sunMode;
        })
      );
    }

    onSwitchSunMode(): void {
      this.store.dispatch(new SunMode());
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

    getNewVersion(): void {
        this.subscription.add(
            this.newVersion$.subscribe((newVersion: boolean) => {
                this.newVersion = newVersion;
            })
        );
    }

    getNewVersionSoon(): void {
        this.subscription.add(
            this.newVersionSoon$.subscribe((newVersionSoon: boolean) => {
                this.newVersionSoon = newVersionSoon;
            })
        );
    }

    getNewFeaturesInfo(): void {
        this.subscription.add(
            this.newFeaturesInfo$.subscribe((newFeaturesInfo: boolean) => {
                this.newFeaturesInfo = newFeaturesInfo;
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

    onGetNewVersion(): void {
        this.store.dispatch(new GetNewVersion());
    }

    onNewVersionSoon(): void {
        this.store.dispatch(new OpenModalNewVersionSoon());
    }

    onNewFeaturesInfo(): void {
        this.store.dispatch(new OpenModalNewFeaturesInfo());
    }

    setNotificheLette(): void {
        this.store.dispatch(new SetNotificheLette());
    }

    onChiamateInterventi(): void {
        const mezziInServizioStatus = this.store.selectSnapshot(ViewComponentState.mezziInServizioStatus);
        const schedeContattoStatus = this.store.selectSnapshot(ViewComponentState.schedeContattoStatus);
        const chiamataStatus = this.store.selectSnapshot(ViewComponentState.chiamataStatus);
        const modificaRichiestaStatus = this.store.selectSnapshot(ViewComponentState.modificaRichiestaStatus);
        const composizioneStatus = this.store.selectSnapshot(ViewComponentState.composizioneStatus);
        if (mezziInServizioStatus) {
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

    toggleMezziInSerivizo(): void {
        this.returnToHome();
        this.store.dispatch(new ToggleMezziInServizio());
    }

    toggleSchedeContatto(): void {
        this.returnToHome();
        this.store.dispatch(new ToggleSchedeContatto());
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

    logout(): void {
        const homeUrl = this.store.selectSnapshot(RouterState.url);
        this.store.dispatch(new Logout(homeUrl));
    }

}
