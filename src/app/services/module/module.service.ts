import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { catchError, tap, map, } from 'rxjs/operators';
import { Http, Headers, RequestOptions } from '@angular/http';
import { HttpHeaders  } from '@angular/common/http';
import { environment} from '../../../environments/environment'

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
    // console.log('hihiihii');
    // console.log(id);
    const formdata = new FormData();
    formdata.append('_operation',  moduledata.operation);
    formdata.append('_session', moduledata.session);
    formdata.append('module', moduledata.module);

    // formdata.append('record', '10x7925');
    // formdata.append('relatedmodule', 'Products');

    let url = environment.baseurl
    if(id !=null){
      formdata.append('record', id);
    }
    formdata.append('values', moduledata.values);
    
    // http://realestatedemo.biztechnosys.com/
    // http://beml.biztechnosys.com/
    https://bizuiaccountingcrm.biztechnosys.com/
    // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, this.callHeader()).pipe(
    return this.http.post<any>(url, formdata, this.callHeader()).pipe(
      tap((logindata: any) => console.log(`moduledata`)),
      catchError(this.handleError<any>('module'))
    );
  }


  getModuleListRelation(moduledata, options): Observable<any> {
    const formdata = new FormData();
    formdata.append('_operation', moduledata.operation);
    // formdata.append('username', moduledata.username);
    // formdata.append('password', moduledata.password);
    formdata.append('_session', moduledata.session);
    formdata.append('record', '10x7925');
    formdata.append('relatedmodule', 'Products');

    let url = environment.baseurl
    // http://realestatedemo.biztechnosys.com/
    // http://beml.biztechnosys.com/
    // https://bizuiaccountingcrm.biztechnosys.com/
    // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, options).pipe(
    return this.http.post<any>(url, formdata, options).pipe(
      tap((logindata: any) => console.log(`moduledata`)),
      catchError(this.handleError<any>('module'))
    );
  }

}