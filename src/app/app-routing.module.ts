import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './account/signup/signup.component';
import { LoginComponent } from './account/login/login.component';
import { MapComponent } from './pages/map/map.component';
import { AddComponent } from './pages/add/add.component';
import { HistoryComponent } from './pages/history/history.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './service/authentication/auth.guard';

const routes: Routes = [   // Associa le pagine a URL
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent, pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent,canActivate:[AuthGuard] },
  { path: 'add', component: AddComponent , canActivate:[AuthGuard], canActivateChild: [AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate:[AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate:[AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  static forRoot: any;
}
