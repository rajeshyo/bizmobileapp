import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../services/module/module.service';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-relation',
  templateUrl: './relation.page.html',
  styleUrls: ['./relation.page.scss'],
})
export class RelationPage implements OnInit {
 
  data1: any;
  modules: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
  ) { }

  ngOnInit() {
    this.check()
  }


  check() {
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');

    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      username : loginData.username,
      password : loginData.password,
      operation: 'relatedRecordsWithGrouping',
    
      session
    };
    this.moduleService.getModuleListRelation(getServiceData, options).subscribe(res => {
      this.data1 = res;
      if (this.data1.success === true ) {
        console.log("yy",this.data1.result.records);
        this.modules = this.data1.result.records;
        // console.log("mydata",this.modules);
        return this.modules;
      }
    }, (err) => {
       console.log(err);
    });
  
  };
}
