import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AdvertsData } from 'src/app/_models/advert';
import { Counts } from 'src/app/_models/data';
import { UserData } from 'src/app/_models/users';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-view-advert',
  templateUrl: './view-advert.component.html',
  styleUrls: ['./view-advert.component.css']
})
export class ViewAdvertComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;
  
  userData: UserData;

  pageUrl = this.router.url.slice(1);

  buttonText: string = "Upload";
  extendButtonText: string = "Extend Campaign";
  view: string = "";

  processing: boolean = false;
  loading: boolean = true;

  advertRef: number;
  advertGalleryRef: number;
  advertData: AdvertsData;

  walletBalance: number;
  amountDue: number;

  detailsTab: boolean = true;
  galleryTab: boolean = false;
  statTab: boolean = false;
  extend: boolean = false;

  canvas: any;
  ctx: any;

  graphData: any;
  interval: any;

  fileToUpload: File = null;

  dataForm = this.fb.group({
    mediaFile: ["", Validators.required]
  }, {});
  get mediaFile() { return this.dataForm.get('mediaFile'); }

  extendForm = this.fb.group({
    impression: ["", [Validators.required, Validators.min(1000)]]
  }, {});
  get impression() { return this.extendForm.get('impression'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
  ) {
    this.userData = this.checkService.checkSession();
    this.getRouteParams();
    this.advertData = new AdvertsData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.advertRef = this.routeParams['id'];
    }
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    }  else {
      this.page = 1;
    }

    this.getOneAdvert();
  }

  getOneAdvert() {
    this.loading = true;

    this.apiService.getOneAdvert(this.advertRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false;
        if (data.success == true) {
          if (data.data.ref !== undefined) {
            this.advertData = data.data;
            this.walletBalance = this.advertData.finance.wallet.currentBalance.amount - this.advertData.finance.campaignTotal.amount;
            this.amountDue = Math.abs(this.walletBalance);
          } else {
            this.router.navigate(['/adverts']);
            this.notifyService.showError("The page you are trying to access does not exist", "Error")
          }
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );
  }

  changeAdvertStatus(action:string) {
    let data:Object = {
      ref: this.advertRef,
      status: action.toLowerCase()
    }
    this.processing = true;

    this.apiService.changeAdvertStatus(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Changes made to advert successfully", "Advert Modified");
          this.ngOnInit();
          if (action == "approve") {
            this.notifyService.showSuccess("Advert is now active and will now be pushed to the users", "Advert Activated");
          }
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }

        document.getElementById('modal-secondary').click();
        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  deleteAdvert() {
    this.processing = true;

    this.apiService.deleteAdvert(this.advertRef).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Advert Removed Successfully", "Advert Deleted");
           this.router.navigate(['/adverts']);
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }

        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  onExtend() {
    var data: object = {
      ref: this.advertData.ref,
      impression: this.extendForm.value.impression
    };
    this.extendAdvert(data);
  }

  extendAdvert(data) {
    this.processing = true;

    this.extendButtonText = "Please wait...";
    this.apiService.extendAdvert(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Added "+data.impression+ " impressions to " +this.advertData.title+"", "Advert Extended");
          this.ngOnInit();
          this.extendForm.reset();
          this.extend = false;
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.extendButtonText = "Extend Campaign";
      }
    );

  }

  onFileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  upload() {
    this.processing = true;

    this.buttonText = "Uploading...";
    this.apiService.uploadFile(this.advertRef, this.fileToUpload).subscribe(
      upload => {
        this.checkService.checkLoggedin(upload);
        if (upload.success == true) {
          this.notifyService.showSuccess("Uploaded new file to gallery", "Advert Updated");
          this.ngOnInit();
        } else {
          this.notifyService.showError(upload.error.message, "Error")

          this.buttonText = "Upload";
        }
        this.processing = false
        this.dataForm.reset();
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

  setGalleryID (ref) {
    this.advertGalleryRef = ref;
  }

  removeGallery() {
    this.loading = true;

    this.apiService.removeGallery(this.advertGalleryRef).subscribe(
      upload => {
        this.checkService.checkLoggedin(upload);
        if (upload.success == true) {
          this.notifyService.showSuccess("Removed file from gallery", "Advert Updated");
          this.ngOnInit();
        } else {
          this.notifyService.showError(upload.error.message, "Error");
        }
        this.changeTab("gallery");
        this.loading = false

        document.getElementById('modal-secondary').click();
        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
        document.getElementById('modal-delete-file').click();
      }
    );

  }

  numberWithCommas(x) {
    return x.toLocaleString();
  }

  changeTab(view:string) {
    if (view == 'details') {
      this.detailsTab = true;
      this.galleryTab = false;
      this.statTab = false;
    } else if (view == 'gallery') {
      this.detailsTab = false;
      this.galleryTab = true;
      this.statTab = false;
    } else if (view == 'stats') {
      this.detailsTab = false;
      this.galleryTab = false;
      this.statTab = true;
      // this.drawChart('dailyImpression');
    } else {
      this.detailsTab = true;
      this.galleryTab = false;
      this.statTab = false;
    }
  }

  doExtend(action:boolean) {
    this.extend = action;
  }

  calculateImpression() {
    let impression: number = Number(this.extendForm.value.impression);

    if (impression >= 1000) {
      let amount: number = this.advertData.finance.amtPerImp.amount*impression;
      let balance: number = this.advertData.finance.wallet.currentBalance.amount;

      let due: number = balance-amount;

      if (due < 0) {
        this.extendForm.controls['impression'].setErrors({'incorrect': true});
      } else {
          this.extendForm.controls['impression'].setErrors(null);
      }
    }
  }
  
  getHostname = (url) => {
    if (url != undefined) {
      return new URL(url).hostname;
    }
  }

}
