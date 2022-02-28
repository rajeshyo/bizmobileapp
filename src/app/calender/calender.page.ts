import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
// import { Events } from '@ionic/angular';
import { CalendarComponent, CalendarComponentOptions } from 'ion2-calendar'
import {  FormGroup, Validators , NgForm } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-calender',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calender.page.scss'],
})
export class CalenderPage implements OnInit {
  dateMulti: string[];
  type: 'string';
  public onLeadForm: FormGroup;

  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };


  data: any;
  modules = [];
  id: any;
  bizFormData : {};
 date:any;


 
  eventSource = [];
  viewTitle: string;
  viewDate: string;
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };

@ViewChild(CalendarComponent) myCal: CalendarComponent;
  router: any;

  constructor(
    private activatedRoute : ActivatedRoute,
    public Router: Router,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
    // private headerservice: HeaderService,
   private toastService: ToastService,
 
  ) { }




  ngOnInit() {
    this.calenderList();

  }

//   Next() {
//     this.myCal.slideNext();
// }
go(moduleid: string,){
  console.log("uuuuuu",moduleid)
  const sampleid : any = "989809809";
  const name : any = "Calendar";
  this.Router.navigateByUrl('leadsdetails?id='+moduleid+'&name='+name);
}
addevent(){
  this.Router.navigateByUrl('leadform?name=Events');
}
addtask(){
  this.Router.navigateByUrl('leadform?name=Calendar');
}
onViewTitleChanged(title) {
  this.viewTitle = title;
}
onCurrentDateChanged(a){
  this.viewDate = a;
  console.log("Date",this.viewDate)
   this.date = moment(a).format("YYYY-MM-DD");
  console.log("new date",this.date)
  this.calenderList();
}



  onChange($event) {
    console.log($event);
  }


  calenderList() {
// console.log("formdatanew",this.bizFormData)
  console.log("iodate",this.date)
  //  document.write("opo",this.date)
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      module : 'Calendar',
      operation: 'listModuleRecords',
      search_key: 'date_start',
      search_value: this.date,
      operator: 'e',
    };

    this.moduleService.calender(getServiceData,options).subscribe(res => {
      this.data = res;
      console.log(this.data);
      if (this.data.success === true) {
        this.modules = this.data.result.records;
        // console.log(module);
        return this.modules;
      } else {
        console.log(this.data.result.error);
      }
    }, (err) => {
      console.log(err);
    });
}


}
