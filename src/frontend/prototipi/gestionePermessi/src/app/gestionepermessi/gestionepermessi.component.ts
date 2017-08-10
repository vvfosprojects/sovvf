import { Component, OnInit } from '@angular/core';

import { TreeModule, TreeNode } from 'primeng/primeng';
import { DataTableModule,SharedModule} from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { CheckboxModule} from 'primeng/primeng';
import { ButtonModule} from 'primeng/primeng';

import { SituazionePermessiFakeService } from "app/gestionepermessi/servizi/situazione-permessi-fake.service";
import { SituazionePermessi } from "app/gestionepermessi/situazione-permessi.model";
import { AdapterAlberoService } from "app/gestionepermessi/servizi/adapter-albero.service";

import 'rxjs/add/operator/map';
import { PermessoAssegnato } from "app/gestionepermessi/permesso-assegnato.model";
import { UnitaOperativa } from "app/gestionepermessi/unita-operativa.model";
import { PersonaleDaAutorizzareService } from "app/gestionepermessi/servizi/personale-da-autorizzare.service";


@Component({
    selector: 'app-gestionepermessi',
    templateUrl: './gestionepermessi.component.html',
    styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {
    private situazionePermessi: SituazionePermessi;
    private primeNgTrees = [];
    //private sitPerm;
    private testoRicerca: string;
    checkNodeSelected: boolean = false;
    permessiAssegnati: PermessoAssegnato[];
    cols: any[];

    ruoliSelezionati: string[] = [];
    permessiSelezionati: string[] = [];
    filteredNames: any[];
    nominativo: any;
    names: any[]; 

    msgs: Message[];
    //files: TreeNode[];
    //selectedFile: TreeNode;

    constructor(private situazionePermessiService: SituazionePermessiFakeService,
        private adapterAlbero: AdapterAlberoService, private personaleDaAutorizzareService: PersonaleDaAutorizzareService) { }

    ngOnInit() {
        
        //==>>>> controllare perché non funziona chiamata al servizio <<<<=====
        
        // this.situazionePermessiService.getSituazionePermessi()
        //     .map(situazionePermessi => {
        //         this.situazionePermessi = situazionePermessi;
                
        //         this.primeNgTrees = this.situazionePermessi.unitaOperativeRadice.map(uo =>
        //             this.adapterAlbero.converti(uo));
                
        //         this.permessiAssegnati = this.situazionePermessi.permessiAssegnati;
                
        //     });
        
        this.primeNgTrees = 
        [
            new UnitaOperativa("0","DIR-LAZ", "Direzione Regionale Lazio", [
                new UnitaOperativa("1","COM-RM", "Comando Provinciale Roma", []),
                new UnitaOperativa("3","COM-RT", "Comando Provinciale Rieti", []),
                new UnitaOperativa("4","COM-VT", "Comando Provinciale Viterbo", []),
                new UnitaOperativa("5","COM-LT", "Comando Provinciale Latina", []),
                new UnitaOperativa("7","COM-FR", "Comando Provinciale Frosinone", []),
            ]),
            new UnitaOperativa("0", "COA_MAR","COA Marche", [])
        ].map(uo => this.adapterAlbero.converti(uo));

        this.permessiAssegnati = 
        [
            new PermessoAssegnato("0", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può inserire interventi", "Comando Roma", true, new Date(2017, 5, 5, 10, 9, 20), null),
            new PermessoAssegnato("1", "Manuela Marzotti", "MZTMNL11Y23T666I", "Può vedere interventi", "Comando Roma", false, new Date(2016, 5, 9, 11, 8, 22), new Date(2017, 5, 9, 11, 8, 22))
        ];

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

    private clearSearchText(): void {
       this.nominativo = null;
    }

    private eliminaPermesso() {
        //implementare la funzione di chiamata al servizio per eliminare il record
     }

     filterNameSingle(event){
        let query = event.query;
        this.personaleDaAutorizzareService.getNominativi().subscribe(names => {
            this.filteredNames = this.filterName(query, names);
        });
        console.log("filteredNames: " + this.filteredNames);
    }

    filterName(query, names: any[]):any[] {
        //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
        let filtered : any[] = [];
        for(let i = 0; i < names.length; i++) {
            let nominativo = names[i];
            if(nominativo.descrizione.toLowerCase().indexOf(query.toLowerCase()) > -1) {
                filtered.push(nominativo.descrizione);
            }
            
        }
        return filtered;
    }

}
