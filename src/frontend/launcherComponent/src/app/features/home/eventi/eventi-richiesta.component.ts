import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { EventiRichiestaState } from '../store/states/eventi/eventi-richiesta.state';
import { Observable } from 'rxjs';
import { EventoRichiesta } from '../../../shared/model/evento-richiesta.model';

@Component({
    selector: 'app-eventi-richiesta',
    templateUrl: './eventi-richiesta.component.html',
    styleUrls: ['./eventi-richiesta.component.css']
})
export class EventiRichiestaComponent implements OnInit, OnDestroy {

    @Select(EventiRichiestaState.eventi) eventiRichiesta$: Observable<EventoRichiesta[]>;

    ngOnInit(): void {
        console.log('Componente Eventi Richiesta Creato');
    }

    ngOnDestroy(): void {
        console.log('Componente Eventi Richiesta Distrutto');
    }

}
