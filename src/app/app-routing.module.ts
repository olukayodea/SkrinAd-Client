import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvertsComponent } from './adverts/adverts.component';
import { CampaignComponent } from './adverts/campaign/campaign.component';
import { ViewAdvertComponent } from './adverts/view-advert/view-advert.component';
import { DefaultComponent } from './default/default.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: "", component: DefaultComponent },
  { path: "login/error/:error", component: LoginComponent },
  { path: "login/done/:done", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "logout/:parameter", component: LogoutComponent },
  { path: "logout", component: LogoutComponent },
  { path: "lock", component: LockComponent },

  { path:"adverts/view/:id", component: ViewAdvertComponent },
  { path:"adverts/campaign", component: CampaignComponent },
  { path:"adverts/:view", component: AdvertsComponent },
  { path:"adverts", component: AdvertsComponent },

  { path:"profile/:id", component: ProfileComponent },
  { path:"profile", component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
