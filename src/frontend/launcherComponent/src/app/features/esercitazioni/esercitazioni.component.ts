import { Component, OnDestroy, OnInit } from '@angular/core';
import { SetCurrentUrl } from '../../shared/store/actions/app/app.actions';
import { RoutesPath } from '../../shared/enum/routes-path.enum';
import { SetSediNavbarVisible } from '../../shared/store/actions/sedi-treeview/sedi-treeview.actions';
import { StopBigLoading } from '../../shared/store/actions/loading/loading.actions';
import { SquadraEsercitazione } from './interface/squadra-esercitazione.interface';
import { MezzoEsercitazione } from './interface/mezzo-esercitazione.interface';
import { EsercitazioniState } from './store/states/esercitazioni/esercitazioni.state';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'app-esercitazioni',
    templateUrl: './esercitazioni.component.html',
    styleUrls: ['./esercitazioni.component.scss']
})
export class EsercitazioniComponent implements OnInit, OnDestroy {

    loadingListe: boolean;

    @Select(EsercitazioniState.listaMezzi) mezziEsercitazione$: Observable<MezzoEsercitazione[]>;
    mezziEsercitazione: MezzoEsercitazione[];
    @Select(EsercitazioniState.listaSquadre) squadreEsercitazione$: Observable<SquadraEsercitazione[]>;
    squadreEsercitazione: SquadraEsercitazione[];

    private subscriptions: Subscription = new Subscription();

    constructor(private store: Store) {
        this.getMezziEsercitazione();
        this.getSquadreEsercitazione();
    }

    ngOnInit(): void {
        console.log('Componente Esercitazioni creato');
        this.store.dispatch([
            new SetCurrentUrl(RoutesPath.Esercitazioni),
            new SetSediNavbarVisible(false),
            new StopBigLoading()
        ]);
    }

    ngOnDestroy(): void {
        console.log('Componente Esercitazioni distrutto');
        this.store.dispatch([
            new SetSediNavbarVisible()
        ]);
        this.subscriptions.unsubscribe();
    }

    getMezziEsercitazione(): void {
        this.subscriptions.add(
            this.mezziEsercitazione$.subscribe((mezziEsercitazione: MezzoEsercitazione[]) => {
                this.mezziEsercitazione = mezziEsercitazione;
            })
        );
    }

    getSquadreEsercitazione(): void {
        this.subscriptions.add(
            this.squadreEsercitazione$.subscribe((squadreEsercitazione: SquadraEsercitazione[]) => {
                this.squadreEsercitazione = squadreEsercitazione;
            })
        );
    }
}
