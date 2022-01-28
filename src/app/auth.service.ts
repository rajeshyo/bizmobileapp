import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {
 
  Router
} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  data: any;
  validUser = false;

  constructor(   private http: HttpClient,private router: Router
    ) {

     // this.checkUser();
     }
     login() {
      // console.log('localStorage clear'); 
      let url = environment.baseurl
    const session = localStorage.getItem('session');
  

    var formdata = new FormData();
    formdata.append('_operation','loginAndFetchModules');
    formdata.append('_session',session);


    this.http.post( url,formdata,{})
    .toPromise()
    .then(response => {
      this.data = response;

      // console.log('check user', response);
      
    })
    .catch(console.log);

    localStorage.clear();

      this.router.navigateByUrl("/login");  
  }


  getToken() {
   //console.log('checkUser',this.checkUser()); 
  
  	return !!localStorage.getItem('session')
  } 

 
}