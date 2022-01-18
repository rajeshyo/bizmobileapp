import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
import { HttpClientModule  } from '@angular/common/http';
import { HeaderService } from '../services/header/header.service';

import { LeadformPage } from './leadform.page';


const routes: Routes = [
  {
    path: '',
    component: LeadformPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeadformPage],
  providers: [
    HeaderService,
    ModuleService
  ]
})
export class LeadformPageModule {}
