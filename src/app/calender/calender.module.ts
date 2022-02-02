import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModuleService } from '../services/module/module.service';
import { HeaderService } from '../services/header/header.service';
import { HttpClientModule  } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CalendarModule } from 'ion2-calendar';
import { NgCalendarModule  } from 'ionic2-calendar';
import { CalenderPage } from './calender.page';
// import { NgCalendarModule  } from 'ionic2-calendar';

const routes: Routes = [
  {
    path: '',
    component: CalenderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    CalendarModule,
    NgCalendarModule,
    RouterModule.forChild(routes),
    // NgCalendarModule,
  ],
  declarations: [CalenderPage],
  providers: [
    ModuleService,
    HeaderService
]
})
export class CalenderPageModule {}
