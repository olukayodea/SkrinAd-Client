import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private checkService: ChecksService
  ) {
    this.getRouteParams();
  }


  ngOnInit(): void {
    this.logout();
  }

  logout() {
    if (this.routeParams['parameter'] !== "clear") {
      var token = this.checkService.getToken();
      this.apiService.logout(token)
    }
    
    localStorage.clear();
    localStorage.setItem('auth', "0");

    this.router.navigate(['/']);
 
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
