import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guard/auth.guard";
const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),canActivate: [AuthGuard]
  },
  // {
  //   path: '',
  //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  // },
  {
    path: 'leads/:module',
    loadChildren: () => import('./leads/leads.module').then( m => m.LeadsPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'leadform',
    loadChildren: () => import('./leadform/leadform.module').then( m => m.LeadformPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'leadform/:id',
    loadChildren: () => import('./leadform/leadform.module').then( m => m.LeadformPageModule),canActivate: [AuthGuard]
  },

  {
    path: 'leadsdetails',
    loadChildren: () => import('./leadsdetails/leadsdetails.module').then( m => m.LeadsdetailsPageModule),canActivate: [AuthGuard]
  },

  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'calender',
    loadChildren: () => import('./calender/calender.module').then( m => m.CalenderPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadChildren: () => import('./services/services.module').then( m => m.ServicesPageModule),canActivate: [AuthGuard]
  },
  {
    path: 'relation',
    loadChildren: () => import('./relation/relation.module').then( m => m.RelationPageModule)
  },
  {
    path: 'relation/:id',
    loadChildren: () => import('./relation/relation.module').then( m => m.RelationPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
