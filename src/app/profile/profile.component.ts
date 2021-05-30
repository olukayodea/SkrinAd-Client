import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserData } from '../_models/users';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { EncrDecrService } from '../_services/encode.decode.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  userData: UserData;

  processing: boolean = false;
  buttonText: string = "Update Profile";
  passwordButtonText: string = "Update Password";

  dataForm = this.fb.group({
    client_name: ["", Validators.required],
    name: ["", Validators.required],
    email: [{value: true, disabled: true}],
    phone: ["", Validators.required],
  }, {});
  
  get client_name() { return this.dataForm.get('client_name'); }
  get name() { return this.dataForm.get('name'); }
  get email() { return this.dataForm.get('email'); }
  get phone() { return this.dataForm.get('phone'); }

  passwordForm = this.fb.group({
    oldPassword: ["", Validators.required],
    newPassword: ["", Validators.required],
    confirmPassword: ["", Validators.required],
  }, {});
  
  get oldPassword() { return this.passwordForm.get('oldPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private EncrDecr: EncrDecrService
  ) {
    this.userData = this.checkService.checkSession();
  }

  ngOnInit(): void {
    this.dataForm.patchValue({
      client_name: this.userData.companyName,
      name: this.userData.name,
      email: this.userData.contactEmail,
      phone: this.userData.contactPhone
    });
  }

  updateProfile() {
    var data: object = {
      client_name: this.dataForm.value.client_name,
      name: this.dataForm.value.name,
      phone: this.dataForm.value.phone,
    };
    this.modifyData(data);

  }

  modifyData( data ) {
    this.processing = true;

    this.buttonText = "Saving...";
      
    this.apiService.modifyData(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {

          var currentTime = Math.floor((Date.now() / 1000) + (60 * 10));
          
          let randKey = this.checkService.getRandomString(32);
          var keydata = {
            key: randKey,
            expire: currentTime.toString()
          }

          localStorage.setItem('key', btoa( JSON.stringify(keydata)) );
          localStorage.setItem('userData', this.EncrDecr.set(environment.localKey+randKey, JSON.stringify(user.data)));
          this.userData = user.data;
          this.notifyService.showSuccess("saved changes made to your profile", "Profile Modified");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Update Profile";
      }
    );
  }

  updatePassword() {
    var data: object = {
      oldPassword: this.passwordForm.value.oldPassword,
      newPassword: this.passwordForm.value.newPassword,
    };
    this.modifyPassword(data);

  }

  modifyPassword( data ) {
    this.processing = true;

    this.buttonText = "Saving...";
      
    this.apiService.modifyPassword(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("password modification saved", "Profile Modified");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Update Profile";
      }
    );
  }

}
