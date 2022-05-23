import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SintesiRichiesta } from 'src/app/shared/model/sintesi-richiesta.model';
import { TipoConcorrenzaEnum } from '../../enum/tipo-concorrenza.enum';
import { RichiestaSganciamentoState } from '../../../features/home/store/states/composizione-partenza/richiesta-sganciamento.state';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';
import { Partenza } from '../../model/partenza.model';

@Component({
    selector: 'app-sganciamento-mezzo-modal',
    templateUrl: './sganciamento-mezzo-modal.component.html',
    styleUrls: ['./sganciamento-mezzo-modal.component.css']
})
export class SganciamentoMezzoModalComponent implements OnInit, OnDestroy {

    @Select(RichiesteState.loadingActionMezzo) loadingActionMezzo$: Observable<string[]>;
    @Select(RichiestaSganciamentoState.richiestaSganciamento) richiestaSganciamento$: Observable<SintesiRichiesta>;

    richiestaSganciamento: SintesiRichiesta;
    idDaSganciare: string;
    codMezzoDaSganciare: string;
    mezzoNotFound: boolean;

    tipoConcorrenzaEnum = TipoConcorrenzaEnum;

    private subscriptions: Subscription = new Subscription();

    constructor(public modal: NgbActiveModal) {
    }

    ngOnInit(): void {
        this.getRichiestaSganciamento();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getRichiestaSganciamento(): void {
        this.subscriptions.add(
            this.richiestaSganciamento$.subscribe((richiestaSganciamento: SintesiRichiesta) => {
                if (richiestaSganciamento) {
                    this.richiestaSganciamento = richiestaSganciamento;
                    const richiestaSganciamentoMezzo = richiestaSganciamento.partenze.filter((p: Partenza) => p.partenza.mezzo.descrizione === this.idDaSganciare && !p.partenza.sganciata && !p.partenza.partenzaAnnullata && !p.partenza.terminata)?.length;
                    if (!richiestaSganciamentoMezzo) {
                        this.mezzoNotFound = true;
                    }
                }
            })
        );
    }

    getPartenzaSganciamento(): Partenza {
        return this.richiestaSganciamento?.partenze.find((p: Partenza) => p.codiceMezzo === this.codMezzoDaSganciare && !p.partenza.terminata && !p.partenza.partenzaAnnullata && !p.partenza.sganciata);
    }

    getPartenzeNoSganciamento(): Partenza[] {
        return this.richiestaSganciamento?.partenze.filter((p: Partenza) => p.codiceMezzo !== this.codMezzoDaSganciare && !p.partenza.terminata && !p.partenza.partenzaAnnullata && !p.partenza.sganciata);
    }
}
