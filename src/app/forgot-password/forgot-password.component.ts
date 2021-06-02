import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  
  buttonText: string = "Get Password";
  processing: boolean = false;

  success: string;
  successMsg: boolean;
  error: string;
  errorMsg: boolean;

  loginForm = this.fb.group({
    email: ['', Validators.required],
  });
  
  get email() { return this.loginForm.get('email'); }

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
  }

  onSubmit() {
    if(this.loginForm.invalid) {
      return;
    }

    this.password(this.loginForm.value.email);
  }
  
  password(username: string) {
    this.buttonText = "Checking...";
    this.processing = true;

    this.apiService.password(username).subscribe(
      user => {
        if (user.success == true) {
          this.successMsg = true;
          this.success = user.message;

          this.loginForm.reset();
        } else {
          this.errorMsg = true;
          this.error = user.error.message;
        }
        this.buttonText = "Get Password";
        this.processing = false;
      }
    );
  }
}
