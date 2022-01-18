import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
// import { HeaderService } from './services/header/header.service';
import { ModuleService } from './services/module/module.service';
import { HomeService } from './services/home/home.service';
// import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';
import { IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
  routerOutlet: any;
  constructor(
    private platform: Platform,
    private router: Router,
    private alertCtrl: AlertController,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private homeService: HomeService,
    private moduleService: ModuleService,
    // private headerservice: HeaderService,
    // private push: Push,
  ) {
    this.initializeApp();

    // This is back button exit code
    this.platform.backButton.subscribe(() => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } else if (this.router.url === '/tabs/tab3') {
        navigator['app'].exitApp()
      } else {
        // this.presentAlertConfirm()
      }
    });
    // End
  }
  
  public appPages = [
    {
      title: 'Dashboard',
      url: '/tabs/dashboard',
      icon: 'list-box'
    },
    {
      title: 'All Module',
      url: '/tabs/home',
      icon: 'home'
    },
    {
      title: 'Settings',
      url: '/tabs/settings',
      icon: 'settings'
    },
    // {
    //   title: 'Logout',
    //   url: '/login',
    //   icon: 'log-out'
    // },
    // {
    //   title: 'Campaigns',
    //   url: '/campaigns',
    //   icon: 'albums'
    // },
    // {
    //   title: 'Vendors',
    //   url: '/vendors',
    //   icon: 'people'
    // },
    // {
    //   title: 'FAQ',
    //   url: '/faq',
    //   icon: 'help'
    // },
    // {
    //   title: 'Price Books',
    //   url: '/pricebooks',
    //   icon: 'pricetags'
    // },
    // {
    //   title: 'Invoice',
    //   url: '/invoices',
    //   icon: 'ios-clipboard'
    // },
    // {
    //   title: 'Products',
    //   url: '/products',
    //   icon: 'ios-cube'
    // },
    // {
    //   title: 'Projects',
    //   url: '/projects',
    //   icon: 'ios-albums'
    // },
    // {
    //   title: 'Tickets',
    //   url: '/tickets',
    //   icon: 'ios-map'
    // },
    // {
    //   title: 'Purchase Order',
    //   url: '/purchaseorders',
    //   icon: 'ios-bookmark'
    // },
    // {
    //   title: 'Sales Order',
    //   url: '/salesorders',
    //   icon: 'ios-pulse'
    // },
    // {
    //   title: 'Contacts',
    //   url: '/contacts',
    //   icon: 'book'
    // },
    // {
    //   title: 'Calendar',
    //   url: '/calendar',
    //   icon: 'calendar'
    // },
    // {
    //   title: 'Leads',
    //   url: '/leads',
    //   icon: 'people'
    // },
    // {
    //   title: 'Accounts',
    //   url: '/organizations',
    //   icon: 'calculator'
    // },
    // {
    //   title: 'Events',
    //   url: '/events',
    //   icon: 'logo-buffer'
    // },
    // {
    //   title: 'Tasks',
    //   url: '/tasks',
    //   icon: 'bookmarks'
    // },
    // {
    //   title: 'Opportunities',
    //   url: '/opportunities',
    //   icon: 'card'
    // },
    // {
    //   title: 'Deals',
    //   url: '/deals',
    //   icon: 'contact'
    // },
    // {
    //   title: 'Contact Us',
    //   url: '/contactus',
    //   icon: 'contacts'
    // },
    // {
    //   title: 'Profile',
    //   url: '/profile',
    //   icon: 'contact'
    // },
    // {
    //   title: 'Settings',
    //   url: '/settings',
    //   icon: 'settings'
    // },


  ];
  menu=[
    
{"menu":
         [

           {
      title: 'Campaigns',
      icon: 'aica_campaigns',
      visible: 'true',
      url: '/leads',
    },
    {
      title: 'Leads',
      icon: 'aica_leads',
      visible: 'true',
      url: '/leads',
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Accounts',
      icon: 'aica_accounts',
      visible: 'true',
      url: '/leads'
    }
         ],
    visible: 'true',
    icon: 'aica_campaigns',
    menuname: 'marketing',
},
{"menu":
[
    {
      title: 'Potentials',
      icon: 'aica_abc',
      visible: 'true',
      url:'/leads'
    },
    {
      title: 'Quotes',
      icon: 'aica_quotes',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Products',
      icon: 'aica_products',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Services',
      icon: 'aica_services',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'SMSNotifier',
      icon: 'aica_smsnotifier',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Accounts',
      icon: 'aica_accounts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Payment',
      icon: 'aica_payment',
      visible: 'true',
      url: '/leads'
    }
],
 visible: 'true',
 icon: 'aica_campaigns',
 menuname: 'sales',
},
{"menu":
[
{
      title: 'Products',
      icon: 'aica_products',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Services',
      icon: 'aica_services',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'PriceBooks',
      icon: 'aica_pricebook',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Invoice',
      icon: 'aica_invoices',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'PurchaseOrder',
      icon: 'aica_purchaseorder',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'SalesOrder',
      icon: 'aica_salesorder',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Vendors',
      icon: 'aica_vendors',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Accounts',
      icon: 'aica_accounts',
      visible: 'true',
      url: '/leads'
    }
],
 visible: 'true',
 icon: 'aica_campaigns',
 menuname: 'inventory',
},
{"menu":
[
{
      title: 'HelpDesk',
      icon: 'aica_helpdesk',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'FAQ',
      icon: 'aica_faq',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'ServiceContracts',
      icon: 'aica_servicescontacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Assets',
      icon: 'aica_assets',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'SMSNotifier',
      icon: 'aica_smsnotifier',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Accounts',
      icon: 'aica_accounts',
      visible: 'true',
      url: '/leads'
    }
],
 visible: 'true',
 icon: 'aica_campaigns',
 menuname: 'support',
},
{"menu": 
[
{
      title: 'Project',
      icon: 'aica_project',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'ProjectMilestone',
      icon: 'aica_projectmilestone',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'ProjectTask',
      icon: 'aica_projecttasks',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Contacts',
      icon: 'aica_contacts',
      visible: 'true',
      url: '/leads'
    },
    {
      title: 'Accounts',
      icon: 'aica_accounts',
      visible: 'true',
      url: '/leads'
    }
],
 visible: 'true',
 icon: 'aica_campaigns',
 menuname: 'projects',
},
// {"menu":
// [
// {
//       title: 'Emails',
//       icon: 'aica_emails',
//       visible: 'true',
        //  url: '/emails'
//     },
//     {
//       title: 'PBXManager',
//       icon: 'aica_pbxmanager',
//       visible: 'true',
        //  url: '/pbxmanager'
//     }
  

// ],
//  visible: 'true',
//  icon: 'aica_campaigns',
//  menuname: 'tools',
// }

// {"menu":
//          [],
//     visible: 'true',
//     icon: 'aica_campaigns',
//     menuname: 'Setting',
    
// },
]
  login: [];

    data: any;
    data1:any;
    moduledata: [];
    modules:[];
  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      // this.pushSetup();
      // this.statusBar.hide();
    });
  }

  // push notification
//  pushSetup(){
    
//     const options: PushOptions = {
      
//    android: {
//      senderID: '1037698380481'
//    },
//    ios: {
//        alert: 'true',
//        badge: true,
//        sound: 'false'
//    }
// };

// const pushObject: PushObject = this.push.init(options);


// pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

// pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

// pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

//   }
    // tslint:disable-next-line: use-life-cycle-interface
    ngOnInit() {

    console.log('dataewrew');

    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');
    const userid = localStorage.getItem('userid');
    console.log(userid);
    const options = this.moduleService.callHeader();
    const id= '19x'+userid;
    const getServiceData = {
      
        url: loginData.url,
        session,
        module : 'Users',
        // record : id,
        operation: 'fetchRecord'
      };
    this.moduleService.getservicesListSync(getServiceData, id).subscribe(res => {
    this.data = res;
    console.log(this.data);
    if (this.data.success === true) {
          this.moduledata = this.data.result.record;
          if (this.moduledata !== null) {
            return this.moduledata;
          }
        } else {
          console.log(this.data.result.error);
        }
      }, (err) => {
        console.log(err);
      });

    this.allmoduleList();
    }

allmoduleList() {
    const loginData = JSON.parse(localStorage.getItem('logindata'));
    const session = localStorage.getItem('session');

    const options = this.moduleService.callHeader();
    const getServiceData = {
      url : loginData.url,
      username : loginData.username,
      password : loginData.password,
      session
    };
    this.homeService.getModuleList(getServiceData, options).subscribe(res => {
      this.data1 = res;
      if (this.data1.success === true ) {
        console.log(this.data1.result.modules);
        this.modules = this.data1.result.modules;
        return this.modules;
      }
    }, (err) => {
       console.log(err);
    });
  };

  listlink(modulename: string){
  
    this.router.navigate(['/leads/'+modulename]);
    
  }
  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/login');
  };

// This is back button exit code
//  async presentAlertConfirm() {
//     const alert = await this.alertCtrl.create({
//       header: 'Confirm!',
//       message: 'Do you want to exit the app?',
//       buttons: [
//         {
//           text: 'Cancel',
//           handler: () => {
//             console.log('Confirm Cancel');
//           }
//         }, {
//           text: 'Okay',
//           handler: () => {
//             console.log('Confirm Okay');
//             navigator['app'].exitApp()
//           }
//         }
//       ]
//     });

//     await alert.present();
//   }
  // end
}
