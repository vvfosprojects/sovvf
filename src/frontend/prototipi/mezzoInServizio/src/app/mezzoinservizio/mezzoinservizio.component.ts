import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { MezzoInServizio } from './mezzoinservizio.model';
import { ModificaStatoMezzo } from './modifica-stato-mezzo.model';
import { DescStatoMap } from './desc-stato-map.class';

@Component({
  selector: 'app-mezzoinservizio',
  templateUrl: './mezzoinservizio.component.html',
  styleUrls: ['./mezzoinservizio.component.css']
})
export class MezzoinservizioComponent implements OnInit {
  private mapperDescStato = new DescStatoMap();
  private _mostraPersone: boolean = false;
  private mf : ModificaStatoMezzo = new ModificaStatoMezzo('', '','');
  

  @Input() mezzo: MezzoInServizio;
  
  @Output() modificaStato : EventEmitter<ModificaStatoMezzo> = new EventEmitter();
  

  constructor() {}

  ngOnInit() {
   
  }

  get fs(): MezzoInServizio {

    return this.mezzo;

  }
    
  public getDescrizioneStato(codice: string): string {
    return this.mapperDescStato.map(codice);
  }

   private setDisponibile(isSet: boolean): void {
    this.fs.disponibile = isSet;
  }
  private setCodiceStato(isSet: string): void {
    this.fs.codiceStato = isSet;
  }

  private numeroPersone(): number {
    return !!this.fs.personeSulMezzo && this.fs.personeSulMezzo.length;
  }

  private statiSucc() : string {
    var elem_last: string = ' ';
  
    elem_last = this.fs.codiciStatoSucc.length.toString();

    return elem_last;
  }

  private hideMostraPersone(): void {
    this._mostraPersone = !this._mostraPersone;
  }

  get mostraPersone(): boolean {
    return this._mostraPersone;
  }


  public clickStato(codiceS: string) {
      
    this.mf.codice = this.fs.codice;
    this.mf.codiceStato = codiceS;
    console.log("MezzoinServizio");
    console.log(this.mf);
    this.modificaStato.emit(this.mf);
}

  
}



