import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModuleService } from '../services/module/module.service';
import { HeaderService } from '../services/header/header.service';
import { HttpClientModule  } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { LeadsPage } from './leads.page';

const routes: Routes = [
  {
    path: '',
    component: LeadsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      IonicModule,
      HttpClientModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LeadsPage],
  providers: [
    ModuleService,
    HeaderService
]
})
export class LeadsPageModule {}
