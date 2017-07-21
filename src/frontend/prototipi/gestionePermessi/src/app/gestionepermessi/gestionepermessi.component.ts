import { Component, OnInit } from '@angular/core';

import { TreeModule, TreeNode } from 'primeng/primeng';
import { DataTableModule,SharedModule} from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { CheckboxModule} from 'primeng/primeng';
import { ButtonModule} from 'primeng/primeng';

import { SituazionePermessiFakeService } from "app/gestionepermessi/situazione-permessi-fake.service";
import { SituazionePermessi } from "app/gestionepermessi/situazione-permessi.model";
import { AdapterAlberoService } from "app/gestionepermessi/adapter-albero.service";

import 'rxjs/add/operator/map';
import { PermessoAssegnato } from "app/gestionepermessi/permesso-assegnato.model";


@Component({
    selector: 'app-gestionepermessi',
    templateUrl: './gestionepermessi.component.html',
    styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {
    private situazionePermessi: SituazionePermessi;
    private primeNgTrees = [];
    private sitPerm;
    private testoRicerca: string;
    checkNodeSelected: boolean = false;
    permessiAssegnati: PermessoAssegnato[];
    cols: any[];

    ruoliSelezionati: string[] = [];
    permessiSelezionati: string[] = [];

    msgs: Message[];
    files: TreeNode[];
    selectedFile: TreeNode;

    constructor(private situazionePermessiService: SituazionePermessiFakeService,
        private adapterAlbero: AdapterAlberoService) { }

    ngOnInit() {
        this.cols = [
            {field: 'descrizione', header: 'Descrizione'},
            {field: 'unitaOperativa', header: 'Unità Operativa'},
            {field: 'dataInizio', header: 'Data inizio'},
            {field: 'dataFine', header: 'Data fine'},
            {field: 'ricorsivo', header: 'Ricorsivo'},
            {field: 'azioni', header: 'Azioni'}
        ];


          this.files = JSON.parse(`
            {
        "data": 
        [
            {
                "label": "Lazy Node 0",
                "data": "Node 0",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "leaf": false
            },
            {
                "label": "Lazy Node 1",
                "data": "Node 1",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "leaf": false
            },
            {
                "label": "Lazy Node 1",
                "data": "Node 2",
                "expandedIcon": "fa-folder-open",
                "collapsedIcon": "fa-folder",
                "leaf": false
            }
        ]
        }
        `).data;  
         this.situazionePermessiService.getSituazionePermessi()
            .map(situazionePermessi => {
                this.situazionePermessi = situazionePermessi;
                
                this.primeNgTrees = this.situazionePermessi.unitaOperativeRadice.map(uo =>
                    this.adapterAlbero.converti(uo));

                //this.permessiAssegnati = situazionePermessi.permessiAssegnati;
            });
    }

    nodeSelect(event) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Node Selected', detail: event.node.label });
    }

    nodeUnselected(event) {
        this.msgs = [];
        this.msgs.push({ severity: 'info', summary: 'Node Selected', detail: event.node.label })
    }

    expandAll() {
        this.files.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll() {
        this.files.forEach(node => {
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

    private clearSearchText(): void {
       this.testoRicerca = null;
    }

}
