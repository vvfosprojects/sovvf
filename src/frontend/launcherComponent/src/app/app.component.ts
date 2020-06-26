import {
    AfterViewChecked,
    Component,
    ElementRef,
    HostListener,
    isDevMode,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from './shared/store/states/app/app.state';
import { OFFSET_SYNC_TIME } from './core/settings/referral-time';
import { Ruolo, Utente } from './shared/model/utente.model';
import { ClearListaSediNavbar, PatchListaSediNavbar } from './shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionFeatures } from './shared/enum/permission-features.enum';
import { PermessiService } from './core/service/permessi-service/permessi.service';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { AuthService } from './core/auth/auth.service';
import { VersionCheckService } from './core/service/version-check/version-check.service';
import { SetAvailHeight, SetContentHeight } from './shared/store/actions/viewport/viewport.actions';
import { Images } from './shared/enum/images.enum';
import { AuthState } from './features/auth/store/auth.state';
import { LSNAME } from './core/settings/config';
import { SetCurrentJwt, SetCurrentUser, SetLoggedCas } from './features/auth/store/auth.actions';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {

    private subscription = new Subscription();
    private imgs = [];
    private deniedPath = [ RoutesPath.NotFound.toString(), RoutesPath.Login.toString() ];
    private height;
    private availHeight;
    private currentUrl: string;

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    private listeSediLoaded: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;
    @Select(AppState.vistaSedi) vistaSedi$: Observable<string[]>;
    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(AuthState.currentUser) user$: Observable<Utente>;
    user: Utente;

    permissionFeatures = PermissionFeatures;
    RoutesPath = RoutesPath;

    _opened = false;
    _toggle = false;

    @ViewChild('contentElement', { read: ElementRef }) contentElement: ElementRef;

    @HostListener('window:resize')
    onResize() {
        this.getHeight();
    }

    constructor(private router: Router,
                private authService: AuthService,
                private store: Store,
                private _permessiService: PermessiService,
                private versionCheckService: VersionCheckService,
                private modals: NgbModal) {
        this.getSessionData();
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.currentUrl = val.urlAfterRedirects.slice(1);
                const isLogged = this.store.selectSnapshot(AuthState.logged);
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && isLogged ? this._toggle = true : this._toggle = false;
            }
        });
        this.initSubscription();
    }


    ngOnInit() {
        !isDevMode() && this.versionCheckService.initVersionCheck(3);
        this.preloadImage(Images.Disconnected);
    }

    ngAfterViewChecked() {
        this.getHeight();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

    private initSubscription(): void {
        this.subscription.add(this.isLoaded$.subscribe((r: boolean) => {
            this._isReady(r);
        }));
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
        this.subscription.add(this.user$.subscribe((user: Utente) => {
            this.user = user;
            if (user && user.sede) {
                this.listeSediLoaded && this.store.dispatch(new PatchListaSediNavbar([ user.sede.codice ]));
            } else {
                this.store.dispatch(new ClearListaSediNavbar());
            }
        }));
        this.subscription.add(this.listeSediLoaded$.subscribe((r: boolean) => {
            this.listeSediLoaded = r;
            r && this.store.dispatch(new PatchListaSediNavbar([ this.user.sede.codice ]));
        }));
        this.subscription.add(this.vistaSedi$.subscribe(r => r && this.store.dispatch(new PatchListaSediNavbar([ ...r ]))));
    }

    private _isReady(status: boolean): void {
        console.log('_isReady', status);
        if (!status) {
            // Todo verificare se necessario
            this.modals.dismissAll();
        }
    }

    private getHeight(): void {
        if (this.currentUrl === RoutesPath.Home || this.currentUrl === RoutesPath.GestioneUtenti) {
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
        sessionToken && this.store.dispatch(new SetCurrentJwt(sessionToken));
        sessionCurrentUser && this.store.dispatch(new SetCurrentUser(sessionCurrentUser));
        casLogin && this.store.dispatch(new SetLoggedCas());
    }

}
