import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { SurveyData } from 'src/app/_models/surveys';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-list-campaign',
  templateUrl: './list-campaign.component.html',
  styleUrls: ['./list-campaign.component.css']
})
export class ListCampaignComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  processing: boolean = false;
  loading: boolean = true;

  surveyList: SurveyData[] = [];

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
  ) {
    this.checkService.checkSession();
    this.getRouteParams();
  }

  ngOnInit(): void {
    this.getSurvey(this.page);
  }

  getSurvey(page) {
    this.loading = true;

    this.apiService.getRuningSurvey(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.surveyList = data.data;
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
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

    // URL get change
    this.activatedRoute.url.subscribe(url =>{
      this.ngOnInit();
    });
  }

}
