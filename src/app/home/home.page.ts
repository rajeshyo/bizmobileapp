import { Component, OnInit } from '@angular/core';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { HomeService } from '../services/home/home.service';
// import { HeaderService } from '../services/header/header.service';
import { Router } from '@angular/router';
import { ModuleService } from '../services/module/module.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

 
  data: any;

  modules: [];
  moduledata :[];
  showSpinner: boolean = true;
  public allmodulename = [

    {
      title: 'Campaigns',
      icon: 'aica_campaigns'
    },
    {
      title: 'Vendors',
      icon: 'aica_vendors'
    },
    {
      title: 'Documents',
      icon: 'aica_documents'
    },
    {
      title: 'Faq',
      icon: 'aica_faq'
    },
      {
      title: 'HelpDesk',
      icon: 'aica_helpdesk'
    },
    {
      title: 'PriceBooks',
      icon: 'aica_pricebook'
    },
    {
      title: 'Invoice',
      icon: 'aica_invoices'
    },
    {
      title: 'Products',
      icon: 'aica_products'
    },
    {
      title: 'Project',
      icon: 'aica_project'
    },
    {
      title: 'PurchaseOrder',
      icon: 'aica_purchaseorder'
    },
    {
      title: 'Quotes',
      icon: 'aica_quotes'
    },
    {
      title: 'SalesOrder',
      icon: 'aica_salesorder'
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts'
    },
    {
      title: 'Calendar',
      icon: 'aica_calender'
    },
    {
      title: 'Leads',
      icon: 'Leads'
    },
    {
      title: 'Accounts',
      icon: 'Accounts'
    },
    {
      title: 'Potentials',
      icon: 'aica_abc'
    },
    {
      title: 'PBXManager',
      icon: 'aica_pbxmanager'
    },
    {
      title: 'ServiceContracts',
      icon: 'aica_servicescontacts'
    },
    {
      title: 'Services',
      icon: 'aica_services'
    },
    {
      title: 'ProjectMilestone',
      icon: 'aica_projectmilestone'
    },
    {
      title: 'ProjectTask',
      icon: 'aica_projecttasks'
    },
    {
      title: 'Comments',
      icon: 'aica_modcomments'
    },
    {
      title: 'Assets',
      icon: 'aica_assets'
    },
    {
      title: 'SMSNotifier',
      icon: 'aica_smsnotifier'
    },
    {
      title: 'CustomLogin',
      icon: 'aica_customlogin'
    },
    {
      title: 'Payment',
      icon: 'aica_payment'
    },
      {
      title: 'Emails',
      icon: 'aica_emails'
    },
  ];
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private homeService: HomeService,
    // private headerservice: HeaderService,
    private router: Router,
    private moduleService: ModuleService,
  ) {
 }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {

    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');

    const options = this.moduleService.callHeader();
    const modulename:any = JSON.parse(localStorage.getItem('modulesname'));
 
    const getServiceData = {
      url : loginData.url,
      username : loginData.username,
      password : loginData.password,
      session
    };

    this.homeService.getModuleList(getServiceData, options).subscribe(res => {
      this.data = res;
      this.showSpinner = false;
      if (this.data.success === true ) {
        // console.log(this.data.result.modules);
        this.modules = this.data.result.modules;
        localStorage.setItem('modulesname', JSON.stringify(this.modules));

        return this.modules;

      }
    }, (err) => {
       console.log(err);
    });

    const record = '19x1'; 
    const getServiceData1 = {
        url: loginData.url,
        session,
        module : 'Users',
        // record : '19x1',
        operation: 'fetchRecord'
      };
    this.moduleService.getservicesListSync(getServiceData1, record).subscribe(res => {
    this.data = res;
    // console.log(this.data);
    if (this.data.success === true) {
          this.moduledata = this.data.result.record;
          if (this.moduledata !== null) {
            // console.log('dadad');
            // console.log(this.moduledata);

            return this.moduledata;
          }
        } else {
          console.log(this.data.result.error);
        }
      }, (err) => {
        console.log(err);
      });
  }
  redirect(pagename: string) {
    this.router.navigate(['/' + pagename.replace(/\s/g, '')]);
    console.log("routerlinkname",pagename.charAt(0).toUpperCase() + pagename.slice(1))
  }

  formlink(modulename: string,moduleid: string,){
  
    this.router.navigate(['/leads/'+modulename]);
    
  }
  formlink1(modulename: string,moduleid: string,){
    this.router.navigateByUrl('/leads?modulename='+modulename+'&id='+moduleid);
  }

}
