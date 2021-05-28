import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default/default.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';

const routes: Routes = [
  { path: "", component: DefaultComponent },
  { path: "login/error/:error", component: LoginComponent },
  { path: "login/done/:done", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "logout/:parameter", component: LogoutComponent },
  { path: "logout", component: LogoutComponent },
  { path: "lock", component: LockComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
