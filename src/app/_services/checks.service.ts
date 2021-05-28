import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EncrDecrService } from './encode.decode.service';
import { UserData } from '../_models/users';

@Injectable({
  providedIn: 'root'
})
export class ChecksService {
  constructor(
    private router: Router,
    private EncrDecr: EncrDecrService
  ) {}

  checkLoggedin(data) {
    if (data.success !== true) {
      if (data.code == 10018) {
        this.router.navigate(['/login']);
      }
    }
  }

  getToken(home = false) {
    return this.checkSession(home).token;
  }

  checkLogin() {
    var currentTime = Math.floor((Date.now() / 1000));
    if (localStorage.getItem('key') !== null) {

      let userData = localStorage.getItem('userData');
      try {
        let keydata = JSON.parse(atob(localStorage.getItem('key')));
        var data: UserData = JSON.parse(this.EncrDecr.get(environment.localKey + keydata.key, userData));
      
        if (keydata.expire > currentTime) {
          this.router.navigate(["home"]);
        }
      } catch { }
    }

  }

  checkSession(home: true | false = false) {
    var currentTime = Math.floor((Date.now() / 1000));

    if (localStorage.getItem('key') !== null) {
      let keydata = JSON.parse(atob(localStorage.getItem('key')));
      
      let userData = localStorage.getItem('userData');

      var url = this.router.url.slice(1);
      if (url === "") {
        localStorage.removeItem("route");
      } else {
        localStorage.setItem('route', url);
      }
      try {
        var data: UserData = JSON.parse(this.EncrDecr.get(environment.localKey + keydata.key, userData));


        if (keydata.expire > currentTime) {
          var currentTime = Math.floor((Date.now() / 1000) + (60 * 10));
          
          var newKeydata = {
            key: keydata.key,
            expire: currentTime.toString()
          }
          
          localStorage.setItem('key', btoa(JSON.stringify(newKeydata)));
          localStorage.setItem('auth', "1");
          return data;
        } else {
          var sessionData: object = {
            username: data.username,
            name: data.name
          }

          localStorage.removeItem("userData");
          localStorage.setItem('auth', "0");
          localStorage.setItem('sessionKey', btoa(JSON.stringify(sessionData)));
          if (home === false) {
            this.router.navigate(['/lock']);
          } else {
            return new UserData();
          }
        }
      } catch {
        localStorage.setItem('auth', "0");
        if (home === false) {
          this.router.navigate(['/login']);
        } else {
          return new UserData();
        }
      }
    } else {
      localStorage.setItem('auth', "0");
      if (home === false) {
        this.router.navigate(['/login']);
      }
      return new UserData();
    }
  }

  getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }
}
