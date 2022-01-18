import { Injectable } from '@angular/core';
import { HttpHeaders  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  callHeader() {
    throw new Error("Method not implemented.");
  }
  constructor() {}
  // callHeader() {
//     const headers = new HttpHeaders();
//     headers.append('Content-Type' , 'application/x-www-form-urlencoded;charset=UTF-8');
//     headers.append('Content-Type', 'Access-Control-Allow-Origin:*');
//     return {
//       headers
//     };
//  }

}
