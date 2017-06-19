import { Component, OnInit } from '@angular/core';
import {TreeModule,TreeNode} from 'primeng/primeng';
import {GrowlModule,Message} from 'primeng/primeng';
import { GestionePermessiFakeService } from "./gestione-permessi-fake.service";

@Component({
  selector: 'app-gestionepermessi',
  templateUrl: './gestionepermessi.component.html',
  styleUrls: ['./gestionepermessi.component.css']
})
export class GestionepermessiComponent implements OnInit {

  msgs: Message[];
  files: TreeNode[];
  selectedFile: TreeNode;

  constructor(private gestionePermessiService: GestionePermessiFakeService) { }

  ngOnInit() {
    this.gestionePermessiService.getFiles().then(files => this.files = files);
  }

  nodeSelect(event){
    this.msgs=[];
    this.msgs.push({severity:'info', summary:'Node Selected', detail: event.node.label});
  }

  nodeUnselected(event){
    this.msgs=[];
    this.msgs.push({severity:'info', summary:'Node Selected', detail: event.node.label})
  }

  expandAll(){
      this.files.forEach( node => {
          this.expandRecursive(node, true);
      } );
  }

  collapseAll(){
      this.files.forEach( node => {
          this.expandRecursive(node, false);
      } );
  }

  private expandRecursive(node:TreeNode, isExpand:boolean){
     node.expanded = isExpand;
      if(node.children){
          node.children.forEach( childNode => {
             this.expandRecursive(childNode, isExpand);
          } );
      }
  }
}
