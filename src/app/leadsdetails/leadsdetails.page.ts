import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
@Component({
  selector: 'app-leadsdetails',
  templateUrl: './leadsdetails.page.html',
  styleUrls: ['./leadsdetails.page.scss'],
})
export class LeadsdetailsPage implements OnInit {

// constructor() { }
mainmodulename: any;
moduleiddata: any;
moduleid: any;
data: any;
modules = [];
relatedmodules=[];
showSpinner: boolean = true;
id: any;
 x:any; 
 j:any;
constructor(
  public navCtrl: NavController,
  public menuCtrl: MenuController,
  public loadingCtrl: LoadingController,
  private moduleService: ModuleService,
  // private headerservice: HeaderService,
  public route: ActivatedRoute,
  public router: Router,
) { 

    this.moduleid =this.route.snapshot.queryParamMap.get('id')
    this.mainmodulename =this.route.snapshot.queryParamMap.get('name')

}

ngOnInit() {
 // this.data.subscribe(() => this.showSpinner =false)

//  console.log(this.route.snapshot.queryParamMap.get('id'))
//  console.log(this.route.snapshot.queryParamMap.get('name'))

const modulename:any = JSON.parse(localStorage.getItem('modulesname'));

 for (let x of modulename) {
  //  console.log("listm",x.name)
   if(this.mainmodulename===x.name){
      //  console.log("moduleid",x.id)
     this.j = x.id
      // return j;
   }
  
  }
  this.relatedmodule();

  this.profileList();
  this.moduleidpass();

 }
 

profileList() {
  console.log("moduleid",this.j)

    this.route.paramMap.subscribe(params => {
    this.id = params.get('id');
  });
  // const modulename:any = JSON.parse(localStorage.getItem('modulesname'));
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    // console.log("mname",modulename)
     
    // if(modulename.name==this.mainmodulename){
    //   console.log("opiddd",modulename.id)
    // }else{
    //   console.log("nnnnn")
    // }
    

    // for (let x of modulename) {
    //   //  console.log("listm",x.name)
    //    if(this.mainmodulename===x.name){
    //        console.log("moduleid",x.id)
    //        return x.id
    //    }
      
    //   }
 
 
    
     

    const session = localStorage.getItem('session');
    const record = this.j+"x"+this.moduleid;
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      // record : this.id,
      module :  this.mainmodulename,
      operation: 'fetchRecordWithGrouping'

   };

    this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
      // console.log(this.data);
      if (this.data.success === true) {
        this.modules = this.data.result.record.blocks;
        // console.log('SSSSSS');
        // console.log(this.data.result.record.id);
        return this.modules;
      } else {
        console.log(this.data.result.error);
      }
    }, (err) => {
      console.log(err);
    });
}
moduleidpass() {
  console.log("moduleid",this.j)

    this.route.paramMap.subscribe(params => {
    this.id = params.get('id');
  });
  // const modulename:any = JSON.parse(localStorage.getItem('modulesname'));
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    // console.log("mname",modulename)
     
    // if(modulename.name==this.mainmodulename){
    //   console.log("opiddd",modulename.id)
    // }else{
    //   console.log("nnnnn")
    // }
    

    // for (let x of modulename) {
    //   //  console.log("listm",x.name)
    //    if(this.mainmodulename===x.name){
    //        console.log("moduleid",x.id)
    //        return x.id
    //    }
      
    //   }
 
 
    
     

    const session = localStorage.getItem('session');
    const record = this.j+"x"+this.moduleid;
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      // record : this.id,
      module :  this.mainmodulename,
      operation: 'fetchRecordWithGrouping'

   };

    this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
      // console.log(this.data);
      if (this.data.success === true) {
        this.moduleiddata = this.data.result.record;
        // console.log('SSSSSS');
        // console.log(this.data.result.record.id);
        return this.moduleiddata;
      } else {
        console.log(this.data.result.error);
      }
    }, (err) => {
      console.log(err);
    });
}
relatedmodule() {

  // const modulename:any = JSON.parse(localStorage.getItem('modulesname'));
    const loginData = JSON.parse(localStorage.getItem('logindata'));
   
    const session = localStorage.getItem('session');
    const record = this.j+"x"+this.moduleid;
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      // record : this.id,
      module :  this.mainmodulename,
      operation: 'getModuleRelations'

   };

    this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
      // console.log(this.data);
      if (this.data.success === true) {
        this.relatedmodules = this.data.result.relatedModules;
        // console.log('relatedmodule');
        // console.log(this.relatedmodules);
        return this.relatedmodules;
      } else {
        console.log(this.data.result.error);
      }
    }, (err) => {
      console.log(err);
    });
}

relatediddatapass(modulename: string,moduleid: string,){
  this.router.navigateByUrl('relation?id='+moduleid+'&name='+modulename);
}
form(mainmodulename: StringConstructor){
  this.router.navigateByUrl('leadform?name='+mainmodulename);
}

getrecordDetail(id) {
    alert(id);
}

}
