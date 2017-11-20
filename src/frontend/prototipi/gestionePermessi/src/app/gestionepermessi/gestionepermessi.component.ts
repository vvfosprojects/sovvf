import { Component, OnInit } from '@angular/core';

import { TreeModule, TreeNode } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { InputSwitchModule} from 'primeng/primeng';

import { SituazionePermessiFakeService } from "./servizi/situazione-permessi-fake.service";
import { SituazionePermessi } from "./situazione-permessi.model";
import { AdapterAlberoService } from "./servizi/adapter-albero.service";
import { RicercaPersonaFakeService } from './servizi/ricerca-persona-fake.service';

import { PermessoAssegnato } from "./permesso-assegnato.model";
import { UnitaOperativa } from "./unita-operativa.model";



@Component({
    selector: 'app-gestionepermessi',
    templateUrl: './gestionepermessi.component.html',
    styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {
    dataInizio: Date;
    dataFine: Date;
    it: any;
    minDate: Date;
    ricorsivo: boolean = true;

    //private situazionePermessi: SituazionePermessi;
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
        private adapterAlbero: AdapterAlberoService, private RicercaPersonaFakeService: RicercaPersonaFakeService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.it = {
            firstDayOfWeek: 1,
            dayNames: [ "domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato" ],
            dayNamesShort: [ "dom","lun","mar","mer","gio","ven","sab" ],
            dayNamesMin: [ "D","L","M","M","G","V","S" ],
            monthNames: [ "gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre" ],
            monthNamesShort: [ "gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic" ],
            today: 'Oggi',
            clear: 'Cancella'
        }

        let today = new Date();
        let month = today.getMonth();
        let year = today.getFullYear();
        let yearMax = year;
        this.minDate = today;
        // this.maxDate = new Date();
        // this.maxDate.setMonth(nextMonth);
        // this.maxDate.setFullYear(nextYear);

        this.situazionePermessiService.getSituazionePermessi()
            .subscribe(data => {
                this.primeNgTrees = data.unitaOperativeRadice.map(uo =>
                    this.adapterAlbero.converti(uo)
                );
                this.permessiAssegnati = data.permessiAssegnati;

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

    private assegnaPermessi() {
        this.confirmationService.confirm({
            message: 'Sei sicuro di voler assegnare i permessi selezionati?',
            header: 'Confirmation',
            icon: 'fa fa-question-circle',
            accept: () => {
                this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Permessi assegnati con successo' }];
            },
            reject: () => {
                this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'Operazione annullata' }];
            }
        });

    }

    private eliminaPermesso() {
        //implementare la funzione di chiamata al servizio per eliminare il record
        this.confirmationService.confirm({
            message: 'Sei sicuro di voler eliminare il permesso selezionato?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Permessi eliminati' }];
            },
            reject: () => {
                this.msgs = [{ severity: 'info', summary: 'Rejected', detail: 'Operazione annullata' }];
            }
        });
    }

    // filterNameSingle(event) {
    //     let query = event.query;
    //     this.RicercaPersonaFakeService.cerca().subscribe(names => {
    //         this.filteredNames = this.filterName(query, names);
    //     });
    //     //console.log("filteredNames: " + this.filteredNames);
    // }

    // filterName(query, names: any[]): any[] {
    //     //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    //     let filtered: any[] = [];
    //     for (let i = 0; i < names.length; i++) {
    //         let nominativo = names[i];
    //         if (nominativo.descrizione.toLowerCase().indexOf(query.toLowerCase()) > -1) {
    //             filtered.push(nominativo.descrizione);
    //         }

    //     }
    //     return filtered;
    // }

}
