import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AdvertsData } from '../_models/advert';
import { Counts, CountryData, AreasData, CategoryData } from '../_models/data';
import { UserData } from '../_models/users';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-adverts',
  templateUrl: './adverts.component.html',
  styleUrls: ['./adverts.component.css']
})
export class AdvertsComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  userData: UserData;

  mainHeader: string = "List All Advert";
  formHeader: string = "Add New Advert";
  view: string = "";

  processing: boolean = false;
  loading: boolean = true;
  buttonText: string = "Add New Advert";

  advertList: AdvertsData[] = [];
  categoryList: CategoryData[] = [];
  areaList: AreasData[] = [];

  edit: boolean = false;

  cap: number = 0;
  min_imp: number = 0;
  advertRef:number = 0;
  advertName:string = "";

  dataForm = this.fb.group({
    ref: [""],
    title: ["", Validators.required],
    caption: ["", Validators.required],
    type: ["", Validators.required],
    impression: ["", Validators.required],
    run_time: ["", Validators.required],
    daily_cap: [0, Validators.required],
    category: ["", Validators.required],
    url: ["", [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    avail_date: ["", Validators.required],
    age: ["", Validators.required],
    gender: ["", Validators.required],
    refund: ["", Validators.required],
    // delivery_mode: ["", Validators.required],
    // lat: ["", Validators.required],
    // long: ["", Validators.required],
    areas: ["", Validators.required],
  }, {});
  
  get ref() { return this.dataForm.get('ref'); }
  get title() { return this.dataForm.get('title'); }
  get caption() { return this.dataForm.get('caption'); }
  get type() { return this.dataForm.get('type'); }
  get impression() { return this.dataForm.get('impression'); } // get min impression
  get run_time() { return this.dataForm.get('run_time'); }
  get daily_cap() { return this.dataForm.get('daily_cap'); }
  get category() { return this.dataForm.get('category'); }
  get url() { return this.dataForm.get('url'); }
  get avail_date() { return this.dataForm.get('avail_date'); }
  get age() { return this.dataForm.get('age'); }
  get gender() { return this.dataForm.get('gender'); }
  get refund() { return this.dataForm.get('refund'); }
  // get delivery_mode() { return this.dataForm.get('delivery_mode'); }
  // get lat() { return this.dataForm.get('lat'); }
  // get long() { return this.dataForm.get('long'); }
  get areas() { return this.dataForm.get('areas'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
  ) {
    this.userData = this.checkService.checkSession();
    this.checkService.checkSession();
    this.getRouteParams();
    this.getData();
  }

  ngOnInit(): void {
    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      this.mainHeader = "List "+this.view+" Adverts";
      this.view = this.view.toLowerCase();
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getAdverts(this.page);
  }

  getData() {
    this.apiService.getData().subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.categoryList = data.data.categories;
          this.areaList = data.data.areas;
          this.min_imp = data.data.min_imp;

          this.impression.setValidators([Validators.required, Validators.min(data.data.min_imp)]);
          this.dataForm.patchValue({
            impression: data.data.min_imp,
          });
        } else {
          this.notifyService.showError("An error occured getting data to build this page", "Error")
        }
      }
    );
  }

  getAdverts(page) {
    this.loading = true;

    this.apiService.getAdverts(page, this.view).subscribe(
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

  onCreate() {
    var data: object = {
      title: this.dataForm.value.title,
      caption: this.dataForm.value.caption,
      type: this.dataForm.value.type,
      impression: this.dataForm.value.impression,
      run_time: this.dataForm.value.run_time,
      daily_cap: this.dataForm.value.daily_cap,
      category: this.dataForm.value.category,
      url: this.dataForm.value.url,
      avail_date: this.dataForm.value.avail_date,
      age: this.dataForm.value.age,
      gender: this.dataForm.value.gender,
      refund: this.dataForm.value.refund,
      // delivery_mode: this.dataForm.value.delivery_mode,
      // lat: this.dataForm.value.lat,
      // long: this.dataForm.value.long,
      country: this.userData.country.iso,
      areas: this.dataForm.value.areas
    };

    if (this.edit === true) {
      data['ref'] = this.dataForm.value.ref;
      this.editAdvert(data);
    } else {
      this.createAdvert(data);
    }
  }

  createAdvert( data ) {
    this.processing = true;

    this.buttonText = "Adding New Advert...";
    this.apiService.createAdvert(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created "+data.title+" as a Advert", "Advert Created");
          this.ngOnInit();
          this.dataForm.reset();
          this.router.navigate(['/adverts/view', user.data.ref]);
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Advert";
      }
    );
  }

  editAdvert( data ) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editAdvert(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Advert", "Advert Modified");
          this.ngOnInit();
          this.dataForm.reset();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Advert";
        this.edit = false;
      }
    );
  }

  getEdit(data:AdvertsData) {
    let category = [];
    data.category.forEach(element => {
      category.push(element.ref);
    });
    this.dataForm.patchValue({
      ref: data.ref,
      title: data.title,
      caption: data.caption,
      type: data.type,
      impression: data.impression.issued,
      run_time: data.impression.runTime,
      daily_cap: data.impression.dailyCap,
      category: category,
      url: data.url,
      avail_date: data.avail_date,
      age: data.age,
      gender: data.gender,
      refund: data.refund,
      // delivery_mode: data.delivery_mode,
      // lat: data.lat,
      // long: data.long,
      country: data.country,
      areas: data.areas
    });
    this.edit = true;
    this.formHeader = "Edit "+data.title;
    this.buttonText = "Edit Advert";
  }

  onCancel() {
    this.edit = false;
    this.dataForm.reset();
    this.formHeader = this.buttonText = "Add New Advert";
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

  dailyCapCalculation() {
    let cap:number = 0;
    let impression:number = Number(this.dataForm.value.impression);
    let run_time:number = Number(this.dataForm.value.run_time);
    cap = Math.ceil(Number(impression/run_time));
    this.daily_cap.setValidators([Validators.required, Validators.min(cap)]);
    if (cap > 0) {
      this.dataForm.patchValue({
        daily_cap: cap
      });
      this.cap = cap;
      
    } else {
      this.daily_cap.setValidators(null);
    }
  }

  changeAdvertStatus(action:string, ref:number) {
    let data:Object = {
      ref: ref,
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

        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  deleteAdvert(ref:number) {
    this.processing = true;

    this.apiService.deleteAdvert(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Advert Removed Successfully", "Advert Deleted");
          this.ngOnInit();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }

        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  getDataFromAdvert(name:string, ref:number) {
    this.advertName = name;
    this.advertRef = ref;
  }
}
