import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlutterwaveModule } from 'flutterwave-angular-v3';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncrDecrService } from './_services/encode.decode.service';
import { LoginComponent } from './login/login.component';
import { DefaultComponent } from './default/default.component';
import { LogoutComponent } from './logout/logout.component';
import { LockComponent } from './lock/lock.component';
import { FooterComponent } from './common/pages/footer/footer.component';
import { HeaderComponent } from './common/pages/header/header.component';
import { SidebarComponent } from './common/pages/sidebar/sidebar.component';
import { ProfileComponent } from './profile/profile.component';
import { CampaignComponent } from './adverts/campaign/campaign.component';
import { AdvertsComponent } from './adverts/adverts.component';
import { ViewAdvertComponent } from './adverts/view-advert/view-advert.component';
import { PaginationComponent } from './common/widget/pagination/pagination.component';
import { WalletComponent } from './wallet/wallet.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DefaultComponent,
    LogoutComponent,
    LockComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    CampaignComponent,
    AdvertsComponent,
    ViewAdvertComponent,
    PaginationComponent,
    WalletComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FlutterwaveModule
  ],
  providers: [
    EncrDecrService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
