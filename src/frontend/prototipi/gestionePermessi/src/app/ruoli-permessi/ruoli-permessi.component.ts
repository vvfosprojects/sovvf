import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Permesso } from 'app/model/permesso.model';
import { Ruolo } from 'app/model/ruolo.model';
import { CheckboxModule } from 'primeng/primeng';

@Component({
  selector: 'app-ruoli-permessi',
  templateUrl: './ruoli-permessi.component.html',
  styleUrls: ['./ruoli-permessi.component.css']
})
export class RuoliPermessiComponent implements OnInit {
  @Output() ruoli: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  ruoliSelezionati : string[] = [];
  permessiSelezionati : string[];
  ruoliPermessi : string[];
  
  constructor() { }

  ngOnInit() {
  }
  
  salvaRuoliPermessi() {
    this.ruoliPermessi = this.ruoliSelezionati.concat(this.permessiSelezionati);
    this.ruoli.emit(this.ruoliPermessi);
    console.log(this.ruoliPermessi);
    
  }
}
