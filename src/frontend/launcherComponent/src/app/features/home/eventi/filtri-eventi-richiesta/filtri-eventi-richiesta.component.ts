import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FiltroTargaMezzo } from '../filtro-targa-mezzo.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventoRichiesta } from '../../../../shared/model/evento-richiesta.model';

@Component({
  selector: 'app-filtri-eventi-richiesta',
  templateUrl: './filtri-eventi-richiesta.component.html',
  styleUrls: ['./filtri-eventi-richiesta.component.css']
})
export class FiltriEventiRichiestaComponent implements OnChanges {

  @Input() codiceRichiesta: string;
  @Input() listaTargaMezzo: FiltroTargaMezzo[];
  @Input() initValue: string[];
  @Input() iconeNomeClasseEvento: boolean;
  @Input() elencoEventi: EventoRichiesta[];

  @Output() targheSelezionate = new EventEmitter<string[]>();
  @Output() toggleIconeNomeClasseEvento = new EventEmitter<boolean>();

  form: FormGroup;
  targheSelezionateUniqe: FiltroTargaMezzo[] = [];

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      targheSelezionate: [{ value: '', disabled: true }]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.listaTargaMezzo && changes.listaTargaMezzo.currentValue) {
    //per rimuovere targhe duplicate
    const listaTargaMezzoFirst: FiltroTargaMezzo[] =  changes.listaTargaMezzo.currentValue;
    this.targheSelezionateUniqe = [];
    let uniqueObject = {};
    for (let i in listaTargaMezzoFirst) { 
        let objTitle = listaTargaMezzoFirst[i]['targa']; 
        uniqueObject[objTitle] = listaTargaMezzoFirst[i]; 
    } 
    for (let i in uniqueObject) { 
      this.targheSelezionateUniqe.push(uniqueObject[i]); 
    } 
    //-----------------------------
    console.log('Lista targa mezzo' , this.targheSelezionateUniqe)
    console.log('Change List targa mezzo' , changes.listaTargaMezzo)
    if (this.targheSelezionateUniqe.length > 0) {
      this.targaControl.enable();
    }
    }
    if (changes && changes.initValue && changes.initValue.currentValue) {
    const initValue: string = changes.initValue.currentValue;
    if (initValue) {
      this.targaControl.setValue(initValue);
    }
    }
  }

  get targaControl() {
    return this.form.controls.targheSelezionate;
  }

  onChange() {
    this.targheSelezionate.emit(this.targaControl.value);
  }

  mostraTesto(): string {
    if (this.targheSelezionateUniqe && this.targheSelezionateUniqe.length > 0) {
      return 'Filtra per mezzo';
    } else {
      return 'Non ci sono mezzi da filtrare';
    }
  }

  getIconaBottone() {
    let returnIcon = '';
    if (this.iconeNomeClasseEvento) {
      returnIcon = 'fa-align-left';
    } else {
      returnIcon = 'fa-eye';
    }
    return returnIcon;
  }

}
