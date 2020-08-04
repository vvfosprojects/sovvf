import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { Utente } from '../../../shared/model/utente.model';
import { Tipologia } from '../../../shared/model/tipologia.model';
import { HomeState } from '../store/states/home.state';
import { PermissionFeatures } from '../../../shared/enum/permission-features.enum';
import { SchedaTelefonataState } from '../store/states/chiamata/scheda-telefonata.state';
import { AuthState } from '../../auth/store/auth.state';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { VoceRubrica } from 'src/app/shared/interface/rubrica.interface';


@Component({
    selector: 'app-chiamata',
    templateUrl: './chiamata.component.html',
    styleUrls: ['./chiamata.component.css']
})
export class ChiamataComponent implements OnInit, OnDestroy {

    @Select(SchedaTelefonataState.loadingNuovaChiamata) loadingNuovaChiamata$: Observable<boolean>;
    @Select(AuthState.currentUser) utente$: Observable<Utente>;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    @Select(EntiState.enti) enti$: Observable<VoceRubrica[]>;
    permessiFeature = PermissionFeatures;

    constructor() {
    }

    ngOnInit(): void {
        isDevMode() && console.log('Componente Chiamata creato');
    }

    ngOnDestroy(): void {
        isDevMode() && console.log('Componente Chiamata distrutto');
    }

}
