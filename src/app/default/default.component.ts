import { Component, OnInit } from '@angular/core';
import { UserData } from '../_models/users';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  userData!: UserData;
  auth!: number;

  dashData: [];

  loadingAgeRange = true;
  loadingAgeGender = true;
  loadingAgeDistribution = true;
  loadingInterest = true;
  loadingUserGrowth = true;
  loadingActiveUser = true;
  loading = true;

  advertList: [] = [];
  surveyList: [] = [];
  reportList: [] = [];

  canvas:any; ctx:any;
  canvas2:any; ctx2:any;
  canvas3:any; ctx3:any;
  canvas4:any; ctx4:any;
  canvas5:any; ctx5:any;
  canvas6:any; ctx6:any;

  constructor(
    public checkService: ChecksService,
    private apiService: ApiService,
    private notifyService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.userData = this.checkService.checkSession();
    this.auth = parseInt(localStorage.getItem('auth'));
  }

}
