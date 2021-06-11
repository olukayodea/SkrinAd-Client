import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorCodes } from '../_models/data';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  errorCodes: ErrorCodes;

  routeParams: Params;
  queryParams: Params;

  buttonText: string = "Register";
  processing: boolean = false;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  loginForm = this.fb.group({
    country: ['', Validators.required],
    client_name: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    agreeTerms: ['', Validators.required],
  });
  
  get country() { return this.loginForm.get('country'); }
  get client_name() { return this.loginForm.get('client_name'); }
  get name() { return this.loginForm.get('name'); }
  get email() { return this.loginForm.get('email'); }
  get phone() { return this.loginForm.get('phone'); }
  get agreeTerms() { return this.loginForm.get('agreeTerms'); }

  constructor(
    private titleService: Title,
    private meta: Meta,
    private router: Router,
    private fb: FormBuilder,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.titleService.setTitle("Login");
    this.meta.addTags([
      { name: 'deacription', content: "Create a SkrinAd Client account" },
      { name: 'Keywords', content: "SkrinAd, CLients, Login,  non-intrusive, lifestyle, multimedia contents, get paid, advertistment, surveys, money, smart business decisions, Advertise, Advertise with us" },
    ]);
    this.getRouteParams();
    this.errorCodes = new ErrorCodes();
  }

  ngOnInit(): void {
  }


  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }

    var data: object = {
      client_name: this.loginForm.value.client_name,
      country: this.loginForm.value.country,
      name: this.loginForm.value.name,
      email: this.loginForm.value.email,
      phone: this.loginForm.value.phone,
    };

    this.register(data);
  }

  register( data ) {
    this.processing = true;

    this.buttonText = "Registering...";
    this.apiService.createAdvert(data).subscribe(
      user => {
        this.processing = false
        if (user.success == true) {
          this.router.navigate(['/login/20002']);
        } else {
          this.errorMsg = true;
          this.error = user.error.message;
          this.buttonText = "Register";
          this.processing = false;
        }
        this.buttonText = "Add New Advert";
      }
    );
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

}
