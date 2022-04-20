import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostListener, isDevMode, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from './shared/store/states/app/app.state';
import { OFFSET_SYNC_TIME } from './core/settings/referral-time';
import { Ruolo, Utente } from './shared/model/utente.model';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
import { PermissionFeatures } from './shared/enum/permission-features.enum';
import { PermessiService } from './core/service/permessi-service/permessi.service';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { AuthService } from './core/auth/auth.service';
import { VersionCheckService } from './core/service/version-check/version-check.service';
import { SetAvailHeight, SetContentHeight, SetInnerWidth } from './shared/store/actions/viewport/viewport.actions';
import { Images } from './shared/enum/images.enum';
import { AuthState } from './features/auth/store/auth.state';
import { LSNAME } from './core/settings/config';
import { Logout, SetCurrentJwt, SetCurrentUser, SetLoggedCas } from './features/auth/store/auth.actions';
import { GetImpostazioniLocalStorage } from './shared/store/actions/impostazioni/impostazioni.actions';
import { ViewComponentState } from './features/home/store/states/view/view.state';
import { ViewComponentStateModel, ViewInterfaceButton, ViewLayouts } from './shared/interface/view.interface';
import { ImpostazioniState } from './shared/store/states/impostazioni/impostazioni.state';
import { ViewportState } from './shared/store/states/viewport/viewport.state';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { GetDataNavbar, ToggleSidebarOpened } from './features/navbar/store/actions/navbar.actions';
import { NavbarState } from './features/navbar/store/states/navbar.state';
import { NotificheState } from './shared/store/states/notifiche/notifiche.state';
import { NotificaInterface } from './shared/interface/notifica.interface';
import { RouterState } from '@ngxs/router-plugin';
import { ChangeView } from './features/home/store/actions/view/view.actions';
import { AppFeatures } from './shared/enum/app-features.enum';
import { ClearListaSediNavbar, PatchListaSediNavbar } from './shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { DeleteAllConcorrenza, GetConcorrenza } from './shared/store/actions/concorrenza/concorrenza.actions';
import { clearAllPagesSession } from './shared/helper/function-paginazione-session';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {

    private subscription = new Subscription();
    private imgs = [];
    private height;
    private availHeight;
    private width;
    private currentUrl: string;

    @Select(ViewComponentState.viewComponent) viewState$: Observable<ViewLayouts>;
    viewState: ViewLayouts;
    @Select(ViewComponentState.colorButton) colorButton$: Observable<ViewInterfaceButton>;
    backupView: ViewComponentStateModel;

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    private listeSediLoaded: boolean;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    @Select(ViewportState.doubleMonitor) doubleMonitor$: Observable<boolean>;
    doubleMonitor: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;
    @Select(AppState.vistaSedi) vistaSedi$: Observable<string[]>;
    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;

    @Select(RouterState.url) url$: Observable<string>;
    url: string;

    @Select(NotificheState.listaNotifiche) listaNotifiche$: Observable<NotificaInterface[]>;
    @Select(NotificheState.nuoveNotifiche) nuoveNotifiche$: Observable<number>;

    @Select(NavbarState.sidebarOpened) sidebarOpened$: Observable<boolean>;
    sidebarOpened: boolean;

    permissionFeatures = PermissionFeatures;
    RoutesPath = RoutesPath;
    animateSidebar = false;

    ngxLoaderConfiguration: any = {};

    @ViewChild('contentElement', { read: ElementRef }) contentElement: ElementRef;

    @HostListener('window:resize')
    onResize(): void {
        this.getHeight();
        this.getWidth();
    }

    constructor(private router: Router,
                private authService: AuthService,
                private store: Store,
                private permessiService: PermessiService,
                private versionCheckService: VersionCheckService,
                private render: Renderer2,
                private ngbAccordionconfig: NgbAccordionConfig,
                private cdRef: ChangeDetectorRef) {
        ngbAccordionconfig.type = 'dark';
        clearAllPagesSession();
        this.getUrl();
        this.getSidebarOpened();
        this.getNightMode();
        this.getDoubleMonitorMode();
        this.getRouterEvents();
        this.getViewState();
        this.getBackupView();
        this.getImpostazioniLocalStorage();
        this.getSessionData();
        this.initSubscription();
    }

    ngOnInit(): void {
        // tslint:disable-next-line:no-unused-expression
        !isDevMode() && this.versionCheckService.initVersionCheck(3);
        this.preloadImage(Images.Disconnected);
        this.setLoaderPosition();
    }

    ngAfterViewChecked(): void {
        this.getHeight();
        this.getWidth();
        this.animateSidebar = true;
        this.cdRef.detectChanges();
    }

    @HostListener('window:beforeunload')
    async ngOnDestroy(): Promise<any> {
        this.store.dispatch(new DeleteAllConcorrenza());
        this.subscription.unsubscribe();
    }

    getUrl(): void {
        this.subscription.add(
            this.url$.subscribe((url: string) => {
                this.url = url;
                if ((url && url !== '/login' && url !== '/auth/caslogout' && url !== '/selezione-sede' && url.indexOf('/auth?ticket=') === -1)) {
                    if (this.user) {
                        this.store.dispatch([
                            new GetDataNavbar(),
                            new GetConcorrenza()
                        ]);
                    }
                }
                this.store.dispatch(new ToggleSidebarOpened(false));
            })
        );
    }

    getRouterEvents(): void {
        this.subscription.add(
            this.router.events.subscribe((val) => {
                if (val instanceof NavigationEnd) {
                    this.currentUrl = val.urlAfterRedirects.slice(1);
                }
            })
        );
    }

    getSidebarOpened(): void {
        this.subscription.add(
            this.sidebarOpened$.subscribe((sidebarOpened: boolean) => {
                this.sidebarOpened = sidebarOpened;
            })
        );
    }

    getNightMode(): void {
        this.subscription.add(
            this.nightMode$.subscribe((nightMode: boolean) => {
                this.nightMode = nightMode;
                const body = document.querySelectorAll('body')[0];
                if (!this.nightMode) {
                    this.render.addClass(body, 'sun-mode');
                    this.render.removeClass(body, 'moon-mode');
                } else {
                    this.render.addClass(body, 'moon-mode');
                    this.render.removeClass(body, 'sun-mode');
                }
            })
        );
    }

    getDoubleMonitorMode(): void {
        this.subscription.add(
            this.doubleMonitor$.subscribe((doubleMonitor: boolean) => {
                this.doubleMonitor = doubleMonitor;
                const body = document.querySelectorAll('body')[0];
                if (!this.doubleMonitor) {
                    this.render.addClass(body, 'single-monitor');
                    this.render.removeClass(body, 'double-monitor');
                } else {
                    this.render.addClass(body, 'double-monitor');
                    this.render.removeClass(body, 'single-monitor');
                }
            })
        );
    }

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => {
            this.viewState = r;
        }));
    }

    getBackupView(): void {
        this.subscription.add(this.colorButton$.subscribe(r => {
            this.backupView = r ? r.backupViewComponent : null;
        }));
    }

    getImpostazioniLocalStorage(): void {
        this.store.dispatch(new GetImpostazioniLocalStorage());
    }

    toggleSidebar(value?: boolean): void {
        this.store.dispatch(new ToggleSidebarOpened(value));
    }

    onLogout(): void {
        const homeUrl = this.store.selectSnapshot(RouterState.url);
        this.store.dispatch(new Logout(homeUrl));
    }

    private initSubscription(): void {
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
        this.subscription.add(this.user$.subscribe((user: Utente) => {
            this.user = user;
            if (!user) {
                this.store.dispatch(new ClearListaSediNavbar());
            }
        }));
        this.subscription.add(
            this.listeSediLoaded$.subscribe((r: boolean) => {
                this.listeSediLoaded = r;
                const cS = sessionStorage.getItem(LSNAME.cacheSedi);
                const cSArray = JSON.parse(cS) as string[];
                if (this.listeSediLoaded && this.user && cS) {
                    this.store.dispatch(new PatchListaSediNavbar(cSArray));
                }
            })
        );
        this.subscription.add(this.vistaSedi$.subscribe(r => {
            if (r) {
                console.log('r', r);
                this.store.dispatch(new PatchListaSediNavbar([...r]));
            }
        }));
    }

    private getHeight(): void {
        const availHeight = window.innerHeight;
        const height = this.contentElement.nativeElement.offsetHeight;
        if (height) {
            if (this.height !== height) {
                this.height = height;
                this.store.dispatch(new SetContentHeight(height));
            }
        }
        if (availHeight) {
            if (this.availHeight !== availHeight) {
                this.availHeight = availHeight;
                this.store.dispatch(new SetAvailHeight(availHeight));
            }
        }
    }

    private getWidth(): void {
        const innerWidth = window.innerWidth;
        if (innerWidth) {
            if (this.width !== innerWidth) {
                this.width = innerWidth;
                const maxInnerWidthDoubleMonitor = this.store.selectSnapshot(ViewportState.maxInnerWidthDoubleMonitor);
                this.store.dispatch(new SetInnerWidth(innerWidth));
                this.setLoaderPosition();
                if (this.viewState?.mappa?.active && this.backupView && (innerWidth > maxInnerWidthDoubleMonitor)) {
                    if (this.backupView.view.richieste.active) {
                        this.store.dispatch(new ChangeView(AppFeatures.Richieste));
                    } else if (this.backupView.view.mezziInServizio.active) {
                        this.store.dispatch(new ChangeView(AppFeatures.MezziInServizio));
                    }
                }
            }
        }
    }

    private preloadImage(...args: string[]): void {
        for (let i = 0; i < args.length; i++) {
            this.imgs[i] = new Image();
            this.imgs[i].src = args[i];
        }
    }

    private getSessionData(): void {
        const sessionToken = JSON.parse(sessionStorage.getItem(LSNAME.token));
        const sessionCurrentUser = JSON.parse(sessionStorage.getItem(LSNAME.currentUser));
        const casLogin = JSON.parse(sessionStorage.getItem(LSNAME.casLogin));
        if (sessionToken) {
            this.store.dispatch(new SetCurrentJwt(sessionToken));
        }
        if (sessionCurrentUser) {
            this.store.dispatch(new SetCurrentUser(sessionCurrentUser));
        }
        if (casLogin) {
            this.store.dispatch(new SetLoggedCas());
        }
    }

    private setLoaderPosition(): void {
        const innerWidth = window.innerWidth;
        let config: any;
        if (innerWidth && innerWidth > 3700) {
            config = {
                hasProgressBar: false,
                overlayColor: 'rgb(52,58,64)',
                logoUrl: '../assets/img/logo_vvf_200x.png',
                logoSize: 300,
                logoPosition: 'center-center loader-position-img-left',
                fgsColor: '#FFFFFF',
                fgsPosition: 'center-center loader-position-fgs-left',
                fgsSize: 50,
                gap: '60',
                text: 'ATTENDI, STO CARICANDO I DATI...',
                textColor: '#FFFFFF',
                textPosition: 'top-center loader-position-left'
            };
        } else {
            config = {
                hasProgressBar: false,
                overlayColor: 'rgb(52,58,64)',
                logoUrl: '../assets/img/logo_vvf_200x.png',
                logoSize: 300,
                logoPosition: 'center-center',
                fgsColor: '#FFFFFF',
                fgsPosition: 'center-center',
                fgsSize: 50,
                gap: '60',
                text: 'ATTENDI, STO CARICANDO I DATI...',
                textColor: '#FFFFFF',
                textPosition: 'top-center'
            };
        }
        this.ngxLoaderConfiguration = config;
    }
}
