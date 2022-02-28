import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators , NgForm } from '@angular/forms';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leadform',
  templateUrl: './leadform.page.html',
  styleUrls: ['./leadform.page.scss'],
})
export class LeadformPage implements OnInit {
  public onLeadForm: FormGroup;
  mainmodulename: any;
  moduleid: any;
  leadData = {};
  data: any;
  ownerValues : [];
  id: any;
  bizFormData : {};
  getServiceData: {};
  editrecord: any;
  x:any; 
  j:any;
  k: any;
  modules = [];
  loaddata = 0;
  showSpinner: boolean = true;
  headers: any;
  recordsdata: any;
  modulename: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    public router: Router,
    // private headerservice: HeaderService,
    private toastService: ToastService,
    private moduleService: ModuleService,
    private route: ActivatedRoute,
  ) {
    this.moduleid =this.route.snapshot.queryParamMap.get('id')
    this.mainmodulename =this.route.snapshot.queryParamMap.get('name')
   }

  ngOnInit() {

    const modulename:any = JSON.parse(localStorage.getItem('modulesname'));

    for (let x of modulename) {
     //  console.log("listm",x.name)
      if(this.mainmodulename===x.name){
          console.log("moduleid",x.id)
        this.j = x.id
         // return j;
      }
     
     }


    console.log("mop",this.moduleid)
    this.bizFormData = {};
    this.profileList();
    
     this.onLeadForm = this.formBuilder.group({
      'lastname': [null, Validators.compose([
        Validators.required
      ])],
      'assigned_user_id': [null, Validators.compose([
        Validators.required
      ])]
    });
     this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });

     const loginData = JSON.parse(localStorage.getItem('logindata'));
     const session = localStorage.getItem('session');
     const options = this.moduleService.callHeader(); 
     const record = this.j+"x"+this.moduleid;
   
     const getFetchData = {
      url : loginData.url,
      session,
      module : this.mainmodulename,
      operation: 'fetchRecord',
    };
     if (this.moduleid !== null) {      // fetchrecord
    this.moduleService.getservicesListSync(getFetchData, record).subscribe(res => {
      this.data = res;
      if (this.data !== null) {
          if (this.data.success === true) {
              // console.log(this.data);
              if (this.data.result.record !== null) {
                this.editrecord = this.data.result.record;
                let dataRecieved =Object.keys(this.data.result.record);
                for(let l=0;l< dataRecieved.length; l++){
                  this.bizFormData[dataRecieved[l]] = this.editrecord[dataRecieved[l]];
                }
              }

          } else {
            this.toastService.presentToast('jj Wrong');
          }
      } else {
          this.toastService.presentToast('ff Wrong');
      }
    }, (err) => {
      console.log(err);
    });
  }
  }

  profileList() {
    console.log("moduleidnew",this.j)
    this.route.paramMap.subscribe(params => {
    this.id = params.get('id');
  });

    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const record = this.id;
    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      session,
      module : this.mainmodulename,
      operation: 'describe'

   };
    this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
    

  
   

      if (this.data.success === true) {
        this.loaddata =1;

        this.modules = this.data.result.describe.fields;
        // console.log("ghdata",this.modules)
 let  test_this = this;      
const test = "assigned_user_id"
this.modules.forEach(function (value, i) {
    if(test===value.name){
  console.log('dataidssss%d', i);
  test_this.k = i;
 }

});
// console.log("jkjk",this.modules.indexOf(test));
// console.log("kvalue",test_this.k)

if(this.k){      
let ids = Object.keys(this.modules[test_this.k]['type']['picklistValues']['users']);
        this.modules['ownerdata'] = [];
        for(let i=0;i< ids.length;i++){
          let a = {'id': ids[i] , 'label' : this.modules[test_this.k]['type']['picklistValues']['users'][ids[i]]};
          this.modules['ownerdata'].push(a);
        }
        let idGrops = Object.keys(this.modules[test_this.k]['type']['picklistValues']['groups']);
        let igGroupslength =  idGrops.length;
        for(let j=0;j< igGroupslength;j++){
          let a = {'id': idGrops[j] , 'label' : this.modules[test_this.k]['type']['picklistValues']['groups'][idGrops[j]]};
          this.modules['ownerdata'].push(a);
        }
      } 
        // console.log(this.modules);
        let group={}    
        for(let z=0;z< this.modules.length; z++){
            let label = this.modules[z]['name'];
            group[label]= [''];  
        }
        this.onLeadForm = this.formBuilder.group(group);

       // return this.modules;
      } else {
        console.log(this.data.result.error);
      }

    }, (err) => {
      console.log(err);
    });
}
openModel(modulename: String){
  console.log("ll",modulename)
  const loginData = JSON.parse(localStorage.getItem('logindata'));
  const session = localStorage.getItem('session');
  const options = this.moduleService.callHeader();
  const getServiceData = {
    url: loginData.url,
    session,
    module: modulename,
    operation: 'listModuleRecords',
 
  };

  this.moduleService.getservicesListSync(getServiceData, options).subscribe(res => {
    this.data = res;
    if (this.data.success === true) {
      if (this.data.result !== null) {
      
        this.headers = this.data.result.headers;
        this.recordsdata = this.data.result.records;
        console.log("relad",this.recordsdata)
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

onSubmit(form: NgForm) {
console.log("formdatanew",this.bizFormData)
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const options = this.moduleService.callHeader();
    const record = this.j+"x"+this.moduleid;

    if (this.moduleid !== null) {
      //Update Record
      
        const getServiceData = {
          url : loginData.url,
          session,
          module : this.mainmodulename,
          operation: 'saveRecord',
          values : JSON.stringify(this.bizFormData),
          // record : this.id
        };

        this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
          this.data = res;
          if (this.data !== null) {
              if (this.data.success === true) {
              this.toastService.presentToast('Record has been successfully updated');
              // this.navCtrl.navigateRoot('/leads/{{mainmodulename}}');
              this.router.navigateByUrl('/leads/'+this.mainmodulename);
              } else {
                this.toastService.presentToast(this.data.error.message);
              }
          } else {
              this.toastService.presentToast('Something Wrong');
          }
        }, (err) => {
          console.log(err);
        });
        } else {                    //Insert Record
          form['id'] = undefined;
      const getServiceData = {
            url : loginData.url,
            session,
            module :  this.mainmodulename,
            operation: 'saveRecord',
            values : JSON.stringify(this.bizFormData)  
        };

      this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
          this.data = res;
          if (this.data !== null) {
              if (this.data.success === true) {
              this.toastService.presentToast('Record has been successfully added');
              // this.navCtrl.navigateRoot('/leads/{{this.mainmodulename}}');
              this.router.navigateByUrl('/leads/'+this.mainmodulename);
              }
              else {
                this.toastService.presentToast(this.data.error.message);
              }
          }
          // else {
              // this.toastService.presentToast('Something Wrong');
          // }
        }, (err) => {
          console.log(err);
        });
    }

  }
  
}
