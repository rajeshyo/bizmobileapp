import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, } from 'rxjs/operators';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(
    private http: HttpClient
  ) { }

  callHeader() {
    const headers = new HttpHeaders();
    headers.append('Content-Type' , 'application/x-www-form-urlencoded;charset=UTF-8');
    headers.append('Content-Type', 'Access-Control-Allow-Origin:*');
    return {
      headers
    };
 }

// Error handle
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

  getservicesListSync(moduledata, id = null): Observable<any> {
    console.log('hihiihii');
    console.log(id);
    const formdata = new FormData();
    formdata.append('_operation',  moduledata.operation);
    formdata.append('_session', moduledata.session);
    formdata.append('module', moduledata.module);
    if(id !=null){
      formdata.append('record', id);
    }
    formdata.append('values', moduledata.values);
    // http://realestatedemo.biztechnosys.com/
    // http://beml.biztechnosys.com/
    https://bizuiaccountingcrm.biztechnosys.com/
    // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, this.callHeader()).pipe(
    return this.http.post<any>('https://bizuiaccountingcrm.biztechnosys.com/modules/Mobile/api.php', formdata, this.callHeader()).pipe(
      tap((logindata: any) => console.log(`moduledata`)),
      catchError(this.handleError<any>('module'))
    );
  }


}