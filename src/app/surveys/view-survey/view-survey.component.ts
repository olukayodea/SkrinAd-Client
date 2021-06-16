import { Component, OnInit } from '@angular/core';
import { Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Counts } from 'src/app/_models/data';
import { SurveyData } from 'src/app/_models/surveys';
import { ApiService } from 'src/app/_services/api.service';
import { ChecksService } from 'src/app/_services/checks.service';
import { NotificationService } from 'src/app/_services/notification.service';

@Component({
  selector: 'app-view-survey',
  templateUrl: './view-survey.component.html',
  styleUrls: ['./view-survey.component.css']
})
export class ViewSurveyComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  pageUrl = this.router.url.slice(1);

  buttonText: string = "Add Question";
  extendButtonText: string = "Extend Campaign";
  view: string = "";

  processing: boolean = false;
  loading: boolean = true;

  surveyRef: number;
  surveyGalleryRef: number;
  surveyData: SurveyData;

  walletBalance: number;
  amountDue: number;

  detailsTab: boolean = true;
  questionnaireTab: boolean = false;
  statTab: boolean = false;
  extend: boolean = false;

  addResponseData: boolean = false;

  dataLabelError: true | false | null = null;

  canvas: any;
  ctx: any;

  graphData: any;
  interval: any;

  fileToUpload: File = null;

  dataForm = this.fb.group({
    title: ["", Validators.required],
    response_type: ["", Validators.required],
    response_data: this.fb.array([], [Validators.required]),
    min_selection: [{value: 1, disabled: true}, Validators.required],
    allow_manual_data: [{value: "", disabled: true}, Validators.required],
    media: [""],
    data_label: [{value: "", disabled: true}],
  }, {});
  get title() { return this.dataForm.get('title'); }
  get response_type() { return this.dataForm.get('response_type'); }
  get response_data() { return this.dataForm.get('response_data') as FormArray; }
  get min_selection() { return this.dataForm.get('min_selection'); }
  get allow_manual_data() { return this.dataForm.get('allow_manual_data'); }
  get media() { return this.dataForm.get('media'); }
  get data_label() { return this.dataForm.get('data_label'); }

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
    this.checkService.checkSession();
    this.getRouteParams();
    this.surveyData = new SurveyData();
  }

  ngOnInit(): void {
    if (this.routeParams['id'] !== undefined) {
      this.surveyRef = this.routeParams['id'];
    }
    if (this.queryParams['page'] !== undefined) {
      this.page = this.queryParams['page'];
    }  else {
      this.page = 1;
    }

    this.getOneSurvey();
  }

  getOneSurvey() {
    this.loading = true;

    this.apiService.getOneSurvey(this.surveyRef).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false;
        if (data.success == true) {
          if (data.data.ref !== undefined) {
            this.surveyData = data.data;
            this.walletBalance = this.surveyData.finance.wallet.currentBalance.amount - this.surveyData.finance.campaignTotal.amount;
            this.amountDue = Math.abs(this.walletBalance);
          } else {
            this.router.navigate(['/surveys']);
            this.notifyService.showError("The page you are trying to access does not exist", "Error")
          }
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );
  }

  changeSurveyStatus(action:string) {
    let data:Object = {
      ref: this.surveyRef,
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

        document.getElementById('modal-secondary').click();
        document.getElementById('modal-activate').click();
        document.getElementById('modal-deactivate').click();
        document.getElementById('modal-delete').click();
      }
    );
  }

  deleteSurvey() {
    this.processing = true;

    this.apiService.deleteSurvey(this.surveyRef).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Survey Removed Successfully", "Survey Deleted");
           this.router.navigate(['/surveys']);
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

  onExtend() {
    var data: object = {
      ref: this.surveyData.ref,
      impression: this.extendForm.value.impression
    };
    this.extendSurvey(data);
  }

  extendSurvey(data) {
    this.processing = true;

    this.extendButtonText = "Please wait...";
    this.apiService.extendSurvey(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Added "+data.impression+ " impressions to " +this.surveyData.title+"", "Survey Extended");
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

  onAddQuestion() {
    if(this.dataForm.invalid) {
      return;
    }

    let response_data = [];
    if (this.dataForm.value.response_data !== undefined) {
      this.dataForm.value.response_data.forEach(element => {
        response_data.push(element.response_data_value);
      });
    }

    var data: object = {
      survey: this.surveyRef,
      title: this.dataForm.value.title,
      response_type: this.dataForm.value.response_type,
      response_data: response_data,
      min_selection: this.dataForm.value.min_selection,
      allow_manual_data: this.dataForm.value.allow_manual_data,
      // media: this.dataForm.value.media,
      media: 0
    };
    this.addQuestion(data);
  }

  addQuestion(data) {
    this.processing = true;

    this.buttonText = "Adding...";
    this.apiService.addQuestion(data).subscribe(
      user => {
        this.checkService.checkLoggedin(user);
        this.processing = false
        if (user.success == true) {
          this.notifyService.showSuccess("Added survey question", "Survey Modified");
          this.ngOnInit();
          this.changeTab("question");
          this.dataForm.reset();
          this.response_data.clear();
        } else {
          this.notifyService.showError(user.error.message, "Error")
        }
        this.buttonText = "Add Question";
      }
    );
  }

  onFileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  upload() {
    this.processing = true;

    this.buttonText = "Uploading...";
    this.apiService.uploadFile(this.surveyRef, this.fileToUpload).subscribe(
      upload => {
        this.checkService.checkLoggedin(upload);
        if (upload.success == true) {
          this.notifyService.showSuccess("Uploaded new file to gallery", "Survey Updated");
          this.ngOnInit();
        } else {
          this.notifyService.showError(upload.error.message, "Error")

        }
        this.buttonText = "Upload";
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

  numberWithCommas(x) {
    return x.toLocaleString();
  }

  setGalleryID (ref) {
    this.surveyGalleryRef = ref;
  }

  addData() {
    this.dataLabelError = null;
    var data_label = this.dataForm.value.data_label;

    if (data_label === "") {
      this.dataLabelError = true;
    } else {
      this.dataLabelError = false;
    }
    
    if (!this.dataLabelError) {
      this.response_data.push(this.createItem({
        response_data_value: data_label,
      }));
      this.dataForm.patchValue({
        data_label: "", 
      });
      this.dataLabelError = null;
    }
  }
  
  createItem(data): FormGroup {
    return this.fb.group(data);
  }
  
  removeData(i){
		this.response_data.removeAt(i);
	}

  detectChange() {
    var data_label = this.dataForm.value.data_label;
    if (data_label === "") {
      this.dataLabelError = null;
    } else {
      this.dataLabelError = false;
    }
  }

  changeTab(view:string) {
    if (view == 'details') {
      this.detailsTab = true;
      this.questionnaireTab = false;
      this.statTab = false;
    } else if (view == 'question') {
      this.detailsTab = false;
      this.questionnaireTab = true;
      this.statTab = false;
    } else if (view == 'stats') {
      this.detailsTab = false;
      this.questionnaireTab = false;
      this.statTab = true;
      // this.drawChart('dailyImpression');
    } else {
      this.detailsTab = true;
      this.questionnaireTab = false;
      this.statTab = false;
    }
  }

  doExtend(action:boolean) {
    this.extend = action;
  }

  calculateImpression() {
    // let impression: number = Number(this.extendForm.value.impression);

    // if (impression >= 1000) {
    //   let amount: number = this.surveyData.finance.amtPerImp.amount*impression;
    //   let balance: number = this.surveyData.finance.wallet.currentBalance.amount;

    //   let due: number = balance-amount;

    //   if (due < 0) {
    //     this.extendForm.controls['impression'].setErrors({'incorrect': true});
    //   } else {
    //       this.extendForm.controls['impression'].setErrors(null);
    //   }
    // }
  }
  
  getHostname = (url) => {
    if (url != undefined) {
      return new URL(url).hostname;
    }
  }

  responseTypeSelector() {
    var response_type = this.dataForm.value.response_type;

    if (response_type == "single_selection") {
      this.dataForm.get('response_data').enable();
      this.dataForm.get('allow_manual_data').enable();
      this.dataForm.get('data_label').enable();
      this.dataForm.get('min_selection').disable();

      this.addResponseData = true;

      this.dataForm.patchValue({
        allow_manual_data: "", 
      });
    } else if (response_type == "multi_selection") {
      this.dataForm.get('response_data').enable();
      this.dataForm.get('allow_manual_data').enable();
      this.dataForm.get('data_label').enable();
      this.dataForm.get('min_selection').enable();

      this.addResponseData = true;

      this.dataForm.patchValue({
        allow_manual_data: "", 
      });
    } else if (response_type == "scaling") {
      this.dataForm.get('response_data').enable();
      this.dataForm.get('allow_manual_data').disable();
      this.dataForm.get('data_label').enable();
      this.dataForm.get('min_selection').disable();

      this.addResponseData = true;

      this.dataForm.patchValue({
        allow_manual_data: 0, 
      });
    } else {
      this.dataForm.get('response_data').disable();
      this.dataForm.get('allow_manual_data').disable();
      this.dataForm.get('data_label').disable();
      this.dataForm.get('min_selection').disable();

      this.addResponseData = false;

      this.dataForm.patchValue({
        allow_manual_data: 0, 
      });
      this.response_data.clear();
    }
  }

}
