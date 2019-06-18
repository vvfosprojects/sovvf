import { Component, isDevMode, OnDestroy, OnInit } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RichiestaModificaState } from '../../store/states/richieste/richiesta-modifica.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { makeCopy } from '../../../../shared/helper/function';
import { PatchRichiesta } from '../../store/actions/richieste/richieste.actions';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { CopyToClipboard } from '../../store/actions/chiamata/clipboard.actions';
import { NavbarState } from '../../../navbar/store/states/navbar.state';
import { ChiudiRichiestaModifica, ModificaIndirizzo } from '../../store/actions/richieste/richiesta-modifica.actions';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { GOOGLEPLACESOPTIONS } from '../../../../core/settings/google-places-options';
import { Localita } from '../../../../shared/model/localita.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.css']
})
export class ModificaRichiestaComponent implements OnInit, OnDestroy {

    options = GOOGLEPLACESOPTIONS;

    tipologiaRichiedente: string;
    @Select(NavbarState.tipologie) tipologie$: Observable<Tipologia[]>;

    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModifica: SintesiRichiesta;

    subscription = new Subscription();

    methods = new HelperSintesiRichiesta;

    modificaRichiestaForm: FormGroup;
    submitted = false;

    constructor(private formBuilder: FormBuilder,
                private store: Store) {
        this.subscription.add(this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => this.richiestaModifica = makeCopy(richiesta)));
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Modifica Richiesta creato');
        this.creaForm();
    }

    ngOnDestroy(): void {
        // this.onChiudiModifica();
        this.subscription.unsubscribe();
        isDevMode() && console.log('Componente Modifica Richiesta Distrutto');
    }

    get f() {
        return this.modificaRichiestaForm.controls;
    }

    creaForm(): void {
        if (this.richiestaModifica.richiedente.ragioneSociale) {
            this.tipologiaRichiedente = 'RagioneSociale';
        } else {
            this.tipologiaRichiedente = 'Nome-Cognome';
        }

        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: [this.richiestaModifica.tipologie, Validators.required],
            nome: [this.richiestaModifica.richiedente.nome, Validators.required],
            cognome: [this.richiestaModifica.richiedente.cognome, Validators.required],
            ragioneSociale: [this.richiestaModifica.richiedente.ragioneSociale, Validators.required],
            telefono: [this.richiestaModifica.richiedente.telefono, Validators.required],
            indirizzo: [this.richiestaModifica.localita.indirizzo, Validators.required],
            etichette: [this.richiestaModifica.etichette],
            noteIndirizzo: [this.richiestaModifica.localita.note],
            rilevanza: [this.richiestaModifica.rilevanza],
            rilevanzaStArCu: [this.richiestaModifica.rilevanzaStArCu],
            latitudine: [this.richiestaModifica.localita.coordinate.latitudine, Validators.required],
            longitudine: [this.richiestaModifica.localita.coordinate.longitudine, Validators.required],
            notePrivate: [this.richiestaModifica.notePrivate],
            notePubbliche: [this.richiestaModifica.notePubbliche],
            motivazione: [this.richiestaModifica.descrizione],
            zoneEmergenza: [this.richiestaModifica.zoneEmergenza]
        });

        this.setValidatorsRichiesta(this.tipologiaRichiedente);
    }

    cambiaTipologiaRichiedente(tipologia: string) {
        this.tipologiaRichiedente = tipologia;
        this.setValidatorsRichiesta(tipologia);
    }

    setRilevanza() {
        if (this.f.rilevanza.value === true) {
            this.f.rilevanza.setValue(false);
        } else {
            this.f.rilevanza.setValue(true);
        }
    }

    setRilevanzaStArCu() {
        if (this.f.rilevanzaStArCu.value === true) {
            this.f.rilevanzaStArCu.setValue(false);
        } else {
            this.f.rilevanzaStArCu.setValue(true);
        }
    }

    setValidatorsRichiesta(tipologia: string) {
        switch (tipologia) {
            case 'RagioneSociale':
                this.modificaRichiestaForm.get('nome').setValidators(null);
                this.modificaRichiestaForm.get('cognome').setValidators(null);
                this.modificaRichiestaForm.get('ragioneSociale').setValidators(Validators.required);
                break;
            case 'Nome-Cognome':
                this.modificaRichiestaForm.get('ragioneSociale').setValidators(null);
                this.modificaRichiestaForm.get('nome').setValidators(Validators.required);
                this.modificaRichiestaForm.get('cognome').setValidators(Validators.required);
                break;
        }
    }

    onCercaIndirizzo(result: Address): void {
        const coordinate = new Coordinate(result.geometry.location.lat(), result.geometry.location.lng());
        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.indirizzo.patchValue(result.formatted_address);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, result.formatted_address);
        this.store.dispatch(new ModificaIndirizzo(nuovoIndirizzo));
    }

    onCopiaIndirizzo() {
        this.store.dispatch(new CopyToClipboard(new Coordinate(this.f.latitudine.value, this.f.longitudine.value)));
    }

    getNuovaRichiesta() {
        const nuovaRichiesta = this.richiestaModifica;

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
        nuovaRichiesta.rilevanzaStArCu = f.rilevanzaStArCu.value;
        nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        nuovaRichiesta.descrizione = f.motivazione.value;
        nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value;

        console.log('Richiesta Modificata', nuovaRichiesta);
        return nuovaRichiesta;
    }

    onChiudiModifica() {
        this.store.dispatch(new ChiudiRichiestaModifica);
    }

    onConfermaModifica() {
        this.submitted = true;
        if (this.modificaRichiestaForm.invalid) {
            return;
        }

        const nuovaRichiesta = this.getNuovaRichiesta();

        this.store.dispatch(new PatchRichiesta(nuovaRichiesta));
    }

}
