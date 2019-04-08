import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { handleError } from '../../../shared/helper/handleError';
import { environment } from '../../../../environments/environment';
import { TreeItem } from 'ngx-treeview';

const API_URL = environment.apiUrl.listaSedi;

export class ListaSediService {

  constructor(private http: HttpClient) {
  }

  public getListaSedi(): Observable<TreeItem> {
    return this.http.get<TreeItem>(API_URL).pipe(
        retry(3),
        catchError(handleError)
    );
  }
}
