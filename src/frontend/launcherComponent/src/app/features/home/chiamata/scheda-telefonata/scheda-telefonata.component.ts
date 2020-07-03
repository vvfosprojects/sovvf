import {Component, Input, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Localita} from 'src/app/shared/model/localita.model';
import {Coordinate} from 'src/app/shared/model/coordinate.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Address} from 'ngx-google-places-autocomplete/objects/address';
import {SchedaTelefonataInterface} from '../../../../shared/interface/scheda-telefonata.interface';
import {ChiamataMarker} from '../../maps/maps-model/chiamata-marker.model';
import {makeID, roundTodecimal} from '../../../../shared/helper/function';
import {AzioneChiamataEnum} from '../../../../shared/enum/azione-chiamata.enum';
import {Select, Store} from '@ngxs/store';
import {ShowToastr} from '../../../../shared/store/actions/toastr/toastr.actions';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Utente} from '../../../../shared/model/utente.model';
import {ClearClipboard} from '../../store/actions/chiamata/clipboard.actions';
import {ReducerSchedaTelefonata, StartChiamata} from '../../store/actions/chiamata/scheda-telefonata.actions';
import {Richiedente} from '../../../../shared/model/richiedente.model';
import {StatoRichiesta} from '../../../../shared/enum/stato-richiesta.enum';
import {OFFSET_SYNC_TIME} from '../../../../core/settings/referral-time';
import {ToastrType} from '../../../../shared/enum/toastr';
import {SintesiRichiesta} from '../../../../shared/model/sintesi-richiesta.model';
import {Observable, Subscription} from 'rxjs';
import {SchedaTelefonataState} from '../../store/states/chiamata/scheda-telefonata.state';
import {DelChiamataMarker} from '../../store/actions/maps/chiamate-markers.actions';
import {Tipologia} from '../../../../shared/model/tipologia.model';
import {SchedeContattoState} from '../../store/states/schede-contatto/schede-contatto.state';
import {SchedaContatto} from 'src/app/shared/interface/scheda-contatto.interface';
import {ConfirmModalComponent} from '../../../../shared';
import {HomeState} from '../../store/states/home.state';
import {Options} from 'ngx-google-places-autocomplete/objects/options/options';
import {LatLngBounds} from 'ngx-google-places-autocomplete/objects/latLngBounds';
import {UpdateFormValue} from "@ngxs/form-plugin";

@Component({
  selector: 'app-scheda-telefonata',
  templateUrl: './scheda-telefonata.component.html',
  styleUrls: ['./scheda-telefonata.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SchedaTelefonataComponent implements OnInit, OnDestroy {

  ngxGooglePlacesOptions: Options;

  chiamataMarker: ChiamataMarker;
  chiamataForm: FormGroup;
  coordinate: Coordinate;
  submitted = false;

  idChiamata: string;

  AzioneChiamataEnum = AzioneChiamataEnum;

  @Input() tipologie: Tipologia[];
  @Input() operatore: Utente;
  @Input() disabledInviaPartenza = false;
  @Input() loading: boolean;

  nuovaRichiesta: SintesiRichiesta;
  isCollapsed = true;

  idSchedaContatto: string;

  subscription = new Subscription();

  @Select(SchedaTelefonataState.resetChiamata) resetChiamata$: Observable<boolean>;
  @Select(SchedeContattoState.schedaContattoTelefonata) schedaContattoTelefonata$: Observable<SchedaContatto>;

  constructor(private formBuilder: FormBuilder,
              private store: Store,
              private modalService: NgbModal) {
    this.store.dispatch(new StartChiamata());
    this.ngxGooglePlacesOptions = new Options({
      bounds: this.store.selectSnapshot(HomeState.bounds) as unknown as LatLngBounds,
      // tolto si possono inserire fino a un massimo di 5 paesi, i paesi confinanti sono 6
      // ['IT', 'FR', 'AT', 'CH', 'SI', 'VA']
      // componentRestrictions: GOOGLEPLACESOPTIONS.componentRestrictions as unknown as ComponentRestrictions
    });

  }

  ngOnInit() {
    this.chiamataForm = this.createForm();
    this.initNuovaRichiesta();
    this.idChiamata = this.makeIdChiamata();
    this.nuovaRichiesta.istanteRicezioneRichiesta = new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]);

    this.subscription.add(this.resetChiamata$.subscribe((reset: boolean) => {
      if (reset) {
        this.chiamataForm.reset();
      }
    }));
    this.subscription.add(this.schedaContattoTelefonata$.subscribe((schedaContattoTelefonata: SchedaContatto) => {
      if (schedaContattoTelefonata && schedaContattoTelefonata.codiceScheda) {
        if (!this.idSchedaContatto) {
          this.setSchedaContatto(schedaContattoTelefonata);
          this.idSchedaContatto = schedaContattoTelefonata.codiceScheda;
        }
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      selectedTipologie: [null, Validators.required],
      nominativo: [null, Validators.required],
      telefono: [null, [Validators.required, Validators.pattern('^(\\+?)[0-9]+$')]],
      indirizzo: [null, Validators.required],
      latitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
      longitudine: [null, [Validators.required, Validators.pattern('^(\\-?)([0-9]+)(\\.)([0-9]+)$')]],
      piano: [null],
      etichette: [null],
      noteIndirizzo: [null],
      rilevanzaGrave: [false],
      rilevanzaStArCu: [false],
      notePrivate: [null],
      notePubbliche: [null],
      descrizione: [null],
      zoneEmergenza: [null],
      prioritaRichiesta: [3, Validators.required]
    });
  }

  get f() {
    return this.chiamataForm.controls;
  }

  initNuovaRichiesta() {
    this.nuovaRichiesta = new SintesiRichiesta(
      null,
      null,
      null,
      new Utente(this.operatore.id, this.operatore.nome, this.operatore.cognome, this.operatore.codiceFiscale, this.operatore.sede, this.operatore.username),
      null,
      StatoRichiesta.Chiamata,
      0,
      null,
      null,
      null,
      null,
      null,
      null
    );
    this.nuovaRichiesta.rilevanteStArCu = false;
    this.nuovaRichiesta.rilevanteGrave = false;
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

  getChiamataForm() {
    const f = this.f;
    this.nuovaRichiesta.richiedente = new Richiedente(f.telefono.value, f.nominativo.value);
    this.nuovaRichiesta.localita.note = f.noteIndirizzo.value;
    this.nuovaRichiesta.localita.coordinate.longitudine = f.longitudine.value;
    this.nuovaRichiesta.localita.coordinate.latitudine = f.latitudine.value;
    this.nuovaRichiesta.tags = (f.etichette.value && f.etichette.value.length) ? f.etichette.value : null;
    this.nuovaRichiesta.rilevanteGrave = f.rilevanzaGrave.value;
    this.nuovaRichiesta.rilevanteStArCu = f.rilevanzaStArCu.value;
    this.nuovaRichiesta.descrizione = f.descrizione.value;
    this.nuovaRichiesta.zoneEmergenza = f.zoneEmergenza.value ? f.zoneEmergenza.value.split(' ') : null;
    this.nuovaRichiesta.notePrivate = f.notePrivate.value;
    this.nuovaRichiesta.notePubbliche = f.notePubbliche.value;
    this.nuovaRichiesta.prioritaRichiesta = f.prioritaRichiesta.value;
    this.nuovaRichiesta.localita.piano = f.piano.value;
    this.nuovaRichiesta.codiceSchedaNue = this.idSchedaContatto ? this.idSchedaContatto : null;

    this.setDescrizione();
    console.log('Nuova Richiesta', this.nuovaRichiesta);
  }

  onAddTipologia(tipologia: any) {
    if (!this.nuovaRichiesta.tipologie) {
      this.nuovaRichiesta.tipologie = [];
      this.onAddTipologia(tipologia);
    } else {
      this.nuovaRichiesta.tipologie.push(tipologia);
    }
  }

  onRemoveTipologia(tipologia: any) {
    this.nuovaRichiesta.tipologie.splice(this.nuovaRichiesta.tipologie.indexOf(tipologia.codice), 1);
  }

  checkTipologie(): boolean {
    return !!!(this.nuovaRichiesta.tipologie && (this.nuovaRichiesta.tipologie.length > 0));
  }

  clearTipologieSelezionate() {
    this.f.selectedTipologie.patchValue([]);
    this.nuovaRichiesta.tipologie = [];
  }

  onAnnullaChiamata(): void {
    if (!this.checkNessunCampoModificato()) {
      const modalConfermaAnnulla = this.modalService.open(ConfirmModalComponent, {
        backdropClass: 'light-blue-backdrop',
        centered: true
      });
      modalConfermaAnnulla.componentInstance.icona = {descrizione: 'trash', colore: 'danger'};
      modalConfermaAnnulla.componentInstance.titolo = 'Annulla Chiamata';
      modalConfermaAnnulla.componentInstance.messaggio = 'Sei sicuro di voler annullare la chiamata?';
      modalConfermaAnnulla.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti saranno eliminati.';
      modalConfermaAnnulla.componentInstance.bottoni = [
        {type: 'ko', descrizione: 'Annulla', colore: 'secondary'},
        {type: 'ok', descrizione: 'Conferma', colore: 'danger'},
      ];

      modalConfermaAnnulla.result.then(
        (val) => {
          switch (val) {
            case 'ok':
              this.chiamataForm.reset();
              this.nuovaRichiesta.tipologie = [];
              this._statoChiamata('annullata');
              break;
            case 'ko':
              console.log('Azione annullata');
              break;
          }
          console.log('Modal chiusa con val ->', val);
        },
        (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
      );
    } else {
      this._statoChiamata('annullata');
    }
  }

  checkNessunCampoModificato() {
    let _return = false;
    if (!this.f.selectedTipologie.value && !this.f.nominativo.value && !this.f.telefono.value
      && !this.f.indirizzo.value && !this.f.latitudine.value && !this.f.longitudine.value
      && !this.f.piano.value && !this.f.etichette.value && !this.f.noteIndirizzo.value
      && !this.f.rilevanzaGrave.value && !this.f.rilevanzaStArCu.value
      && !this.f.notePrivate.value && !this.f.notePubbliche.value
      && !this.f.descrizione.value && !this.f.zoneEmergenza.value
      && this.f.prioritaRichiesta.value === 3) {
      _return = true;
    }
    return _return;
  }

  onResetChiamata(): void {
    const modalConfermaReset = this.modalService.open(ConfirmModalComponent, {
      backdropClass: 'light-blue-backdrop',
      centered: true
    });
    modalConfermaReset.componentInstance.icona = {descrizione: 'exclamation-triangle', colore: 'danger'};
    modalConfermaReset.componentInstance.titolo = 'Reset Chiamata';
    modalConfermaReset.componentInstance.messaggio = 'Sei sicuro di voler effettuare il reset della chiamata?';
    modalConfermaReset.componentInstance.messaggioAttenzione = 'Tutti i dati inseriti verranno eliminati.';
    modalConfermaReset.componentInstance.bottoni = [
      {type: 'ko', descrizione: 'Annulla', colore: 'secondary'},
      {type: 'ok', descrizione: 'Conferma', colore: 'danger'},
    ];

    modalConfermaReset.result.then(
      (val) => {
        switch (val) {
          case 'ok':
            this.submitted = false;
            this.chiamataForm.reset();
            this.clearTipologieSelezionate();
            this.coordinate = null;
            this.store.dispatch(new ClearClipboard());
            this._statoChiamata('reset');
            this.store.dispatch(new DelChiamataMarker(this.idChiamata));
            this.isCollapsed = true;
            break;
          case 'ko':
            console.log('Azione annullata');
            break;
        }
        console.log('Modal chiusa con val ->', val);
      },
      (err) => console.error('Modal chiusa senza bottoni. Err ->', err)
    );
  }

  onCopiaIndirizzo(): void {
    this._statoChiamata('copiaIndirizzo');
  }

  onCercaIndirizzo(result: Address): void {
    const lat = roundTodecimal(result.geometry.location.lat(), 6);
    const lng = roundTodecimal(result.geometry.location.lng(), 6);
    this.coordinate = new Coordinate(lat, lng);
    this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
      new Localita(this.coordinate ? this.coordinate : null, result.formatted_address), null
    );
    this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, result.formatted_address, null);
    this.f.latitudine.patchValue(lat);
    this.f.longitudine.patchValue(lng);
    this._statoChiamata('cerca');
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

  toggleCollapsed(): void {
    if (this.checkSubmit()) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  formIsValid(): boolean {
    const messageArr: string[] = this.countErrorForm();
    let message = messageArr.join(', ');
    const title = messageArr.length > 1 ? 'Campi obbligatori:' : 'Campo obbligatorio:';
    if (messageArr.length > 0) {
      message = message.substring(0, message.length - 2);
      const type = ToastrType.Error;
      this.store.dispatch(new ShowToastr(ToastrType.Clear));
      this.store.dispatch(new ShowToastr(type, title, message));
    } else {
      this.store.dispatch(new ShowToastr(ToastrType.Clear));
    }
    return !!this.chiamataForm.invalid;
  }

  countErrorForm(): string[] {
    let error = '';
    error += this.f.selectedTipologie.errors ? 'Tipologia;' : '';
    error += this.f.nominativo.errors ? 'Nominativo;' : '';
    // error += this.f.cognome.errors ? 'Cognome;' : '';
    // error += this.f.nome.errors ? 'Nome;' : '';
    // error += this.f.ragioneSociale.errors ? 'Ragione Sociale;' : '';
    error += this.f.telefono.errors ? 'Telefono;' : '';
    error += this.f.indirizzo.errors ? 'Indirizzo;' : '';
    // error += this.f.descrizione.errors ? 'Motivazione;' : '';
    const errors: string[] = error.split(/\s*(?:;|$)\s*/);
    return errors;
  }

  checkCollapsed(): boolean {
    return !(this.chiamataForm.valid && !!this.coordinate);
  }

  impostaAzioneChiamata($event: AzioneChiamataEnum) {
    if ($event === AzioneChiamataEnum.InviaPartenza || $event === AzioneChiamataEnum.MettiInCoda) {
      this.nuovaRichiesta.azione = $event;
    } else {
      this.nuovaRichiesta.azione = $event;
      this.nuovaRichiesta.stato = StatoRichiesta.Chiusa;
    }
    this.onSubmit($event);
  }

  checkSubmit(): boolean {
    return (!this.formIsValid() && !!this.coordinate);
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

  setDescrizione(): void {
    const form = this.f;
    if (!form.descrizione.value) {
      // console.log(form.selectedTipologie.value);
      const nuovaDescrizione = this.tipologie.filter(tipologia => tipologia.codice === form.selectedTipologie.value[0]);
      if (nuovaDescrizione) {
        this.nuovaRichiesta.descrizione = nuovaDescrizione[0].descrizione;
      }
    }
  }

  setSchedaContatto(scheda: SchedaContatto) {
    const f = this.f;

    f.nominativo.patchValue(scheda.richiedente.nominativo);
    f.telefono.patchValue(scheda.richiedente.telefono);
    f.indirizzo.patchValue(scheda.localita.indirizzo);

    const lat = scheda.localita.coordinate.latitudine;
    const lng = scheda.localita.coordinate.longitudine;
    this.coordinate = new Coordinate(lat, lng);
    this.chiamataMarker = new ChiamataMarker(this.idChiamata, `${this.operatore.nome} ${this.operatore.cognome}`, `${this.operatore.sede.codice}`,
      new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo), null
    );
    this.nuovaRichiesta.localita = new Localita(this.coordinate ? this.coordinate : null, scheda.localita.indirizzo, null);
    this.f.latitudine.patchValue(lat);
    this.f.longitudine.patchValue(lng);
    this._statoChiamata('cerca');
  }

  onSubmit(azione?: AzioneChiamataEnum) {
    this.submitted = true;
    if (this.checkSubmit()) {
      this.getChiamataForm();
      this._statoChiamata('inserita', azione);
    }
  }

  _statoChiamata(tipo: string, azione?: AzioneChiamataEnum) {

    const schedaTelefonata: SchedaTelefonataInterface = {
      tipo: tipo,
      nuovaRichiesta: this.nuovaRichiesta,
      markerChiamata: this.chiamataMarker
    };

    if (azione) {
      schedaTelefonata.azioneChiamata = azione;
    }

    this.store.dispatch(new ReducerSchedaTelefonata(schedaTelefonata));
  }

  makeIdChiamata(): string {
    return `${this.operatore.sede.codice}-${this.operatore.id}-${makeID(8)}`;
  }

  // onTerreniSelezionati($event: TipoTerreno[]): void {
  //     this.nuovaRichiesta.tipoTerreno = $event;
  // }

}
