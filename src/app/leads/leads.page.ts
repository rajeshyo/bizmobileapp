import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
// import { ItemSliding } from 'ionic-angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.page.html',
  styleUrls: ['./leads.page.scss'],
})
export class LeadsPage implements OnInit {

  // constructor() { }
  data: any;
  modules = [];
  recordsdata = [];
  modulename:any;
  moduleid:any;
  headers: any;
  // blocks:string  = "";
  // fields:string  = '';
  id: any;
  showSpinner: boolean = true;
  searchTerm: any = "";
  leadsearch: any;
  constructor(
    private activatedRoute : ActivatedRoute,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
    public router: Router,
    // private headerservice: HeaderService,
    private toastService: ToastService,
  ) {
    
    this.modulename =this.activatedRoute.snapshot.paramMap.get('module')
    // this.modulename =this.activatedRoute.snapshot.queryParamMap.get('modulename')
    // this.moduleid =this.activatedRoute.snapshot.queryParamMap.get('id')

    
    this.generateTopics(); }

  ngOnInit() {
    this.leadsList();
    // this.leadsdeleteList();
    // console.log("mymname",this.modulename);
    // console.log("myid",this.moduleid);



  }

go(modulename: string,moduleid: string,){
  const sampleid : any = "989809809";
  const name : any = "rajesh";
  this.router.navigateByUrl('leadsdetails?id='+moduleid+'&name='+modulename);
}
form(modulename: String,moduleid: string,){
  this.router.navigateByUrl('leadform?name='+modulename);
}
formedit(modulename: string,moduleid: string,){
  this.router.navigateByUrl('leadform?id='+moduleid+'&name='+modulename);
}
  // details(modulename: string,moduleid: string,){
  //   // this.router.navigateByUrl('/leadsdetails?modulename='+modulename+'&id='+moduleid);
  //   this.router.navigateByUrl('/leadsdetails?modulename='+modulename);
  //   console.log("mmop",modulename,moduleid);

  // }
  // details(modulename: string){
  
  //   this.router.navigate(['/leadsdetails/'+modulename]);
  //   console.log("mmop",modulename);
    
  // }


  leadsList() {
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url: loginData.url,
      session,
      module: this.modulename,
      operation: 'listModuleRecords',
   
    };

    this.moduleService.getservicesListSync(getServiceData, options).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
      // console.log('TestData');
      // console.log(this.data);
      if (this.data.success === true) {
        if (this.data.result !== null) {
        
          this.headers = this.data.result.headers;
          this.recordsdata = this.data.result.records;

          console.log(this.recordsdata);


          // const array1 = this.modules;

          // for (const element of array1) {
          //   console.log("element",element.name);
          //   return element.name
          // }
 
          // const array2 = this.recordsdata;

          // for (const element1 of array2) {
          //   console.log("element1",element1);
          //   return element1.name
          // }
         


          let headers = this.modules
          return this.modules;
        }
      } else {
        console.log(this.data.result.error);
      }
    }, (err) => {
      console.log(err);
    });
  }
  leadsdeleteList(id) {

    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    // const id = localStorage.getItem('id');
    const id1 = id;
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url: loginData.url,
      session,
      module: this.modulename,
      // id: id.split('x')[1],
      operation: 'deleteRecords'
    };

    // console.log(getServiceData);
    this.moduleService.getservicesListSync(getServiceData, id1).subscribe(res => {
      //  this.router.navigate(['/leads']);
      this.leadsList();
      this.toastService.presentToast('Delete Successful');
      // location.reload();
      // console.log('hgvhvhv');
      // console.log(this.id);
    }, (err) => {
    });
  }
  refresh(refresher) {
    // console.log('Begin async operation', refresher);

    setTimeout(() => {
      // console.log('Async operation has ended');
      this.leadsList();
    }, 50);
  }


  generateTopics() {
    //  this.topics = [
    //   'Storage in Ionic 2',
    //   'Ionic 2 - calendar',
    //   'Creating a Android application using ionic framework.',
    //   'Identifying app resume event in ionic - android',
    //   'What is hybrid application and why.?',
    //   'Procedure to remove back button text',
    //   'How to reposition ionic tabs on top position.',
    //   'Override Hardware back button in cordova based application - Ionic',
    //   'Drupal 8: Enabling Facets for Restful web services',
    //   'Drupal 8: Get current user session',
    //   'Drupal 8: Programatically create Add another field - Example',  
    // ];

    for (let lead of this.modules) {
      for (let data of lead.blocks) {
        for (let alldata of data.fields) {
          //  return item.alldata.firstname.value;
          // return item.blocks.fields;

          if (alldata.name === 'firstname') {
            if (alldata.value === 'lkml') {
              // console.log('testdataaafaf');
              // console.log(alldata.value);
              // console.log(lead);
              return this.modules;
            }


          }

        }
      }
    }
  }

  getTopics(ev: any) {
    // console.log('TESTDFDSF');
    // console.log(this.topics);
    // console.log('xxxxxxx');
    //  console.log(this.modules);
    var blocks: any;
    //  var fields: string[];
    this.generateTopics();
    let serVal = ev.target.value;
    if (serVal && serVal.trim() != '') {
      this.modules = this.modules.filter((modules) => {
        // console.log(this.topics);
        return (modules);
      })
    }
  }

  // This is sliding closing function
  // slidingclose(slidingItem: ItemSliding) {
  //   slidingItem.close();
  // }
}
