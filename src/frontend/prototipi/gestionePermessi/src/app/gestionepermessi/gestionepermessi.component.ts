import { Component, OnInit } from '@angular/core';
import { TreeModule, TreeNode } from 'primeng/primeng';
import { GrowlModule, Message } from 'primeng/primeng';
import { SituazionePermessiFakeService } from "app/gestionepermessi/situazione-permessi-fake.service";
import { SituazionePermessi } from "app/gestionepermessi/situazione-permessi.model";
import { AdapterAlberoService } from "app/gestionepermessi/adapter-albero.service";
import 'rxjs/add/operator/map';

@Component({
    selector: 'app-gestionepermessi',
    templateUrl: './gestionepermessi.component.html',
    styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {
    private situazionePermessi: SituazionePermessi;
    private primeNgTrees = [];

    msgs: Message[];
    files: TreeNode[];
    selectedFile: TreeNode;

    constructor(private situazionePermessiService: SituazionePermessiFakeService,
        private adapterAlbero: AdapterAlberoService) { }

    ngOnInit() {
        this.situazionePermessiService.getSituazionePermessi()
            .map(situazionePermessi => {
                this.situazionePermessi = situazionePermessi;
                this.primeNgTrees = this.situazionePermessi.unitaOperativeRadice.map(uo =>
                    this.adapterAlbero.converti(uo));
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
}
