import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AdvertsData } from '../_models/advert';
import { Counts, CategoryData, CountryData, AreasData } from '../_models/data';
import { SurveyData } from '../_models/surveys';
import { ClientsData, UserData } from '../_models/users';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.css']
})
export class SurveysComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  userData: UserData;

  pageUrl = this.router.url.slice(1);

  mainHeader: string = "List All Surveys";
  formHeader: string = "Add New Survey";
  view: string = "";

  processing: boolean = false;
  submitActive: boolean = true;
  personalData: boolean = false;
  loading: boolean = true;
  buttonText: string = "Add New Survey";
  submitActiveData: string;
  personalDataMsg: string;

  surveyList: SurveyData[] = [];
  categoryList: CategoryData[] = [];
  areaList: AreasData[] = [];
  advertList: AdvertsData[] = [];

  edit: boolean = false;

  imp_cost: number = 0;
  min_imp: number = 0;
  min_survey_budget: number = 0;
  surveyRef:number = 0;
  surveyName:string = "";

  total:number = 0;

  dataForm = this.fb.group({
    ref: [""],
    title: ["", Validators.required],
    advert: ["", Validators.required],
    caption: ["", Validators.required],
    impression: ["", Validators.required],
    budget: ["", Validators.required],
    category: ["", Validators.required],
    avail_date: ["", Validators.required],
    age: ["", Validators.required],
    gender: ["", Validators.required],
    areas: ["", Validators.required],
    request_personal_data: ["", Validators.required],
    multiple: ["", Validators.required],
    random_order: ["", Validators.required]

  }, {});
  
  get ref() { return this.dataForm.get('ref'); }
  get title() { return this.dataForm.get('title'); }
  get advert() { return this.dataForm.get('advert'); }
  get caption() { return this.dataForm.get('caption'); }
  get impression() { return this.dataForm.get('impression'); } // get min impression
  get budget() { return this.dataForm.get('budget'); }
  get category() { return this.dataForm.get('category'); }
  get avail_date() { return this.dataForm.get('avail_date'); }
  get age() { return this.dataForm.get('age'); }
  get gender() { return this.dataForm.get('gender'); }
  get areas() { return this.dataForm.get('areas'); }
  get request_personal_data() { return this.dataForm.get('request_personal_data'); }
  get multiple() { return this.dataForm.get('multiple'); }
  get random_order() { return this.dataForm.get("random_order") }

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
    this.getSurveyData();
    this.getAdverts();
  }

  ngOnInit(): void {
    if (this.routeParams['view'] !== undefined) {
      this.view = this.routeParams['view'];
      this.mainHeader = "List "+this.view+" Surveys";
      this.view = this.view.toLowerCase();
    }

    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    } else {
      this.page = 1;
    }
    this.getSurvey(this.page);
  }

  getSurveyData() {
    this.apiService.getSurveyData().subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
          this.categoryList = data.data.categories;
          this.areaList = data.data.areas;
          this.imp_cost = data.data.imp_cost;
          this.min_imp = data.data.min_survey_imp;
          this.min_survey_budget = data.data.min_survey_budget;

          this.impression.setValidators([Validators.required, Validators.min(data.data.min_survey_imp)]);
          this.dataForm.patchValue({
            impression: data.data.min_survey_imp,
          });

          this.budget.setValidators([Validators.required, Validators.min(data.data.min_survey_budget)]);
          this.dataForm.patchValue({
            budget: data.data.min_survey_budget,
          });
          this.total = data.data.min_survey_budget;
        } else {
          this.notifyService.showError("An error occured getting data to build this page", "Error")
        }
      }
    );
  }

  getSurvey(page) {
    this.loading = true;

    this.apiService.getSurvey(page, this.view).subscribe(
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

  getAdverts() {
    this.loading = true;

    this.apiService.getRuningAdverts(0, true).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        if (data.success == true) {
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
      advert: this.dataForm.value.advert,
      impression: this.dataForm.value.impression,
      budget: this.total,
      category: this.dataForm.value.category,
      avail_date: this.dataForm.value.avail_date,
      age: this.dataForm.value.age,
      gender: this.dataForm.value.gender,
      country: this.userData.country.iso,
      areas: this.dataForm.value.areas,
      request_personal_data: this.dataForm.value.request_personal_data,
      multiple: this.dataForm.value.multiple,
      random_order: this.dataForm.value.random_order
    };

    if (this.edit === true) {
      data['ref'] = this.dataForm.value.ref;

      this.editSurvey(data);
    } else {
      this.createSurvey(data);
    }
  }

  createSurvey( data ) {
    this.processing = true;

    this.buttonText = "Adding New Survey...";
    this.apiService.createSurvey(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Created "+data.title+" as a Survey", "Survey Created");
          this.ngOnInit();
          this.dataForm.reset();
          this.router.navigate(['/surveys/view', user.data.ref]);
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Survey";
      }
    );
  }

  editSurvey( data ) {
    this.processing = true;

    this.buttonText = "Saving Changes...";
    this.apiService.editSurvey(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("saved changes made to Survey", "Survey Modified");
          this.ngOnInit();
          this.dataForm.reset();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add New Survey";
        this.edit = false;
      }
    );
  }

  getEdit(data:SurveyData) {
    let category = [];
    data.category.forEach(element => {
      category.push(element.ref);
    });

    let advert = data.advert.ref;
    if (advert === undefined) {
      advert = 0;
    }

    this.dataForm.patchValue({
      ref: data.ref,
      advert: advert,
      title: data.title,
      caption: data.caption,
      impression: data.impression.issued,
      budget: data.impression.budget.amount,
      category: category,
      avail_date: data.avail_date,
      age: data.age,
      gender: data.gender,
      country: data.country,
      areas: data.areas,
      request_personal_data: data.getPersonalData,
      multiple: data.multipleAnswers,
      random_order: data.randomOrder
    });

    this.dataForm.get('advert').disable();

    this.edit = true;
    this.formHeader = "Edit "+data.title;
    this.buttonText = "Edit Survey";
  }

  onCancel() {
    this.edit = false;
    this.dataForm.reset();
    this.formHeader = this.buttonText = "Add New Survey";
    this.dataForm.get('advert').enable();
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

  changeSurveyStatus(action:string, ref:number) {
    let data:Object = {
      ref: ref,
      status: action.toLowerCase()
    }

    this.processing = true;

    this.apiService.changeSurveyStatus(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Changes made to survey successfully", "Survey Modified");
          this.ngOnInit();
          if (action == "approve") {
            this.notifyService.showSuccess("Survey is now active and will now be pushed to the users", "Survey Activated");
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

  deleteSurvey(ref:number) {
    this.processing = true;

    this.apiService.deleteSurvey(ref).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Survey Removed Successfully", "Survey Deleted");
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

  getDataFromSurvey(name:string, ref:number) {
    this.surveyName = name;
    this.surveyRef = ref;
  }

  calculateFee() {
    let impression:number = Number(this.dataForm.value.impression);
    let budget:number = Number(this.dataForm.value.budget);
    let request_personal_data:number = Number(this.dataForm.value.request_personal_data);

    if (this.imp_cost > (budget/impression)) {
      this.submitActive = false;
      this.submitActiveData = "The minimum impression cost is "+this.imp_cost+", based on the impression and your budget, your impression cost is "+(budget/impression)+". Please increase your budget or reduce your impression";
    } else {
      this.submitActive = true;
    }

    this.total = budget;

    if (request_personal_data == 1) {
      this.total = (budget*2);
      this.personalData = true;
      this.personalDataMsg = "You will be charged "+budget+" extra for this service";
    } else {
      this.personalData = false;
    }
  }

}
