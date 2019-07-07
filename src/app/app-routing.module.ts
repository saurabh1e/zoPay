import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import {AuthGuard} from './providers/auth-gaurd.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tutorial',
    pathMatch: 'full'
  },
  // {
  //   path: 'account',
  //   loadChildren: './pages/account/account.module#AccountModule'
  // },
  // {
  //   path: 'support',
  //   loadChildren: './pages/support/support.module#SupportModule'
  // },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginModule'
  },
  {
    path: 'signup',
    loadChildren: './pages/signup/signup.module#SignUpModule'
  },
  {
    path: 'app',
    canLoad: [AuthGuard],
    loadChildren: './pages/tabs-page/tabs-page.module#TabsModule'
  },
  {
    path: 'tutorial',
    canLoad: [AuthGuard],
    loadChildren: './pages/tutorial/tutorial.module#TutorialModule',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
