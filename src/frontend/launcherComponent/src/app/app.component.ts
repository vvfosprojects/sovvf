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
import { UtenteState } from './features/navbar/store/states/operatore/utente.state';
import { ClearListaSediNavbar, PatchListaSediNavbar } from './shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionFeatures } from './shared/enum/permission-features.enum';
import { PermessiService } from './core/service/permessi-service/permessi.service';
import { RuoliUtenteLoggatoState } from './shared/store/states/ruoli-utente-loggato/ruoli-utente-loggato.state';
import { AuthenticationService } from './core/auth/_services/authentication.service';
import { VersionCheckService } from './core/service/version-check/version-check.service';
import { NewVersionState } from './shared/store/states/nuova-versione/nuova-versione.state';
import { VersionInterface } from './shared/interface/version.interface';
import { SetAvailHeight, SetContentHeight } from './shared/store/actions/viewport/viewport.actions';
import { ViewportState } from './shared/store/states/viewport/viewport.state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {

    private subscription = new Subscription();

    @Select(AppState.appIsLoaded) isLoaded$: Observable<boolean>;

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    private listeSediLoaded: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;
    @Select(AppState.vistaSedi) vistaSedi$: Observable<string[]>;

    @Select(ViewportState.footerFixed) footerFixed$: Observable<boolean>;

    @Select(NewVersionState.version) version$: Observable<VersionInterface>;

    @Select(RuoliUtenteLoggatoState.ruoliFiltrati) ruoliUtenteLoggato$: Observable<Ruolo[]>;
    @Select(UtenteState.utente) user$: Observable<Utente>;
    user: Utente;

    permissionFeatures = PermissionFeatures;

    isReady = false;

    _opened = false;
    _toggle = false;
    RoutesPath = RoutesPath;
    private deniedPath = [ RoutesPath.NotFound.toString(), RoutesPath.Login.toString() ];

    private height;
    private availHeight;

    @ViewChild('contentElement', { read: ElementRef }) contentElement: ElementRef;

    @HostListener('window:resize')
    onResize() {
        this.getHeight();
    }

    constructor(private router: Router,
                private authService: AuthenticationService,
                private store: Store,
                private _permessiService: PermessiService,
                private versionCheckService: VersionCheckService,
                private modals: NgbModal) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
        this.subscription.add(this.isLoaded$.subscribe((r: boolean) => {
            this._isReady(r);
        }));
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
        this.subscription.add(this.user$.subscribe((user: Utente) => {
            this.user = user;
            if (user) {
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

    ngOnInit() {
        !isDevMode() && this.versionCheckService.initVersionCheck(3);
    }

    ngAfterViewChecked() {
        this.getHeight();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    _isReady(status: boolean) {
        this.isReady = status;
        if (!status) {
            this.modals.dismissAll();
        }
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

    getHeight(): void {
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
