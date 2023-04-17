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
  submit: boolean = true;
  showQuestion: boolean = false;
  buttonText: string = "Add New Advert";

  advertList: AdvertsData[] = [];
  categoryList: CategoryData[] = [];
  areaList: AreasData[] = [];

  currentDate: string = "";
  endDate: string = "";

  edit: boolean = false;

  cap: number = 0;
  min_imp: number = 0;
  advertRef:number = 0;
  advertName:string = "";

  surveyQuestions:string[] = [];

  dataForm = this.fb.group({
    ref: [""],
    title: ["", Validators.required],
    caption: ["", Validators.required],
    type: ["", Validators.required],
    impression: ["", Validators.required],
    start_date: ["", Validators.required],
    end_date: ["", Validators.required],
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
    survey: ['', Validators.required],
    question: [""]
  }, {});

  questionForm = this.fb.group({
    questionaire: ["", Validators.required]
  }, {});
  
  get ref() { return this.dataForm.get('ref'); }
  get title() { return this.dataForm.get('title'); }
  get caption() { return this.dataForm.get('caption'); }
  get type() { return this.dataForm.get('type'); }
  get impression() { return this.dataForm.get('impression'); } // get min impression
  get start_date() { return this.dataForm.get('start_date'); }
  get end_date() { return this.dataForm.get('end_date'); }
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
  get survey() { return this.dataForm.get('survey'); }
  get question() { return this.dataForm.get('question'); }

  get questionaire() { return this.questionForm.get('questionaire'); }

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

    this.currentDate = this.endDate = new Date().toISOString().slice(0, 10);
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
      start_date: this.dataForm.value.start_date,
      end_date: this.dataForm.value.end_date,
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
      areas: this.dataForm.value.areas,
      survey: this.dataForm.value.survey,
      question: this.surveyQuestions
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
      start_date: data.impression.runTime,
      end_date: data.impression.dailyCap,
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
      areas: data.areas,
      survey: data.survey
    });
    this.surveyQuestions = data.question;
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

  endTimeCalculator() {
    this.endDate = this.dataForm.value.start_date;
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

  surveryChange() {
    let survey:number = this.dataForm.value.survey;
    if ( survey == 1 ) {
      this.submit = false;
      this.showQuestion = true;
    } else {
      this.submit = true;
      this.showQuestion = false;
    }
  }

  addQuestion() {
    let questionaire:string = this.questionForm.value.questionaire;
    this.surveyQuestions.push(questionaire);
    if (this.surveyQuestions.length > 0) {
      this.submit = true;
    }
    this.questionForm.reset();
  }

  removeQuestion( key ) {
    this.surveyQuestions.splice(key, 1);
  }
}
