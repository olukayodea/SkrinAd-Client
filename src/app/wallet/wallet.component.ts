import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { Flutterwave, InlinePaymentOptions, PaymentSuccessResponse } from 'flutterwave-angular-v3';
import { environment } from 'src/environments/environment';
import { Counts } from '../_models/data';
import { ClientsData, UserData } from '../_models/users';
import { WalletData, WalletRange } from '../_models/wallet';
import { ApiService } from '../_services/api.service';
import { ChecksService } from '../_services/checks.service';
import { NotificationService } from '../_services/notification.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {
  routeParams: Params;
  queryParams: Params;
  
  page: number = 1;
  count: Counts;

  userData: UserData;

  pageUrl = this.router.url.slice(1);

  view: string = "";

  processing: boolean = false;
  loading: boolean = true;

  walletList: WalletData[] = [];
  walletRange: WalletRange;

  paymentLocaton: string[] = environment.paymentLocaton;
  allowOnline: boolean;

  dataForm = this.fb.group({
    amount: ["", Validators.required],
  }, {});
  
  get amount() { return this.dataForm.get('amount'); }

  ldate = new Date();

  firstDate = "";
  lastDate = this.checkService.formatDate(this.ldate);
  fromLastDate = this.lastDate;

  searchForm = this.fb.group({
    start_time: [ null, Validators.required],
    end_time: [ null, Validators.required]
  },{});

  get start_time() { return this.searchForm.get('start_time'); }
  get end_time() { return this.searchForm.get('end_time'); }

  constructor(
    private fb: FormBuilder,
    private checkService: ChecksService,
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private notifyService: NotificationService,
    private router: Router,
    private flutterwave: Flutterwave
  ) {
    this.userData = this.checkService.checkSession();
    this.getRouteParams();
    this.walletRange = new WalletRange();
  }

  ngOnInit(): void {
    if (this.queryParams['page'] !== undefined) {
      this.page = parseInt( this.queryParams['page'] );
    }  else {
      this.page = 1;
    }

    this.amount.setValidators([Validators.required, Validators.min(this.userData.country.minPayment)]);

    this.getWallet(this.page);
  }

  getWallet(page:number, from:number=0, to:number=0) {
    this.loading = true;

    this.apiService.getWallet(page, from, to).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.count = data.counts;
          this.walletRange = data.range;
          this.walletList = data.data;
        } else {
          this.notifyService.showError(data.error.message, "Error")
        }
      }
    );
  }

  onlinePayment() {
    let customerDetails = { name: this.userData.companyName, email: this.userData.contactEmail, phone_number: this.userData.contactPhone}
    let meta = {'counsumer_id': this.userData.ref, 'consumer_mac': this.userData.username};
    let customizations = {title: 'SkrinAd', description: 'Fund your SkrinAd account', logo: environment.assetsUrl+"images/logo.png"};
    let paymentData : InlinePaymentOptions = {
      public_key: environment.paymentKey,
      tx_ref: this.generateReference(),
      amount: this.dataForm.value.amount,
      currency: 'NGN',
      payment_options: 'card,ussd',
      meta: meta,
      customer: customerDetails,
      customizations: customizations,
      callback: this.makePaymentCallback,
      onclose: this.closedPaymentModal,
      callbackContext: this
    }

    this.makePayment(paymentData);

    // this.flutterwave.asyncInlinePay(paymentData).then(
    //   (response) =>{
    //     console.log("Promise Res" , response)
    //     this.flutterwave.closePaymentModal()
    //   }
    // )
  }

  makePayment(paymentData){
    this.flutterwave.inlinePay(paymentData)
  }

  makePaymentCallback(response: PaymentSuccessResponse): void {
    this.flutterwave.closePaymentModal();
    if (response.status == "successful") {

      var data: object = {
        amount: response.amount,
        transaction_channel: "Online_Payment",
        transaction_channel_id: response.transaction_id
      };

      this.postWallet(data);
    }
    console.log("Payment callback", response);
  }

  closedPaymentModal(): void {
    this.flutterwave.closePaymentModal();
    this.notifyService.showError("Payment not completed", "Wallet Deposit");
  }
  
  generateReference(): string {
    let date = new Date();
    return date.getTime().toString();
  }

  postWallet(postData) {
    this.loading = true;

    this.apiService.postWallet(postData).subscribe(
      data => {
        this.checkService.checkLoggedin(data);
        this.loading = false
        if (data.success == true) {
          this.notifyService.showSuccess("Your "+data.data.channel.text+" of "+data.data.value.currency.title+" "+data.data.value.amount+" was successful", "Wallet Deposit");
          this.ngOnInit();
        } else {
          this.notifyService.showError(data.error.message, "Error");
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

  numberWithCommas(x) {
    return x.toLocaleString();
  }

  getDate() {
    if(this.searchForm.invalid) {
      this.notifyService.showError("Select a valid date range to search", "Error")
      return;
    }
    let from = new Date(this.searchForm.value.start_time).getTime() / 1000;
    let to = (new Date(this.searchForm.value.end_time).getTime() / 1000)+(60*60*24);

    if (from > to) {
      this.notifyService.showError("The date to start the search is greater than the date to end the search, make sure your end date is greater than the start date", "Error");
      return;
    } else {
      this.getWallet(1, from, to);
    }
  }

  changeFrom(value) {
    this.fromLastDate = value
  }

}
