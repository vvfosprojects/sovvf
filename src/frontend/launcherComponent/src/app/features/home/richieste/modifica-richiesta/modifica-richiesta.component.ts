import { Component, EventEmitter, isDevMode, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SintesiRichiesta } from '../../../../shared/model/sintesi-richiesta.model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RichiestaModificaState } from '../../store/states/richieste/richiesta-modifica.state';
import { Observable, Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { makeCopy, roundTodecimal, visualizzaBoschiSterpaglie } from '../../../../shared/helper/function';
import { PatchRichiesta } from '../../store/actions/richieste/richieste.actions';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { Coordinate } from '../../../../shared/model/coordinate.model';
import { CopyToClipboard } from '../../store/actions/chiamata/clipboard.actions';
import {
    ChiudiRichiestaModifica,
    ModificaIndirizzo,
    ClearRichiestaModifica
} from '../../store/actions/richieste/richiesta-modifica.actions';
import { Tipologia } from '../../../../shared/model/tipologia.model';
import { GOOGLEPLACESOPTIONS } from '../../../../core/settings/google-places-options';
import { Localita } from '../../../../shared/model/localita.model';
import { HelperSintesiRichiesta } from '../helper/_helper-sintesi-richiesta';
import { TipoTerreno } from '../../../../shared/model/tipo-terreno';
import { ToggleModifica } from '../../store/actions/view/view.actions';
import { HomeState } from '../../store/states/home.state';
import { LoadingState } from '../../../../shared/store/states/loading/loading.state';
import { ClearRichiestaMarkerModifica } from '../../store/actions/maps/richieste-markers.actions';
import { UpdateFormValue } from '@ngxs/form-plugin';
import { Options } from 'ngx-google-places-autocomplete/objects/options/options';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
import { ComponentRestrictions } from 'ngx-google-places-autocomplete/objects/options/componentRestrictions';
import { EntiState } from 'src/app/shared/store/states/enti/enti.state';
import { Ente } from 'src/app/shared/interface/ente.interface';
import { EnteModalComponent } from '../../../../shared/modal/ente-modal/ente-modal.component';
import { ClearFormEnte, RequestAddEnte } from '../../../../shared/store/actions/enti/enti.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modifica-richiesta',
    templateUrl: './modifica-richiesta.component.html',
    styleUrls: ['./modifica-richiesta.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ModificaRichiestaComponent implements OnInit, OnDestroy {

    @Select(LoadingState.loading) loading$: Observable<boolean>;

    ngxGooglePlacesOptions: Options;

    tipologiaRichiedente: string;
    @Select(HomeState.tipologie) tipologie$: Observable<Tipologia[]>;
    tipologie: Tipologia[];

    @Select(EntiState.enti) enti$: Observable<Ente[]>;
    enti: Ente[];

    @Select(RichiestaModificaState.richiestaModifica) richiestaModifica$: Observable<SintesiRichiesta>;
    richiestaModificaIniziale: SintesiRichiesta;
    richiestaModifica: SintesiRichiesta;

    subscription = new Subscription();

    methods = new HelperSintesiRichiesta;

    modificaRichiestaForm: FormGroup;
    submitted = false;
    campiModificati = [];

    coordinate: Coordinate;

    constructor(private formBuilder: FormBuilder,
                private modalService: NgbModal,
                private store: Store) {
        this.initForm();
        this.subscription.add(this.richiestaModifica$.subscribe((richiesta: SintesiRichiesta) => {
            if (richiesta) {
                this.richiestaModifica = makeCopy(richiesta);
                this.richiestaModificaIniziale = makeCopy(richiesta);
                this.richiestaModifica.listaEnti = [];
                this.richiestaModifica.listaEntiIntervenuti.forEach(e => this.richiestaModifica.listaEnti.push(e));
                this.richiestaModificaIniziale.listaEnti = [];
                this.richiestaModificaIniziale.listaEntiIntervenuti.forEach(e => this.richiestaModificaIniziale.listaEnti.push(e));
                this.coordinate = makeCopy(richiesta.localita.coordinate);
            }
        }));
        this.subscription.add(this.tipologie$.subscribe((tipologie: Tipologia[]) => this.tipologie = tipologie));
        this.subscription.add(this.enti$.subscribe((enti: Ente[]) => {
            this.enti = enti;
        }));
        this.ngxGooglePlacesOptions = new Options({
            bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
            componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
        });
    }

    ngOnInit() {
        isDevMode() && console.log('Componente Modifica Richiesta creato');
        this.creaForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.store.dispatch(new ClearRichiestaMarkerModifica());
        isDevMode() && console.log('Componente Modifica Richiesta Distrutto');
    }

    initForm() {
        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: new FormControl(),
            nominativo: new FormControl(),
            telefono: new FormControl(),
            indirizzo: new FormControl(),
            etichette: new FormControl(),
            noteIndirizzo: new FormControl(),
            rilevanzaGrave: new FormControl(),
            rilevanzaStArCu: new FormControl(),
            latitudine: new FormControl(),
            longitudine: new FormControl(),
            piano: new FormControl(),
            notePrivate: new FormControl(),
            notePubbliche: new FormControl(),
            motivazione: new FormControl(),
            zoneEmergenza: new FormControl(),
            prioritaRichiesta: new FormControl(),
            listaEnti: new FormControl()
        });
    }

    get f() {
        return this.modificaRichiestaForm.controls;
    }

    creaForm(): void {
        const zoneEmergenza = this.richiestaModifica.zoneEmergenza ? this.richiestaModifica.zoneEmergenza.join(' ') : null;
        const etichette = (this.richiestaModifica.tags && this.richiestaModifica.tags.length) ? this.richiestaModifica.tags : null;
        const listaEnti = (this.richiestaModifica.listaEnti && this.richiestaModifica.listaEnti.length) ? this.richiestaModifica.listaEnti : null;
        this.modificaRichiestaForm = this.formBuilder.group({
            tipoIntervento: [this.richiestaModifica.tipologie, Validators.required],
            nominativo: [this.richiestaModifica.richiedente.nominativo, Validators.required],
            telefono: [this.richiestaModifica.richiedente.telefono, [Validators.required, Validators.pattern('^(\\+?)[0-9]+$')]],
            indirizzo: [this.richiestaModifica.localita.indirizzo, Validators.required],
            etichette: [etichette],
            noteIndirizzo: [this.richiestaModifica.localita.note],
            rilevanzaGrave: [this.richiestaModifica.rilevanteGrave],
            rilevanzaStArCu: [this.richiestaModifica.rilevanteStArCu],
            latitudine: [this.richiestaModifica.localita.coordinate.latitudine, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            longitudine: [this.richiestaModifica.localita.coordinate.longitudine, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
            piano: [this.richiestaModifica.localita.piano],
            notePrivate: [this.richiestaModifica.notePrivate],
            notePubbliche: [this.richiestaModifica.notePubbliche],
            motivazione: [this.richiestaModifica.descrizione],
            zoneEmergenza: [zoneEmergenza],
            prioritaRichiesta: [this.richiestaModifica.prioritaRichiesta],
            listaEnti: [listaEnti.map(e => e.codice)]
        });
        this.store.dispatch(new UpdateFormValue({
            path: 'richiestaModifica.modificaRichiestaForm',
            value: this.modificaRichiestaForm
        }));
    }

    cambiaTipologiaRichiedente(tipologia: string) {
        this.tipologiaRichiedente = tipologia;
    }

    setRilevanza() {
        if (this.f.rilevanzaGrave.value === true) {
            this.f.rilevanzaGrave.setValue(false);
        } else {
            this.f.rilevanzaGrave.setValue(true);
        }
    }

    setRilevanzaStArCu() {
        if (this.f.rilevanzaStArCu.value === true) {
            this.f.rilevanzaStArCu.setValue(false);
        } else {
            this.f.rilevanzaStArCu.setValue(true);
        }
    }

    onCercaIndirizzo(result: Address): void {
        const coordinate = new Coordinate(roundTodecimal(result.geometry.location.lat(), 6), roundTodecimal(result.geometry.location.lng(), 6));
        this.coordinate = coordinate;
        this.f.latitudine.patchValue(coordinate.latitudine);
        this.f.longitudine.patchValue(coordinate.longitudine);
        this.f.indirizzo.patchValue(result.formatted_address);
        const nuovoIndirizzo = new Localita(coordinate ? coordinate : null, result.formatted_address);
        this.store.dispatch(new ModificaIndirizzo(nuovoIndirizzo));
    }

    onMsgIndirizzo(): string {
        let msg = '';
        if (this.f.indirizzo.errors && !this.coordinate) {
            msg = 'L\'indirizzo è richiesto';
        } else if (this.f.indirizzo.errors) {
            msg = 'L\'indirizzo è richiesto';
        } else if (!this.coordinate) {
            msg = 'È necessario selezionare un indirizzo dall\'elenco';
        } else {
            return null;
        }
        return msg;
    }

    onCopiaIndirizzo() {
        this.store.dispatch(new CopyToClipboard(new Coordinate(this.f.latitudine.value, this.f.longitudine.value)));
    }

    getNuovaRichiesta() {
        const nuovaRichiesta = this.richiestaModifica;

        const f = this.f;
        nuovaRichiesta.tipologie = f.tipoIntervento.value;
        nuovaRichiesta.richiedente.telefono = f.telefono.value;
        nuovaRichiesta.richiedente.nominativo = f.nominativo.value;
        nuovaRichiesta.localita.indirizzo = f.indirizzo.value;
        nuovaRichiesta.tags = (f.etichette.value && f.etichette.value.length) ? f.etichette.value : [];
        nuovaRichiesta.localita.note = f.noteIndirizzo.value;
        nuovaRichiesta.rilevanteGrave = f.rilevanzaGrave.value;
        nuovaRichiesta.rilevanteStArCu = f.rilevanzaStArCu.value;
        nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
        nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
        nuovaRichiesta.localita.piano = f.piano.value;
        nuovaRichiesta.descrizione = f.motivazione.value;
        nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value ? f.zoneEmergenza.value.split(' ') : [];
        nuovaRichiesta.notePrivate = f.notePrivate.value;
        nuovaRichiesta.notePubbliche = f.notePubbliche.value;
        nuovaRichiesta.prioritaRichiesta = f.prioritaRichiesta.value;
        nuovaRichiesta.listaEnti = (f.listaEnti.value && f.listaEnti.value.length) ? f.listaEnti.value : [];
        // nuovaRichiesta.listaEnti = f.listaEnti.value;
        // console.log('Richiesta Modificata', nuovaRichiesta);
        this.setDescrizione();
        return nuovaRichiesta;
    }

    onChiudiModifica() {
        this.store.dispatch(new ChiudiRichiestaModifica);
    }

    onConfermaModifica() {
        this.submitted = true;
        if (!(this.modificaRichiestaForm.valid && !!this.coordinate)) {
            return;
        }

        const nuovaRichiesta = this.getNuovaRichiesta();
        this.checkCampiModificati(nuovaRichiesta);
    }

    aggiungiNuovoEnte() {
        const addEnteModal = this.modalService.open(EnteModalComponent, {
            backdropClass: 'light-blue-backdrop',
            centered: true,
            size: 'lg'
        });
        addEnteModal.result.then(
            (result: { success: boolean }) => {
                if (result.success) {
                    this.store.dispatch(new RequestAddEnte());
                } else if (!result.success) {
                    this.store.dispatch(new ClearFormEnte());
                    console.log('Modal "addEnteModal" chiusa con val ->', result);
                }
            },
            (err) => {
                this.store.dispatch(new ClearFormEnte());
                console.error('Modal chiusa senza bottoni. Err ->', err);
            }
        );
    }

    onTerreniSelezionati($event: TipoTerreno[]): void {
        this.richiestaModifica.tipoTerreno = $event;
    }

    checkTipologie(): boolean {
        return !!!(this.f.tipoIntervento.value && (this.f.tipoIntervento.value.length > 0));
    }

    modificaIndirizzo() {
        const address = this.f.indirizzo;
        if (address.touched || address.dirty) {
            this.coordinate = null;
        }
        console.log('coordinate', this.coordinate);
    }

    setDescrizione(): void {
        const form = this.f;
        if (!form.motivazione.value) {
            // console.log(form.selectedTipologie.value);
            const nuovaDescrizione = this.tipologie.filter(tipologia => tipologia.codice === form.tipoIntervento.value[0].codice);
            if (nuovaDescrizione && nuovaDescrizione.length > 0) {
                this.richiestaModifica.descrizione = nuovaDescrizione[0].descrizione;
            }
        }
    }

    visualizzaBoschiSterpaglie(tipologieRichiesta: Tipologia[]) {
        return visualizzaBoschiSterpaglie(tipologieRichiesta);
    }

    checkCampiModificati(richiesta: SintesiRichiesta) {
        const stringRichiesta = JSON.stringify(richiesta);
        const stringRichiestaModifica = JSON.stringify(this.richiestaModificaIniziale);

        // se i dati non sono cambiati non chiamo il backend
        if (stringRichiesta === stringRichiestaModifica) {
            this.store.dispatch(new ToggleModifica(true));
            this.store.dispatch(new ClearRichiestaModifica);
        } else {
            this.setCampiModificati(richiesta);
            this.store.dispatch(new PatchRichiesta(richiesta));
        }
        // console.log('stringRichiesta', stringRichiesta);
        // console.log('stringRichiestaModifica', stringRichiestaModifica);
    }

    checkInputPattern(event: any, type: string): void {
        let regexp;
        switch (type) {
            case 'PHONE':
                regexp = /^[0-9\+]*$/;
                break;
            case 'LAT_LON':
                regexp = /^[0-9\.\-]$/;
                break;
        }

        let inputValue;
        if (event instanceof ClipboardEvent) {
            inputValue = event.clipboardData.getData('Text');
        } else {
            inputValue = event.key;
        }

        if (!regexp.test(inputValue)) {
            event.preventDefault();
        }
    }

    setCampiModificati(richiesta: SintesiRichiesta) {
        if (richiesta.richiedente.telefono !== this.richiestaModificaIniziale.richiedente.telefono) {
            this.campiModificati.push('Telefono');
        }
        if (richiesta.richiedente.nominativo !== this.richiestaModificaIniziale.richiedente.nominativo) {
            this.campiModificati.push('Nominativo');
        }
        if (richiesta.localita.indirizzo !== this.richiestaModificaIniziale.localita.indirizzo) {
            this.campiModificati.push('Indirizzo');
        }
        if (richiesta.rilevanteGrave !== this.richiestaModificaIniziale.rilevanteGrave) {
            this.campiModificati.push('Rilevanza');
        }
        if (richiesta.rilevanteStArCu !== this.richiestaModificaIniziale.rilevanteStArCu) {
            this.campiModificati.push('RilevanzaStArCu');
        }
        if (richiesta.localita.piano !== this.richiestaModificaIniziale.localita.piano) {
            this.campiModificati.push('Piano');
        }
        if (richiesta.descrizione !== this.richiestaModificaIniziale.descrizione) {
            this.campiModificati.push('Descrizione');
        }
        if (richiesta.prioritaRichiesta !== this.richiestaModificaIniziale.prioritaRichiesta) {
            this.campiModificati.push('Priorita');
        }
        if (checkArrayModificato(richiesta.zoneEmergenza, this.richiestaModificaIniziale.zoneEmergenza)) {
            this.campiModificati.push('ZoneEmergenza');
        }
        if (checkArrayModificato(richiesta.tags, this.richiestaModificaIniziale.tags)) {
            this.campiModificati.push('Tags');
        }
        if (checkTipologieModificate(richiesta.tipologie, this.richiestaModificaIniziale.tipologie)) {
            this.campiModificati.push('Tipologie');
        }
        if (richiesta.listaEnti !== this.richiestaModificaIniziale.listaEnti) {
            this.campiModificati.push('ListaEnti');
        }
        // if (checkEntiModificati(richiesta.listaEnti, this.richiestaModificaIniziale.listaEnti)) {
        // this.campiModificati.push('Enti');
        // }
        console.log('campiModificati', this.campiModificati);

        function checkArrayModificato(arr1: string[], arr2: string[]) {
            let _return = false;
            let count = 0;
            const length = arr1.length;
            const lengthIniziale = arr2.length;

            if (length === lengthIniziale) {
                arr1.forEach((zona: string) => {
                    arr2.forEach((z: string) => {
                        if (zona === z) {
                            count++;
                        }
                    });
                });

                if (count !== length) {
                    _return = true;
                }
            } else {
                _return = true;
            }
            return _return;
        }

        function checkTipologieModificate(arr1: Tipologia[], arr2: Tipologia[]) {
            let _return = false;
            let count = 0;
            const length = arr1.length;
            const lengthIniziale = arr2.length;

            if (length === lengthIniziale) {
                arr1.forEach((tipologia: Tipologia) => {
                    arr2.forEach((t: Tipologia) => {
                        if (tipologia.codice === t.codice) {
                            count++;
                        }
                    });
                });

                if (count !== length) {
                    _return = true;
                }
            } else {
                _return = true;
            }
            return _return;
        }

        // function checkEntiModificati(arr1: Ente[], arr2: Ente[]) {
        //    let _return = false;
        //    let count = 0;
        //    const length = arr1.length;
        //    const lengthIniziale = arr2.length;
        //
        //    if (length === lengthIniziale) {
        //        arr1.forEach((enti: Ente) => {
        //            arr2.forEach((e: Ente) => {
        //                if (enti.codice === e.codice) {
        //                    count++;
        //                }
        //            });
        //        });
        //
        //        if (count !== length) {
        //            _return = true;
        //        }
        //    } else {
        //        _return = true;
        //    }
        //    return _return;
        // }
    }
}
