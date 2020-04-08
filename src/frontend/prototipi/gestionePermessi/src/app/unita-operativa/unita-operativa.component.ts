import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UnitaOperativa } from "../model/unita-operativa.model";
import { TreeModule, TreeNode } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';

import { AdapterAlberoService } from '../service/adapter-albero.service';
import { SituazionePermessiFakeService } from "../service/situazione-permessi-fake.service";
import { Message } from 'primeng/components/common/message';
import { RicercaUnita } from 'app/model/ricerca-unita.model';
//import { CercaNominativoComponent } from 'app/cerca-nominativo/cerca-nominativo.component';
import { DatiRicerca } from 'app/model/dati-ricerca.model';

@Component({
  selector: 'app-unita-operativa',
  templateUrl: './unita-operativa.component.html',
  styleUrls: ['./unita-operativa.component.css']
})
export class UnitaOperativaComponent implements OnInit {
  //@Input() unitaOperativa: UnitaOperativa[];
  @Output() unitaOperativa: EventEmitter<RicercaUnita> = new EventEmitter<RicercaUnita>();

  msgs: Message[];
  public unitaSelezionate: any;
  ricorsivo : boolean = false;
  

  private primeNgTrees = [];
  
  constructor(private situazionePermessiService: SituazionePermessiFakeService,
    private adapterAlbero: AdapterAlberoService ) { }

  ngOnInit() {
    this.situazionePermessiService.getSituazionePermessi()
    .subscribe(data => {
        this.primeNgTrees = data.unitaOperativeRadice.map(uo =>
            this.adapterAlbero.converti(uo)
        );
    });
  }

  

  ricorsivoSelect() {
    if (this.ricorsivo) this.ricorsivo = false;
    else this.ricorsivo = true;

    this.unitaOperativa.emit({unitaOperSel : this.unitaSelezionate, ricorsivo : this.ricorsivo});
    console.log("unitaOperSel " + this.unitaSelezionate, "ricorsivo " + this.ricorsivo);
  }

  nodeSelect(event) {
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
    this.unitaSelezionate = event.node.data;
    this.unitaOperativa.emit({unitaOperSel : this.unitaSelezionate, ricorsivo : this.ricorsivo});
    console.log("unitaOperSel " + this.unitaSelezionate, "ricorsivo " + this.ricorsivo);
  }

  expandAll() {
    this.primeNgTrees.forEach(node => {
        this.expandRecursive(node, true);
    });
 }

  collapseAll() {
      this.primeNgTrees.forEach(node => {
          this.expandRecursive(node, false);
      });
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
      node.expanded = isExpand;
      if (node.children) {
          node.children.forEach(childNode => {
              this.expandRecursive(childNode, isExpand);
          });
      }
  }
}
