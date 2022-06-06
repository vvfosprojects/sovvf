import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Select, Store } from '@ngxs/store';
import { AllertaSedeModalState } from '../../store/states/allerta-sede-modal/allerta-sede-modal.state';
import { LoadingState } from '../../store/states/loading/loading.state';
import { DistaccamentiState } from '../../store/states/distaccamenti/distaccamenti.state';
import { Sede } from '../../model/sede.model';
import { FiltriComposizioneState } from '../../store/states/filtri-composizione/filtri-composizione.state';
import { ListaTipologicheMezzi } from '../../../features/home/composizione-partenza/interface/filtri/lista-filtri-composizione-interface';
import { TipologicaComposizionePartenza } from '../../../features/home/composizione-partenza/interface/filtri/tipologica-composizione-partenza.interface';
import { GetFiltriComposizione } from '../../store/actions/filtri-composizione/filtri-composizione.actions';
import { makeCopy } from '../../helper/function-generiche';
import { AppState } from '../../store/states/app/app.state';

@Component({
    selector: 'app-allerta-sede-modal',
    templateUrl: './allerta-sede-modal.component.html',
    styleUrls: ['./allerta-sede-modal.component.css']
})
export class AllertaSedeModalComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;
    @Select(AllertaSedeModalState.formValid) formValid$: Observable<boolean>;
    formValid: boolean;
    @Select(DistaccamentiState.sediAllerta) distaccamenti$: Observable<Sede[]>;
    distaccamenti: Sede[];
    @Select(FiltriComposizioneState.filtri) filtri$: Observable<ListaTipologicheMezzi>;
    generiMezzi: TipologicaComposizionePartenza[];

    allertaSedeForm: FormGroup;
    submitted: boolean;
    checkbox: { conoscenza: boolean, allerta: boolean } = {
        conoscenza: false,
        allerta: true,
    };
    motivazione = 'allerta';
    generiMezzoSelezionati: string[] = [];

    codRichiesta: string;
    codSOCompetente: string;
    codSOAllertate: string[];

    subscriptions: Subscription = new Subscription();

    constructor(private fb: FormBuilder,
                private modal: NgbActiveModal,
                private store: Store) {
        this.initForm();
        this.getFormValid();
        this.getSedi();
        this.getGenereMezzo();
    }

    initForm(): void {
        this.allertaSedeForm = new FormGroup({
            codRichiesta: new FormControl(),
            sedi: new FormControl()
        });
        this.allertaSedeForm = this.fb.group({
            codRichiesta: [null, Validators.required],
            sedi: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.f.codRichiesta.patchValue(this.codRichiesta);
        this.store.dispatch(new GetFiltriComposizione());
        this.removeSedeTreeviewSelezionata();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getFormValid(): void {
        this.subscriptions.add(
            this.formValid$.subscribe((valid: boolean) => {
                this.formValid = valid;
            })
        );
    }

    get f(): any {
        return this.allertaSedeForm.controls;
    }

    getSedi(): void {
        this.subscriptions.add(
            this.distaccamenti$.subscribe((sedi: Sede[]) => {
                this.distaccamenti = sedi;
            })
        );
    }

    getGenereMezzo(): void {
        this.subscriptions.add(
            this.filtri$.subscribe((filtri: ListaTipologicheMezzi) => {
                this.generiMezzi = filtri.generiMezzi;
            })
        );
    }

    removeSedeTreeviewSelezionata(): void {
        const codiceSedeSelezionata = this.store.selectSnapshot(AppState.vistaSedi)[0];
        const distaccamentiUnique = makeCopy(this.distaccamenti);
        const codiciDistaccamenti = [];
        distaccamentiUnique.forEach(x => codiciDistaccamenti.push(x.codice));
        const indexRemove = codiciDistaccamenti.indexOf(codiceSedeSelezionata);
        distaccamentiUnique.splice(indexRemove, 1);
        this.distaccamenti = distaccamentiUnique;
    }

    checkSediSelezionateError(): boolean {
        const sediSelezionate = this.f?.sedi?.value;
        const siglaComandoSOCompetente = this.codSOCompetente?.split('.')?.length === 2 ? this.codSOCompetente.split('.')[0] : null;
        const siglaComandoSediSelezionate = sediSelezionate?.map((codComando: string) => codComando.split('.')?.length === 2 ? codComando.split('.')[0] : null);
        return siglaComandoSediSelezionate?.includes(siglaComandoSOCompetente) || this.codSOAllertate.some((codSOAllertata: string) => sediSelezionate?.includes(codSOAllertata));
    }

    onConferma(): void {
        this.submitted = true;
        const obj = this.allertaSedeForm.value;
        obj.motivazione = this.motivazione;
        obj.generiMezzi = this.generiMezzoSelezionati;
        if (!this.allertaSedeForm.valid) {
            return;
        }
        this.modal.close({ status: 'ok', result: obj });
    }

    onDismiss(): void {
        this.modal.dismiss('ko');
    }

    closeModal(type: string): void {
        this.modal.close(type);
    }

    onCheck(key: string): void {
        if (this.checkbox[key]) {
            this.checkbox[key] = false;
            Object.keys(this.checkbox).forEach(x => this.checkbox[x] = x !== key);
        } else {
            Object.keys(this.checkbox).forEach(x => this.checkbox[x] = x === key);
        }
        this.motivazione = key;
    }
}
