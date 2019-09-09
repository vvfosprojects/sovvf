import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import {
    SetSchedaContattoTelefonata,
    ClearSchedaContattoTelefonata,
    SetSchedaContattoHover,
    ClearSchedaContattoHover
} from '../store/actions/schede-contatto/schede-contatto.actions';
import { SchedeContattoState } from '../store/states/schede-contatto/schede-contatto.state';
import { Observable, Subscription } from 'rxjs';
import { SchedaContatto } from 'src/app/shared/interface/scheda-contatto.interface';
import { ToggleSchedeContatto, ToggleChiamata } from '../store/actions/view/view.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DettaglioSchedaModalComponent } from './dettaglio-scheda-modal/dettaglio-scheda-modal.component';

@Component({
    selector: 'app-schede-contatto',
    templateUrl: './schede-contatto.component.html',
    styleUrls: ['./schede-contatto.component.css']
})
export class SchedeContattoComponent implements OnInit {


    @Select(SchedeContattoState.schedeContatto) schedeContatto$: Observable<SchedaContatto[]>;
    schedeContatto: SchedaContatto[];
    @Select(SchedeContattoState.idSchedaContattoHover) idSchedaContattoHover$: Observable<string>;
    idSchedaContattoHover: string;

    subscription: Subscription = new Subscription();

    constructor(private store: Store,
                private modal: NgbModal) {
    }

    ngOnInit() {
        this.subscription.add(
            this.schedeContatto$.subscribe((schedeContatto: SchedaContatto[]) => {
                this.schedeContatto = schedeContatto;
            })
        );
        this.subscription.add(
            this.idSchedaContattoHover$.subscribe((idSchedaContatto: string) => {
                this.idSchedaContattoHover = idSchedaContatto;
            })
        );
    }

    setSchedaContattoTelefonata(schedaContatto: SchedaContatto) {
        this.store.dispatch(new SetSchedaContattoTelefonata(schedaContatto));
        this.store.dispatch(new ToggleChiamata());
    }

    dettaglioScheda(scheda: SchedaContatto) {
        // TODO: aprire modale con tutte le info
        const modal = this.modal.open(DettaglioSchedaModalComponent, { windowClass: 'xlModal', backdropClass: 'light-blue-backdrop', centered: true });
        modal.componentInstance.schedaContatto = scheda;
    }

    hoverIn(idSchedaContatto: string) {
        this.store.dispatch(new SetSchedaContattoHover(idSchedaContatto));
    }

    hoverOut() {
        this.store.dispatch(new ClearSchedaContattoHover());
    }

    tornaIndietro() {
        this.store.dispatch(new ToggleSchedeContatto());
    }

    cardClasses(idSchedaContatto: string) {
        let _returnClass = '';
        if (this.idSchedaContattoHover === idSchedaContatto) {
            _returnClass = 'bg-light';
        }
        return _returnClass;
    }
}
