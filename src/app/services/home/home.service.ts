import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }
  // Error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getModuleList(moduledata, options): Observable<any> {
    const formdata = new FormData();
    formdata.append('_operation', 'loginAndFetchModules');
    formdata.append('username', moduledata.username);
    formdata.append('password', moduledata.password);
    formdata.append('session', moduledata.session);
    // http://realestatedemo.biztechnosys.com/
    // http://beml.biztechnosys.com/
    // https://bizuiaccountingcrm.biztechnosys.com/
    // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, options).pipe(
    return this.http.post<any>('https://bizuiaccountingcrm.biztechnosys.com/modules/Mobile/api.php', formdata, options).pipe(
      tap((logindata: any) => console.log(`moduledata`)),
      catchError(this.handleError<any>('module'))
    );
  }

}
