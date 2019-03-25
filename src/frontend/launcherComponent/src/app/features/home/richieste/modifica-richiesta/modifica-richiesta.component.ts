import { Component, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_TIPOLOGIE, TipologieInterface } from '../../../../core/settings/tipologie';
import { RichiestaModificaState } from '../../store/states/richieste/richiesta-modifica.state';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.css']
})
export class ModificaRichiestaComponent implements OnInit {

    tipologie: TipologieInterface[] = APP_TIPOLOGIE;

    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModifica: SintesiRichiesta;

    modificaRichiestaForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private modal: NgbActiveModal) {
        this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => {
            this.richiestaModifica = richiesta;
        });
    }

    ngOnInit() {
        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: [this.richiestaModifica.tipologie, Validators.required],
            nominativo: [this.richiestaModifica.richiedente.nominativo, Validators.required],
            telefono: [this.richiestaModifica.richiedente.telefono, Validators.required],
            indirizzo: [this.richiestaModifica.localita.indirizzo, Validators.required],
            etichette: [this.richiestaModifica.etichette],
            noteIndirizzo: [this.richiestaModifica.localita.note],
            priorita: [this.richiestaModifica.priorita, Validators.required],
            rilevanza: [this.richiestaModifica.rilevanza ? this.richiestaModifica.rilevanza.toISOString().split('T')[0] : null],
            latitudine: [this.richiestaModifica.localita.coordinate.latitudine, Validators.required],
            longitudine: [this.richiestaModifica.localita.coordinate.longitudine, Validators.required],
            // notePrivate: [this.richiestaModifica.localita.note],
            // notePubbliche: [this.richiestaModifica.localita.note],
            motivazione: [this.richiestaModifica.descrizione],
            zoneEmergenza: [this.richiestaModifica.zoneEmergenza],
        });
    }

    setRilevanza() {
        if (this.f.rilevanza.value !== null) {
            this.f.rilevanza.setValue(null);
        } else {
            const date = new Date();
            this.f.rilevanza.setValue(date);
        }
    }

    get f() {
        return this.modificaRichiestaForm.controls;
    }

    onAnnullaModifica() {
        this.modal.dismiss('Annulla');
    }

    onConfermaModifica() {
        // console.log(this.modificaRichiestaForm.value);
        this.modal.close(this.modificaRichiestaForm.value);
    }
}
