import { Component, OnDestroy, OnInit, isDevMode } from '@angular/core';
import { Select } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { Observable, Subscription } from 'rxjs';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit, OnDestroy {

    @Select(EventiRichiestaState.eventi) eventiRichiesta$: Observable<EventoRichiesta[]>;
    @Select(EventiRichiestaState.idRichiesta) idRichiesta$: Observable<string>;
    idRichiesta: string;

    subscription: Subscription = new Subscription();

    ngOnInit(): void {
        this.subscription.add(
            this.idRichiesta$.subscribe((idRichiesta: string) => {
                this.idRichiesta = idRichiesta;
            })
        );
        isDevMode() && console.log('Componente Eventi Richiesta Creato');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Eventi Richiesta Distrutto');
    }

}
