import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ToggleMezziInServizio } from '../store/actions/view/view.actions';
import { ClearMezzoInServizioHover, GetMezziInServizio, SetMezzoInServizioHover, SetMezzoInServizioSelezionato } from '../store/actions/mezzi-in-servizio/mezzi-in-servizio.actions';
import { MezziInServizioState } from '../store/states/mezzi-in-servizio/mezzi-in-servizio.state';
import { Observable, Subscription } from 'rxjs';
import { MezzoActionInterface } from 'src/app/shared/interface/mezzo-action.interface';
import { ActionMezzo, SetRichiestaById } from '../store/actions/richieste/richieste.actions';
import { RichiesteState } from '../store/states/richieste/richieste.state';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import {
    SetIdRichiestaEventi,
    ClearEventiRichiesta,
    SetFiltroTargaMezzo
} from '../store/actions/eventi/eventi-richiesta.actions';
import { EventiRichiestaComponent } from '../eventi/eventi-richiesta.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiestaModalComponent } from '../maps/maps-ui/info-window/sintesi-richiesta-modal/sintesi-richiesta-modal.component';
import { MezzoInServizio } from '../../../shared/interface/mezzo-in-servizio.interface';
import { Mezzo } from '../../../shared/model/mezzo.model';

@Component({
    selector: 'app-mezzi-in-servizio',
    templateUrl: './mezzi-in-servizio.component.html',
    styleUrls: ['./mezzi-in-servizio.component.css']
})
export class MezziInServizioComponent implements OnInit, OnDestroy {

    @Select(MezziInServizioState.mezziInServizio) mezziInServizio$: Observable<MezzoInServizio[]>;
    mezziInServizio: MezzoInServizio[];
    @Select(MezziInServizioState.idMezzoInServizioHover) idMezzoInServizioHover$: Observable<string>;
    idMezzoInServizioHover: string;
    @Select(MezziInServizioState.idMezzoInServizioSelezionato) idMezzoInServizioSelezionato$: Observable<string>;
    idMezzoInServizioSelezionato: string;

    @Select(RichiesteState.richieste) richieste$: Observable<SintesiRichiesta[]>;
    richieste: SintesiRichiesta[];

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modalService: NgbModal) {
        this.store.dispatch(new GetMezziInServizio());
        this.subscription.add(
            this.mezziInServizio$.subscribe((mezzi: MezzoInServizio[]) => {
                console.table('Mezzi In Servizio', mezzi);
                this.mezziInServizio = mezzi;
            })
        );
        this.subscription.add(
            this.richieste$.subscribe((richieste: any) => {
                this.richieste = richieste;
            })
        );
        this.subscription.add(
            this.idMezzoInServizioHover$.subscribe((idMezzo: string) => {
                this.idMezzoInServizioHover = idMezzo;
            })
        );
        this.subscription.add(
            this.idMezzoInServizioSelezionato$.subscribe((idMezzo: string) => {
                this.idMezzoInServizioSelezionato = idMezzo;
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    onActionMezzo(mezzoInServizio: MezzoInServizio, mezzoAction: MezzoActionInterface) {
        const richiesta = this.richieste.filter(x => x.codice === mezzoInServizio.mezzo.mezzo.idRichiesta)[0];
        mezzoAction.richiesta = richiesta ? richiesta : null;
        mezzoAction.listaMezzi = true;
        this.store.dispatch(new ActionMezzo(mezzoAction));
    }

    onDettaglioRichiesta(idRichiesta: string) {
        this.store.dispatch(new SetRichiestaById(idRichiesta));
        this.modalService.open(SintesiRichiestaModalComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
    }

    /* Apre il modal per visualizzare gli eventi relativi alla richiesta cliccata */
    onVisualizzaEventiRichiesta(mezzo: Mezzo) {
        this.store.dispatch(new SetFiltroTargaMezzo([mezzo.descrizione]));
        this.store.dispatch(new SetIdRichiestaEventi(mezzo.idRichiesta));
        const modal = this.modalService.open(EventiRichiestaComponent, {
            windowClass: 'xlModal',
            backdropClass: 'light-blue-backdrop',
            centered: true
        });
        modal.result.then(() => {
            },
            () => this.store.dispatch(new ClearEventiRichiesta()));
    }

    hoverIn(idMezzoInServizio: string) {
        this.store.dispatch(new SetMezzoInServizioHover(idMezzoInServizio));
    }

    hoverOut() {
        this.store.dispatch(new ClearMezzoInServizioHover());
    }

    selezionato(idMezzoInServizio: string) {
        this.store.dispatch(new SetMezzoInServizioSelezionato(idMezzoInServizio));
    }

    tornaIndietro() {
        this.store.dispatch(new ToggleMezziInServizio());
    }

}
