import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
// import { ItemSliding } from 'ionic-angular';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

 
  // constructor() { }

  data: any;
  modules = [];
  id: any;
  showSpinner: boolean = true;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
    // private headerservice: HeaderService,
    private toastService: ToastService,
  ) { }

  ngOnInit() {
    this.leadsList();
    // this.leadsdeleteList();
  }

  leadsList() {
      const loginData = JSON.parse(localStorage.getItem('logindata'));
      const session = localStorage.getItem('session');
      const options = this.moduleService.callHeader();
      const getServiceData = {
        url : loginData.url,
        session,
        module : 'Services',
        operation: 'syncModuleRecords'
      };

      this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
        this.data = res;
        this.showSpinner = false;
        console.log('TestData');
        console.log(this.data);
        if (this.data.success === true) {
          if (this.data.result !== null) {
            console.log('XXXX');
            this.modules = this.data.result.sync.updated;
            console.log(this.modules);
            return this.modules;
          }
        } else {
          console.log(this.data.result.error);
        }
      }, (err) => {
        console.log(err);
      });
  }
  servicesdeleteList(id) {

      const loginData = JSON.parse(localStorage.getItem('logindata'));
      const session = localStorage.getItem('session');
       // const id = localStorage.getItem('id');
       const id1= id.split('x')[1];
      const options = this.moduleService.callHeader();
      const getServiceData = {
        url : loginData.url,
        session,
        module : 'Services',
        // id: id.split('x')[1],
        operation: 'deleteRecords'
      };

      console.log(getServiceData);
      this.moduleService.getservicesListSync(getServiceData, id1).subscribe(res => {
      //  this.router.navigate(['/leads']);

      this.toastService.presentToast('Delete Successful');
      // location.reload();
      console.log('hgvhvhv');
      console.log(this.id);
      }, (err) => {
      });
  }
refresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
        console.log('Async operation has ended');
        this.leadsList();
    }, 50);
}

  // getrecordDetail(id) {
  //     alert(id);
  // }

   // This is sliding closing function
  //  slidingclose(slidingItem: ItemSliding) {
  //   slidingItem.close();
  // }
}
