import { Component, OnInit } from '@angular/core';
import { ModuleService } from '../services/module/module.service';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-relation',
  templateUrl: './relation.page.html',
  styleUrls: ['./relation.page.scss'],
})
export class RelationPage implements OnInit {
 
  data1: any;
  modules: any;
  mainmodulename: any;
  moduleid: any;
  x:any; 
  j:any;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
  ) { 
    
    this.moduleid =this.route.snapshot.queryParamMap.get('id')
    this.mainmodulename =this.route.snapshot.queryParamMap.get('name')
  }

  ngOnInit() {

    this.moduleid =this.route.snapshot.queryParamMap.get('id')
    const modulename:any = JSON.parse(localStorage.getItem('modulesname'));

 for (let x of modulename) {
  //  console.log("listm",x.name)
   if(this.mainmodulename===x.name){
       console.log("moduleid",x.id)
     this.j = x.id
      // return j;
   }
  
  }


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
      record: this.mainmodulename,
      relatedmodule: this.moduleid,
      session
    };
    this.moduleService.getModuleListRelation(getServiceData, options).subscribe(res => {
      this.data1 = res;
      if (this.data1.success === true ) {
        // console.log("yy",this.data1.result.records);
        this.modules = this.data1.result.records;
        // console.log("mydata",this.modules);
        return this.modules;
      }
    }, (err) => {
       console.log(err);
    });
  
  };
}
