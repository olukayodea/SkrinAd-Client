import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AdvertsData } from 'src/app/_models/advert';
import { Counts } from 'src/app/_models/data';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.css']
})
export class CampaignComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  processing: boolean = false;
  loading: boolean = true;

  advertList: AdvertsData[] = [];

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
    this.getAdverts(this.page);
  }

  getAdverts(page) {
    this.loading = true;

    this.apiService.getRuningAdverts(page).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.advertList = data.data;
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
