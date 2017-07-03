import { Component, OnInit } from '@angular/core';
import { ListaMezziService } from "./lista-mezzi.service";
import { MezzoInServizio } from "../mezzoinservizio/mezzoinservizio.model";

@Component({
  selector: 'app-lista-mezzi',
  templateUrl: './lista-mezzi.component.html',
  styleUrls: ['./lista-mezzi.component.css']
})
export class ListaMezziComponent implements OnInit {
  private tuttiIMezzi: MezzoInServizio[];
  private mezzi: MezzoInServizio[];
  private filtroSedi = {};
  private filtroDisponibilita = { disponibile: { count: 0, checked: 0 }, nonDisponibile: { count: 0, checked: 0 } };
  private errorMessage: string;

  constructor(private listaMezziService: ListaMezziService) { }

  ngOnInit() {
    this.getMezzi();
  }

  /**
   * Questo metodo esegue la subscription all'observable del servizio di accesso
   * allo stato dei mezzi. In occasione di una nuova pubblicazione, viene assegnato il
   * vettore this.tuttiIMezzi all'intera collezione dei mezzi ricevuta, vengono aggiornati
   * i filtri sulle proprietà dei mezzi e viene aggiornata la visualizzazione della lista
   * dei mezzi.
   */
  private getMezzi() {
    this.listaMezziService.getMezzi()
      .subscribe(
      mezzi => {
        this.tuttiIMezzi = mezzi;
        this.aggiornaOggettoFiltroSedi();
        this.aggiornaOggettoFiltroDisponibilita();
        this.aggiornaMezziFiltrati();
      },
      error => this.errorMessage = <any>error
      )
  }

  /**
   * Questo metodo assegna alla proprietà this.filtroSedi un oggetto del tipo:
   * {
   *  "Nome Sede 1": { count: 3, checked: false },
   *  "Nome Sede 2": { count: 5, checked: false },
   *  "Nome Sede 3": { count: 1, checked: false },
   *  ...
   * }
   * 
   * L'oggetto ha tante chiavi quante sono le sedi nel resultset this.tuttiIMezzi.
   * Ad ogni chiave è associato un oggetto: il valore di count indica le occorrenze,
   * mentre checked viene impostato a false inizialmente.
   * In caso di aggiornamento della lista dei mezzi da parte del servizio, il vettore
   * subisce l'azzeramento di tutti i valori di count, il ricalcolo e l'eliminazione
   * delle proprietà con count pari a zero. Questo significa anche che il calore di checked
   * viene preservato (selezione persistente).
   */
  private aggiornaOggettoFiltroSedi() {
    //azzera tutti i valori correnti di count
    Object.keys(this.filtroSedi).forEach(key => {
      this.filtroSedi[key].count = 0;
    });

    this.filtroSedi = this.tuttiIMezzi.reduce((v, m) => {
      v[m.descrizioneUnitaOperativa] = v[m.descrizioneUnitaOperativa] || { count: 0, checked: false };
      v[m.descrizioneUnitaOperativa].count++;

      return v;
    }, this.filtroSedi);

    //elimina tutte le sedi senza mezzi, così da farle scomparire dalla casella di filtraggio
    Object.keys(this.filtroSedi).forEach(key => {
      if (this.filtroSedi[key].count === 0)
        delete this.filtroSedi[key];
    });
  }

  private aggiornaOggettoFiltroDisponibilita() {
    //azzera tutti i valori correnti di count
    this.filtroDisponibilita.disponibile.count = 0;
    this.filtroDisponibilita.nonDisponibile.count = 0;

    this.tuttiIMezzi.forEach(m => {
      if (m.disponibile)
        this.filtroDisponibilita.disponibile.count++;
      else
        this.filtroDisponibilita.nonDisponibile.count++;
    });
  }

  /**
   * Questo metodo viene invocato sul click di una casella di filtraggio. Il valore di sede è la chiave
   * della sede selezionata.
   */
  private selSede(event, sede) {
    this.filtroSedi[sede].checked = event.target.checked;
    this.aggiornaMezziFiltrati();
  }

  /**
   * Questo metodo viene invocato sul click di una casella di filtraggio per la disponibilità.
   */
  private selDisponibilita(event, disponibile) {
    if (disponibile)
      this.filtroDisponibilita.disponibile.checked = event.target.checked;
    else
      this.filtroDisponibilita.nonDisponibile.checked = event.target.checked;
    this.aggiornaMezziFiltrati();
  }

  /**
   * Restituisce tutte le chiavi dell'oggetto this.filtroSedi, cioè i nomi delle sedi.
   */
  private getSediKeys() {
    return Object.keys(this.filtroSedi);
  }

  /**
   * Assegna il vettore this.mezzi filtrando il vettore this.tuttiIMezzi in base allo
   * stato dei filtri sulla sede. Il vettore this,mezzi è effettivamente quello che si vede
   * nella lista dei mezzi.
   */
  private aggiornaMezziFiltrati() {
    var mezzi: MezzoInServizio[];

    mezzi = this.tuttiIMezzi;

    //filtro su sedi
    // si vedono solo i mezzi delle categorie spuntate
    if (Object.keys(this.filtroSedi)
      .map(key => this.filtroSedi[key])
      .some(x => x.checked)) {
      mezzi = this.mezzi.filter(m => this.filtroSedi[m.descrizioneUnitaOperativa].checked);
    }

    if (this.filtroDisponibilita.disponibile.checked || this.filtroDisponibilita.nonDisponibile.checked)
      mezzi = mezzi.filter(m =>
        m.disponibile && this.filtroDisponibilita.disponibile.checked ||
        !m.disponibile && this.filtroDisponibilita.nonDisponibile.checked
      );

    //mezzi = mezzi.filter(m => m.ricerca("ciao"));

    this.mezzi = mezzi;
  }
}
