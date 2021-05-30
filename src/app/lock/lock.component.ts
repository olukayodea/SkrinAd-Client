import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { EncrDecrService } from '../_services/encode.decode.service';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})
export class LockComponent implements OnInit {
  redirect: string;
  userData: {companyName: string, username: string; name: string; };
  
  processing: boolean = false;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  loginForm = this.fb.group({
    password: ['', Validators.required],
  });
  
  get password() { return this.loginForm.get('password'); }
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiService,
    private checkService: ChecksService,
    private EncrDecr: EncrDecrService
  ) {
    this.checkKey();
  }

  ngOnInit(): void {
    if (localStorage.getItem('route') === null) {
      localStorage.setItem('route', "");
    }
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }


    this.login(this.userData.username, this.loginForm.value.password);
  }
  
  login(username: string, password: string) {
    this.processing = true;

    this.apiService.login(username, password).subscribe(
      user => {
        let randKey = this.checkService.getRandomString(32);
        if (user.success == true) {
          // Save user to Local storage

          var currentTime = Math.floor((Date.now() / 1000) + (60 * 10));
          
          var keydata = {
            key: randKey,
            expire: currentTime.toString()
          }

          localStorage.setItem('key', btoa( JSON.stringify(keydata)) );
          localStorage.setItem('userData', this.EncrDecr.set(environment.localKey+randKey, JSON.stringify(user.data)));

          this.redirect = localStorage.getItem('route');
          
          this.router.navigate(['/'+decodeURIComponent(this.redirect)]);
        } else {
          this.errorMsg = true;
          this.error = user.error.message ;
          this.processing = false;
        }
      }
    );
  }

  checkKey() {
    var sessionKey = localStorage.getItem("sessionKey");
    if (sessionKey !== null) {
      let data = JSON.parse(atob(sessionKey));
      this.userData = data;
    } else {
      this.router.navigate(['/login']);
    }
  }

  copyright() {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(Date.now(), 'yyyy');
  }
}
