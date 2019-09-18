import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from './core/auth/_services';
import { RoutesPath } from './shared/enum/routes-path.enum';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { SignalRState } from './core/signalr/store/signalR.state';
import { AppState } from './shared/store/states/app/app.state';
import { OFFSET_SYNC_TIME } from './core/settings/referral-time';
import { Utente } from './shared/model/utente.model';
import { UtenteState } from './features/navbar/store/states/operatore/utente.state';
import { ClearListaSediNavbar, PatchListaSediNavbar } from './shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { SediTreeviewState } from './shared/store/states/sedi-treeview/sedi-treeview.state';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare global {
    interface Window {
        RTCPeerConnection: RTCPeerConnection;
        mozRTCPeerConnection: RTCPeerConnection;
        webkitRTCPeerConnection: RTCPeerConnection;
    }
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    name = 'Angular';
    localIp = sessionStorage.getItem('LOCAL_IP');

    private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);


    subscription = new Subscription();

    @Select(SignalRState.statusSignalR) _signalR$: Observable<boolean>;
    _signalR = false;

    @Select(AppState.appIsLoaded) _isLoaded$: Observable<boolean>;
    _isLoaded: boolean;

    @Select(SediTreeviewState.listeSediLoaded) listeSediLoaded$: Observable<boolean>;
    listeSediLoaded: boolean;

    @Select(AppState.offsetTimeSync) offsetTime$: Observable<number>;

    @Select(UtenteState.utente) user$: Observable<Utente>;
    user: Utente;

    isReady = false;

    _opened = false;
    _toggle = false;
    RoutesPath = RoutesPath;
    private deniedPath = [RoutesPath.NotFound.toString(), RoutesPath.Login.toString()];

    constructor(private router: Router,
                private authService: AuthenticationService,
                private store: Store,
                private modals: NgbModal,
                private zone: NgZone) {
        router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                !this.deniedPath.includes(val.urlAfterRedirects.slice(1)) && authService._isLogged() ? this._toggle = true : this._toggle = false;
            }
        });
        this.subscription.add(this._signalR$.subscribe((r: boolean) => {
            this._signalR = r;
            this._isReady();
        }));
        this.subscription.add(this._isLoaded$.subscribe((r: boolean) => {
            this._isLoaded = r;
            this._isReady();
        }));
        this.subscription.add(this.offsetTime$.subscribe((serverTime: number) => OFFSET_SYNC_TIME.unshift(serverTime)));
        this.subscription.add(this.user$.subscribe((user: Utente) => {
            this.user = user;
            if (this.listeSediLoaded) {
                if (this.user) {
                    this.store.dispatch(new PatchListaSediNavbar([this.user.sede.codice]));
                } else {
                    this.store.dispatch(new ClearListaSediNavbar());
                }
            }
        }));
        this.subscription.add(this.listeSediLoaded$.subscribe((r: boolean) => {
            this.listeSediLoaded = r;
            if (r) {
                this.store.dispatch(new PatchListaSediNavbar([this.user.sede.codice]));
            }
        }));
    }

    ngOnInit(): void {
        this.determineLocalIp();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    _isReady() {
        this.isReady = !!this._signalR && !!this._isLoaded;
        if (!this.isReady) {
            this.modals.dismissAll();
        }
    }

    _toggleOpened() {
        this._opened = !this._opened;
    }

    private determineLocalIp() {
        window.RTCPeerConnection = this.getRTCPeerConnection();

        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(pc.setLocalDescription.bind(pc));

        pc.onicecandidate = (ice) => {
            this.zone.run(() => {
                if (!ice || !ice.candidate || !ice.candidate.candidate) {
                    return;
                }

                const candidate = this.ipRegex.exec(ice.candidate.candidate);
                if (candidate && candidate.length > 0) {
                    this.localIp = this.ipRegex.exec(ice.candidate.candidate)[1];
                }
                console.log(ice.candidate['address']);
                sessionStorage.setItem('LOCAL_IP', this.localIp);

                pc.onicecandidate = () => {
                };
                pc.close();
            });
        };
    }

    private getRTCPeerConnection() {
        return window.RTCPeerConnection ||
            window.mozRTCPeerConnection ||
            window.webkitRTCPeerConnection;
    }
}
