import { Injectable } from '@angular/core';
import {TreeModule,TreeNode} from 'primeng/primeng';
import {Http, Headers, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { RuoloUtente } from "app/gestionepermessi/ruolo-utente.model";

@Injectable()
export class GestionePermessiFakeService {

   /*private ruoli: RuoloUtente[] = [
     new 
   ]*/


  constructor(private http: Http) { }

  getFiles() {
        return this.http.get('assets/data/files.json')
                    .toPromise()
                    .then(res => <TreeNode[]> res.json().data);
    }

}
