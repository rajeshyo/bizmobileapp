import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomeService } from '../services/home/home.service';
import { HeaderService } from '../services/header/header.service';
import { HttpClientModule  } from '@angular/common/http';
import { ModuleService } from '../services/module/module.service';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
  providers: [
    HomeService,
    HeaderService,
    ModuleService
  ]
})
export class HomePageModule {}
