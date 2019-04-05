import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../../core/settings/tipologie';
import { RichiestaModificaState } from '../../store/states/richieste/richiesta-modifica.state';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { makeCopy } from '../../../../shared/helper/function';
import { UpdateRichiesta } from '../../store/actions/richieste/richieste.actions';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.css']
})
export class ModificaRichiestaComponent implements OnInit {

    tipologie: TipologieInterface[] = APP_TIPOLOGIE;
    tipologiaRichiedente: string;

    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModifica: SintesiRichiesta;

    modificaRichiestaForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private modal: NgbActiveModal,
                private store: Store) {
        this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => {
            this.richiestaModifica = richiesta;
        });
    }

    ngOnInit() {
        if (this.richiestaModifica.richiedente.ragioneSociale) {
            this.tipologiaRichiedente = 'RagioneSociale';
        } else {
            this.tipologiaRichiedente = 'Nome-Cognome';
        }

        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: [this.richiestaModifica.tipologie, Validators.required],
            nome: [this.richiestaModifica.richiedente.nome],
            cognome: [this.richiestaModifica.richiedente.cognome],
            ragioneSociale: [this.richiestaModifica.richiedente.ragioneSociale],
            telefono: [this.richiestaModifica.richiedente.telefono, Validators.required],
            indirizzo: [this.richiestaModifica.localita.indirizzo, Validators.required],
            etichette: [this.richiestaModifica.etichette],
            noteIndirizzo: [this.richiestaModifica.localita.note],
            rilevanza: [this.richiestaModifica.rilevanza ? this.richiestaModifica.rilevanza.toString().split('T')[0] : null],
            latitudine: [this.richiestaModifica.localita.coordinate.latitudine, Validators.required],
            longitudine: [this.richiestaModifica.localita.coordinate.longitudine, Validators.required],
            notePrivate: [this.richiestaModifica.notePrivate],
            notePubbliche: [this.richiestaModifica.notePubbliche],
            motivazione: [this.richiestaModifica.descrizione],
            zoneEmergenza: [this.richiestaModifica.zoneEmergenza],
        });
    }

    get f() {
        return this.modificaRichiestaForm.controls;
    }

    cambiaTipologiaRichiedente(tipologia: string) {
        this.tipologiaRichiedente = tipologia;
    }

    setRilevanza() {
        if (this.f.rilevanza.value !== null) {
            this.f.rilevanza.setValue(null);
        } else {
            const date = new Date();
            this.f.rilevanza.setValue(date);
        }
    }

    getNuovaRichiesta() {
        const nuovaRichiesta = makeCopy(this.richiestaModifica);

        // Set form data
        const f = this.f;
        nuovaRichiesta.tipologie = f.tipoIntervento.value;
        if (this.tipologiaRichiedente === 'Nome-Cognome') {
            nuovaRichiesta.richiedente.nome = f.nome.value;
            nuovaRichiesta.richiedente.cognome = f.cognome.value;
            nuovaRichiesta.richiedente.ragioneSociale = '';
        } else if (this.tipologiaRichiedente === 'RagioneSociale') {
            nuovaRichiesta.richiedente.ragioneSociale = f.ragioneSociale.value;
            nuovaRichiesta.richiedente.nome = '';
            nuovaRichiesta.richiedente.cognome = '';
        }
        nuovaRichiesta.richiedente.telefono = f.telefono.value;
        nuovaRichiesta.localita.indirizzo = f.indirizzo.value;
        nuovaRichiesta.etichette = f.etichette.value;
        nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        nuovaRichiesta.rilevanza = f.rilevanza.value;
        nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        nuovaRichiesta.descrizione = f.motivazione.value;
        nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value;

        console.log(nuovaRichiesta);
        return nuovaRichiesta;
    }

    onAnnullaModifica() {
        this.modal.dismiss('Annulla');
    }

    onConfermaModifica() {
        this.submitted = true;
        if (this.modificaRichiestaForm.invalid) {
            return;
        }

        this.modal.close(this.modificaRichiestaForm.value);

        const nuovaRichiesta = this.getNuovaRichiesta();

        this.store.dispatch(new UpdateRichiesta(nuovaRichiesta));
    }
}
