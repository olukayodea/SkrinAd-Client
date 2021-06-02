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
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userData = this.checkService.checkSession(true);
    this.auth = parseInt(localStorage.getItem('auth'));
  }

}
