import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
// import { Events } from '@ionic/angular';
import { CalendarComponentOptions } from 'ion2-calendar'
@Component({
  selector: 'app-calender',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calender.page.scss'],
})
export class CalenderPage implements OnInit {
  dateMulti: string[];
  type: 'string';
 

  optionsMulti: CalendarComponentOptions = {
    pickMode: 'multi'
  };


  data: any;
  modules = [];
  id: any;


  constructor(
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

  onChange($event) {
    console.log($event);
  }


  calenderList() {
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      module : 'Calendar',
      operation: 'listModuleRecords'
    };

    this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
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
