import {AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from './shared/store/states/app/app.state';
import { OFFSET_SYNC_TIME } from './core/settings/referral-time';
import { Ruolo, Utente } from './shared/model/utente.model';
import { ClearListaSediNavbar, PatchListaSediNavbar } from './shared/store/actions/sedi-treeview/sedi-treeview.actions';
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
import { SetCurrentJwt, SetCurrentUser, SetLoggedCas } from './features/auth/store/auth.actions';
import { GetImpostazioniLocalStorage } from './shared/store/actions/impostazioni/impostazioni.actions';
import { ViewComponentState } from './features/home/store/states/view/view.state';
import { ViewInterfaceButton, ViewLayouts } from './shared/interface/view.interface';
import {ImpostazioniState} from './shared/store/states/impostazioni/impostazioni.state';

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

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    private listeSediLoaded: boolean;

    @Select(ImpostazioniState.ModalitaNotte) nightMode$: Observable<boolean>;
    nightMode: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;
    @Select(AppState.vistaSedi) vistaSedi$: Observable<string[]>;
    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;

    permissionFeatures = PermissionFeatures;
    RoutesPath = RoutesPath;

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
                private render: Renderer2) {
        this.getNightMode();
        this.getRouterEvents();
        this.getViewState();
        this.getImpostazioniLocalStorage();
        this.getSessionData();
        this.initSubscription();
    }


    ngOnInit(): void {
        this.versionCheckService.initVersionCheck(3);
        this.preloadImage(Images.Disconnected);
        this.setLoaderPosition();
    }

    ngAfterViewChecked(): void {
        this.getHeight();
        this.getWidth();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
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

    getViewState(): void {
        this.subscription.add(this.viewState$.subscribe(r => this.viewState = r));
    }

    getImpostazioniLocalStorage(): void {
        this.store.dispatch(new GetImpostazioniLocalStorage());
    }

    private initSubscription(): void {
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
        this.subscription.add(this.user$.subscribe((user: Utente) => {
            this.user = user;
            if (user && user.sede) {
                if (this.listeSediLoaded) {
                    this.store.dispatch(
                        new PatchListaSediNavbar([user.sede.codice])
                    );
                }
            } else {
                this.store.dispatch(new ClearListaSediNavbar());
            }
        }));
        this.subscription.add(this.listeSediLoaded$.subscribe((r: boolean) => {
            this.listeSediLoaded = r;
            if (r) {
                this.store.dispatch(
                    new PatchListaSediNavbar([this.user.sede.codice])
                );
            }
        }));
        this.subscription.add(this.vistaSedi$.subscribe(r => r && this.store.dispatch(new PatchListaSediNavbar([...r]))));
    }

    private getHeight(): void {
        if (_isActive(this.currentUrl)) {
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

        function _isActive(currentUrl): boolean {
            switch (currentUrl) {
                case RoutesPath.Home:
                    return true;
                case RoutesPath.GestioneUtenti:
                    return true;
                case RoutesPath.TrasferimentoChiamata:
                    return true;
                case RoutesPath.Rubrica:
                    return true;
                case RoutesPath.Changelog:
                    return true;
                case RoutesPath.Impostazioni:
                    return true;
                default:
                    return false;
            }
        }
    }

    private getWidth(): void {
        if (_isActive(this.currentUrl)) {
            const innerWidth = window.innerWidth;
            if (innerWidth) {
                if (this.width !== innerWidth) {
                    this.width = innerWidth;
                    this.store.dispatch(new SetInnerWidth(innerWidth));
                }
            }
        }

        function _isActive(currentUrl): boolean {
            switch (currentUrl) {
                case RoutesPath.Home:
                    return true;
                default:
                    return false;
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
                overlayColor: 'rgba(206,43,55,0.85)',
                logoUrl: '../assets/img/logo_vvf_200x.png',
                logoSize: 300,
                logoPosition: 'center-center loader-position-img-left',
                fgsColor: '#FFFFFF',
                fgsPosition: 'center-center loader-position-fgs-left',
                fgsSize: 50,
                gap: 60,
                text: 'ATTENDI, STO CARICANDO I DATI...',
                textColor: '#FFFFFF',
                textPosition: 'top-center loader-position-left'
            };
        } else {
            config = {
                hasProgressBar: false,
                overlayColor: 'rgba(206,43,55,0.85)',
                logoUrl: '../assets/img/logo_vvf_200x.png',
                logoSize: 300,
                logoPosition: 'center-center',
                fgsColor: '#FFFFFF',
                fgsPosition: 'center-center',
                fgsSize: 50,
                gap: 60,
                text: 'ATTENDI, STO CARICANDO I DATI...',
                textColor: '#FFFFFF',
                textPosition: 'top-center'
            };
        }
        this.ngxLoaderConfiguration = config;
    }

}
