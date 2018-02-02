import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UnitaOperativa } from "../model/unita-operativa.model";
import { TreeModule, TreeNode } from 'primeng/primeng';

import { AdapterAlberoService } from '../service/adapter-albero.service';
import { SituazionePermessiFakeService } from "../service/situazione-permessi-fake.service";
import { Message } from 'primeng/components/common/message';
import { RicercaEvent } from 'app/model/ricerca-event.model';
import { CercaNominativoComponent } from 'app/cerca-nominativo/cerca-nominativo.component';

@Component({
  selector: 'app-unita-operativa',
  templateUrl: './unita-operativa.component.html',
  styleUrls: ['./unita-operativa.component.css']
})
export class UnitaOperativaComponent implements OnInit {
  @Input() unitaOperativa: UnitaOperativa;
  @Output() change: EventEmitter<RicercaEvent> = new EventEmitter<RicercaEvent>();

  msgs: Message[];
  unitaSelezionate: any;
  ricorsivo : boolean = false;
  nodoSelezionato : boolean = false;

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

  nodochecked() {
    if (this.nodoSelezionato) this.nodoSelezionato = false;
    else this.nodoSelezionato = true;

    this.change.emit({unitaOperSel : this.unitaSelezionate, ricorsivo : this.ricorsivo, nodoSelezionato : this.nodoSelezionato});
    console.log("unitaOperSel " + this.unitaSelezionate, "ricorsivo " + this.ricorsivo, "nodoSelezionato " + this.nodoSelezionato );
  }

  ricorsivoSelect() {
    if (this.ricorsivo) this.ricorsivo = false;
    else this.ricorsivo = true;

    this.change.emit({unitaOperSel : this.unitaSelezionate, ricorsivo : this.ricorsivo, nodoSelezionato : this.nodoSelezionato});
    console.log("unitaOperSel " + this.unitaSelezionate, "ricorsivo " + this.ricorsivo, "nodoSelezionato " + this.nodoSelezionato );
  }

  nodeSelect(event) {
    this.msgs = [];
    this.msgs.push({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
    this.unitaSelezionate = event.node.data;
    this.change.emit({unitaOperSel : this.unitaSelezionate, ricorsivo : this.ricorsivo, nodoSelezionato : this.nodoSelezionato});
    console.log("unitaOperSel " + this.unitaSelezionate, "ricorsivo " + this.ricorsivo, "nodoSelezionato " + this.nodoSelezionato );
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
