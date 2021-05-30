import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChecksService } from './checks.service';
import { User } from '../_models/users';
// import { Currency } from '../_models/currency';
// import { Category } from '../_models/category';
// import { SystemReport } from '../_models/systemReports';
// import { Transactions } from '../_models/transactions';
// import { Country, OneCountry } from '../_models/country';
import { Adverts, AllAdvertData, OneAdvert } from '../_models/advert';
// import { Clients, OneClient } from '../_models/clients';
// import { OneWallet, Wallet } from '../_models/wallet';
// import { Admin, AdminRight, AllowedRightData, OneAdmin } from '../_models/admin';
// import { SiteOptions, SiteSettings } from '../_models/options';
// import { Dashboard } from '../_models/homePage';


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

  // listSystemReport(page): Observable<SystemReport> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'reports/system?page='+page, httpOptions);

  //   return responseData;
  // }

  setLocation(location): Observable<User> {
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
    const responseData = this.get(this.baseUrl + 'admin/location/'+location, httpOptions);

    return responseData;
  }

  // listTransactions(page): Observable<Transactions> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'reports/transactions?page='+page, httpOptions);

  //   return responseData;
  // }

  // getCountry(id:number): Observable<OneCountry> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'country/get/'+id, httpOptions);

  //   return responseData;
  // }

  // getClients(page:number, view:string): Observable<Clients> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'clients/get/'+view+'?page='+page, httpOptions);

  //   return responseData;
  // }

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

  // getOneClient(id:number): Observable<OneClient> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'clients/get/'+id, httpOptions);

  //   return responseData;
  // }

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

  // getDashData(): Observable<Dashboard> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'admin/dashboard', httpOptions);

  //   return responseData;
  // }

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

  // postWallet(data): Observable<OneWallet> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'clients/wallet', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // getWallet(id:number, page:number, from:number=0, to:number=0): Observable<Wallet> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'clients/wallet/'+id+'/'+from+'/'+to+'?page='+page, httpOptions);

  //   return responseData;
  // }

  // getOption(): Observable<SiteOptions> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'options/get', httpOptions);

  //   return responseData;
  // }

  // getSettings(): Observable<SiteSettings> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'settings/get', httpOptions);

  //   return responseData;
  // }

  // getCountries(page:number, view:string): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'country/get/'+view+'?page='+page, httpOptions);

  //   return responseData;
  // }

  // listAdminRight(): Observable<AdminRight> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'admin/right', httpOptions);

  //   return responseData;
  // }

  // listAdministrator(page:number, view:string): Observable<Admin> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'admin/get/'+view+'?page='+page, httpOptions);

  //   return responseData;
  // }

  // getCurrencies(): Observable<Currency> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'currency/get', httpOptions);

  //   return responseData;
  // }

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

  // getRightData(): Observable<AllowedRightData> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'admin/getData', httpOptions);

  //   return responseData;
  // }

  // getCategories(view:string=''): Observable<Category> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'category/get/'+view, httpOptions);

  //   return responseData;
  // }

  // createCurrency(data): Observable<Currency> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'currency/create', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createAgency(data): Observable<Clients> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'clients/create', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createCategory(data): Observable<Category> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'category/create', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createCountryArea(data): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'country/createArea', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createRight(data): Observable<AdminRight> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'admin/right', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

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
    console.log(token);
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

  // modifyAdmin(data): Observable<Admin> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'admin/edit', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createAdmin(data): Observable<Admin> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'admin/create', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // updateOptions(data): Observable<SiteOptions> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'options/set', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // updateSettings(data): Observable<SiteSettings> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }

  //   console.log(data);
  //   const responseData = this.put(this.baseUrl + 'settings/set', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // createCountry(data): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.post(this.baseUrl + 'country/create', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

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

  // editAgency(data): Observable<OneClient> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'clients/edit', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

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

  // changeCountryStatus(data): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'country/changeStatus', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // changeCategoryStatus(data): Observable<Category> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'category/changeStatus', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // changeAdminStatus(data): Observable<OneAdvert> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'admin/changeStatus', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // changeClientStatus(id): Observable<OneClient> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'clients/changeStatus/'+id, "", httpOptions);

  //   return responseData;
  // }

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

  // resetAdminPassword(ref): Observable<OneClient> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.get(this.baseUrl + 'admin/resetPassword/'+ref, httpOptions);

  //   return responseData;
  // }

  // deleteCountry(ref): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.delete(this.baseUrl + 'country/remove/'+ref, httpOptions);

  //   return responseData;
  // }

  // deleteCategory(ref): Observable<Category> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.delete(this.baseUrl + 'category/remove/'+ref, httpOptions);

  //   return responseData;
  // }

  // deleteAdmin(ref): Observable<OneAdmin> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.delete(this.baseUrl + 'admin/remove/'+ref, httpOptions);

  //   return responseData;
  // }

  // deleteClient(ref): Observable<OneClient> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.delete(this.baseUrl + 'clients/remove/'+ref, httpOptions);

  //   return responseData;
  // }

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

  // editCountry(data): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'country/edit', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }

  // editCountryArea(data): Observable<Country> {
  //   var token = this.checkService.getToken();
  //   var gateway_passcode = btoa(this.product_key + "_" + token);

  //   // request headers
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'Authorization': 'Bearer '+gateway_passcode,
  //       'key': this.product_key.toString()
  //     })
  //   }
  //   const responseData = this.put(this.baseUrl + 'country/editArea', JSON.stringify(data), httpOptions);

  //   return responseData;
  // }
  
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
