import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserData } from 'src/app/_models/users';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { EncrDecrService } from 'src/app/_services/encode.decode.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userData: UserData;
  auth: number;
  notificationCount: number = 0;

  pageUrl = this.router.url.slice(1);

  constructor(
    public checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
    private router: Router,
    private EncrDecr: EncrDecrService
  ) { }

  ngOnInit(): void {
    this.userData = this.checkService.checkSession(true);
    this.auth = parseInt(localStorage.getItem('auth'));
  }

  setLocation(location) {
    this.apiService.setLocation(location).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          var currentTime = Math.floor((Date.now() / 1000) + (60 * 10));
          
          let randKey = this.checkService.getRandomString(32);
          var keydata = {
            key: randKey,
            expire: currentTime.toString()
          }

          localStorage.setItem('key', btoa( JSON.stringify(keydata)) );
          localStorage.setItem('userData', this.EncrDecr.set(environment.localKey+randKey, JSON.stringify(data.data)));
          this.userData = data.data;

          window.location.href = this.pageUrl;
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );
  }

}
