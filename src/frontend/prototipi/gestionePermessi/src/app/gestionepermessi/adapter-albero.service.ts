import { Injectable } from '@angular/core';
import { UnitaOperativa } from "app/gestionepermessi/unita-operativa.model";
import { TreeNode } from "primeng/primeng";

/**
 * Questo servizio converte la rappresentazione di modello di un'unità operativa
 * in un'istanza di albero così come richiesta da primeng
 */
@Injectable()
export class AdapterAlberoService {

  constructor() { }

  public converti(uo: UnitaOperativa): TreeNode {
       console.log("descrizione: " + uo.descrizione);

       console.log("tooltip: " + uo.tooltip);
       
       let treeNode: TreeNode = {
            label: uo.descrizione,
            data: uo.tooltip,
            expandedIcon: "fa-folder-open",
            collapsedIcon: "fa-folder",            
            children: []    
       };
        return treeNode;
  }

}
