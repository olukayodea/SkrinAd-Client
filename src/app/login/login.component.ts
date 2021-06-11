import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorCodes } from '../_models/data';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { EncrDecrService } from '../_services/encode.decode.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorCodes: ErrorCodes;
  redirect: string;
  
  routeParams: Params;
  queryParams: Params;
  
  buttonText: string = "Login";
  passwordButtonText: string = "Change";
  processing: boolean = false;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  changePassword: boolean = false;
  tempToken: string

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  passwordForm = this.fb.group({
    newPassword: ["", Validators.required],
    confirmPassword: ["", Validators.required],
  }, {});
  
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public checkService: ChecksService,
    private apiService: ApiService,
    private EncrDecr: EncrDecrService
  ) {
    this.titleService.setTitle("Login");
    this.meta.addTags([
      { name: 'deacription', content: "Login to your SkrinAd clients account" },
      { name: 'Keywords', content: "SkrinAd, CLients, Login,  non-intrusive, lifestyle, multimedia contents, get paid, advertistment, surveys, money, smart business decisions, Advertise, Advertise with us" },
    ]);
    this.getRouteParams();
    this.errorCodes = new ErrorCodes();
  }

  ngOnInit(): void {
    this.checkService.checkLogin();

    if (localStorage.getItem('route') === null) {
      localStorage.setItem('route', "");
    }

    if (this.routeParams['done'] !== undefined) {
      this.successMsg = true;
      this.success = this.errorCodes['en'][this.routeParams['done']];
    }

    if (this.routeParams['error'] !== undefined) {
      this.errorMsg = true;
      this.error = this.errorCodes['en'][this.routeParams['error']];
    }
  }
  
  getRouteParams() {
    // Route parameters
    this.activatedRoute.params.subscribe( params => {
        this.routeParams = params;
    });

    // URL query parameters
    this.activatedRoute.queryParams.subscribe( params => {
        this.queryParams = params;
    });
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }

    this.login(this.loginForm.value.username, this.loginForm.value.password);
  }
  
  login(username: string, password: string) {
    this.buttonText = "Logging In";
    this.processing = true;

    this.apiService.login(username, password).subscribe(
      user => {
        let randKey = this.checkService.getRandomString(32);
        if (user.success == true) {
          if (user.data.accountStatus.newAccount || user.data.accountStatus.passwordChange) {
            this.changePassword = true;
            this.tempToken = user.token;
            this.errorMsg = false;
            this.successMsg = true;
            this.success = "You will need to set a new password to continue";
            this.processing = false;
          } else {
            // Save user to Local storage

            var currentTime = Math.floor((Date.now() / 1000) + (60 * 10));
            
            var keydata = {
              key: randKey,
              expire: currentTime.toString()
            }

            localStorage.setItem('key', btoa( JSON.stringify(keydata)) );
            localStorage.setItem('userData', this.EncrDecr.set(environment.localKey+randKey, JSON.stringify(user.data)));

            this.redirect = localStorage.getItem('route');

            // if (this.redirect !== undefined) {     
            //   this.redirect = user.data.mainPage
            // }
            
            window.location.href = decodeURIComponent(this.redirect);
            // this.router.navigate(['/'+decodeURIComponent(this.redirect)]);
          }
        } else {
          this.errorMsg = true;
          this.error = user.error.message;
          this.buttonText = "Login";
          this.processing = false;
        }
      }
    );
  }

  onSubmitPassword() {
    if(this.passwordForm.invalid) {
      return;
    }
    var data: object = {
      password: this.passwordForm.value.newPassword,
    };

    this.setPassword(data);
  }
  
  setPassword( password: object) {
    this.passwordButtonText = "Logging In";
    this.processing = true;

    this.apiService.setPassword(password, this.tempToken).subscribe(
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

          // if (this.redirect !== undefined) {     
          //   this.redirect = user.data.mainPage
          // }
          
          window.location.href = decodeURIComponent(this.redirect);
          // this.router.navigate(['/'+decodeURIComponent(this.redirect)]);
        } else {
          this.errorMsg = true;
          this.error = user.error.message;
          this.passwordButtonText = "Change";
          this.processing = false;
        }
      }
    );
  }

}
