import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChecksService } from './checks.service';
import { PasswordData, User } from '../_models/users';
import { Adverts, AllAdvertData, OneAdvert } from '../_models/advert';
import { OneWallet, Wallet } from '../_models/wallet';
import { Dashboard } from '../_models/homePage';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = environment.baseUrl;
  product_key: string|number = Math.floor(Math.random() * Math.floor(999999));

  constructor(
    private http: HttpClient,
    private checkService: ChecksService
  ) {}

  // saveLocationData(locationData) {
  //     localStorage.setItem('locationData', JSON.stringify(locationData));
  // }

  /**
   * API to login User
   * @param email email address or username
   * @param password password of user
   */
  login(username, password): Observable<User> {
    const data = {
      username,
      password
    }

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    const responseData = this.post(this.baseUrl + 'user/login', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createClient(data): Observable<User> {

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    const responseData = this.post(this.baseUrl + 'user/create', JSON.stringify(data), httpOptions);

    return responseData;
  }

  password(email): Observable<PasswordData> {
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    const responseData = this.get(this.baseUrl + 'user/password/'+encodeURI(email), httpOptions);

    return responseData;
  }
  
  setPassword(data, token): Observable<User> {
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'user/setPassword', JSON.stringify(data), httpOptions);

    return responseData;
  }

  logout(token) {
    var gateway_passcode = btoa(this.product_key + "_" + token);
    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'users/logout', httpOptions);

    return responseData;
  }


  getDashData(): Observable<Dashboard> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'user/dashboard', httpOptions);

    return responseData;
  }

  removeGallery(id:number) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.delete(this.baseUrl + 'content/files/'+id, httpOptions);

    return responseData;
  }

  uploadFile(id:number, file: File) {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.post(this.baseUrl + 'content/files/'+id, formData, httpOptions);

    return responseData;
  }

  getOneAdvert(id:number): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'content/get/'+id, httpOptions);

    return responseData;
  }

  getAdverts(page:number, view:string): Observable<Adverts> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'content/get/'+view+'?page='+page, httpOptions);

    return responseData;
  }

  getRuningAdverts(page:number): Observable<Adverts> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'content/get/running?page='+page, httpOptions);

    return responseData;
  }

  postWallet(data): Observable<OneWallet> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'clients/wallet', JSON.stringify(data), httpOptions);

    return responseData;
  }

  getWallet(id:number, page:number, from:number=0, to:number=0): Observable<Wallet> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'wallet/get/'+from+'/'+to+'?page='+page, httpOptions);

    return responseData;
  }

  getData(): Observable<AllAdvertData> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.get(this.baseUrl + 'content/getData', httpOptions);

    return responseData;
  }

  modifyPassword(data): Observable<User> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'user/updatePassword', JSON.stringify(data), httpOptions);

    return responseData;
  }

  modifyData(data): Observable<User> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'user/profile', JSON.stringify(data), httpOptions);

    return responseData;
  }

  createAdvert(data): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.post(this.baseUrl + 'content/create', JSON.stringify(data), httpOptions);

    return responseData;
  }

  extendAdvert(data): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }

    const responseData = this.put(this.baseUrl + 'content/extend', JSON.stringify(data), httpOptions);

    return responseData;
  }

  editAdvert(data): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'content/edit', JSON.stringify(data), httpOptions);

    return responseData;
  }

  changeAdvertStatus(data): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.put(this.baseUrl + 'content/changeStatus', JSON.stringify(data), httpOptions);

    return responseData;
  }

  deleteAdvert(ref): Observable<OneAdvert> {
    var token = this.checkService.getToken();
    var gateway_passcode = btoa(this.product_key + "_" + token);

    // request headers
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+gateway_passcode,
        'key': this.product_key.toString()
      })
    }
    const responseData = this.delete(this.baseUrl + 'content/remove/'+ref, httpOptions);

    return responseData;
  }
  
  /**
   * POST Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  post(url, jsonData, httpOptions): Observable<any> {
    return this.http.post<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  /**
   * PUT Request
   * @param url API URL
   * @param jsonData JSON encoded Data
   * @param httpOptions HTTP Options
   */
  put(url, jsonData, httpOptions): Observable<any> {
    return this.http.put<any>(url, jsonData, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * GET request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  get(url, httpOptions): Observable<any> {
    return this.http.get<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  
  /**
   * DELETE request
   * @param url API URL
   * @param httpOptions HTTP Options
   */
  delete(url, httpOptions): Observable<any> {
    return this.http.delete<any>(url, httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl))
  }

  errorHandl(error) {
    return throwError("Can not connect to service "+error);
  }
}
