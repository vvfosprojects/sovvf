import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TreeModule, TreeNode } from 'primeng/primeng';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { ConfirmationService } from 'primeng/primeng';
import { InputSwitchModule} from 'primeng/primeng';


import { SituazionePermessiFakeService } from "../service/situazione-permessi-fake.service";

import { PermessoAssegnato } from "../model/permesso-assegnato.model";

import { NuovoPermesso } from '../model/nuovo-permesso.model';


@Component({
    selector: 'app-gestionepermessi',
    templateUrl: './gestionepermessi.component.html',
    styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {
    //@Input() permessoAssegnato: PermessoAssegnato;
    @Output() nuovoPermesso = new EventEmitter<NuovoPermesso>();
        
    private testoRicerca: string;
    checkNodeSelected: boolean = false;
    permessiAssegnati: PermessoAssegnato[];
    
    cols: any[];
    msgs: Message[];
    codiceUnitaOperativa: string;
    ruoliSelezionati: string[] = [];
    permessiSelezionati: string[] = [];
    names: any[];

    
    //files: TreeNode[];
    //selectedFile: TreeNode;

    constructor(private situazionePermessiService: SituazionePermessiFakeService,
        private confirmationService: ConfirmationService) { }

    ngOnInit() {
        this.situazionePermessiService.getSituazionePermessi()
            .subscribe(data => {
                this.permessiAssegnati = data.permessiAssegnati;

            });
    }

    private assegnaPermesso() {
        this.confirmationService.confirm({
            message: 'Sei sicuro di voler assegnare i permessi selezionati?',
            header: 'Confirmation',
            icon: 'fa fa-question-circle',
            accept: () => {
                this.msgs = [{ severity: 'info', summary: 'Confirmed', detail: 'Permessi assegnati con successo' }];
                //this.nuovoPermesso.emit(this.permessiAssegnati);
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


}
