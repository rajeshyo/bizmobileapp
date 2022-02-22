(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["main"],{

/***/ 83696:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppRoutingModule": () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 13252);
/* harmony import */ var _guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./guard/auth.guard */ 10194);




const routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: 'login',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_login_login_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./login/login.module */ 69549)).then(m => m.LoginPageModule)
    },
    {
        path: 'home',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_home_home_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./home/home.module */ 28245)).then(m => m.HomePageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    // {
    //   path: '',
    //   loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
    // },
    {
        path: 'leads/:module',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_leads_leads_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./leads/leads.module */ 86764)).then(m => m.LeadsPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'leadform',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_leadform_leadform_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./leadform/leadform.module */ 38523)).then(m => m.LeadformPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'leadform/:id',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_leadform_leadform_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./leadform/leadform.module */ 38523)).then(m => m.LeadformPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'leadsdetails',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_leadsdetails_leadsdetails_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./leadsdetails/leadsdetails.module */ 89478)).then(m => m.LeadsdetailsPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'settings',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_settings_settings_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./settings/settings.module */ 82047)).then(m => m.SettingsPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'dashboard',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_dashboard_dashboard_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./dashboard/dashboard.module */ 26800)).then(m => m.DashboardPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'calender',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_calender_calender_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./calender/calender.module */ 19872)).then(m => m.CalenderPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'services',
        loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_services_services_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./services/services.module */ 18968)).then(m => m.ServicesPageModule), canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
    },
    {
        path: 'relation',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_relation_relation_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./relation/relation.module */ 31661)).then(m => m.RelationPageModule)
    },
    {
        path: 'relation/:id',
        loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_relation_relation_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./relation/relation.module */ 31661)).then(m => m.RelationPageModule)
    },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [
            _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forRoot(routes, { preloadingStrategy: _angular_router__WEBPACK_IMPORTED_MODULE_3__.PreloadAllModules })
        ],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })
], AppRoutingModule);



/***/ }),

/***/ 2050:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_app_component_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./app.component.html */ 75158);
/* harmony import */ var _app_component_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component.scss */ 30836);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/module/module.service */ 27254);
/* harmony import */ var _services_home_home_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/home/home.service */ 28843);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 13252);





// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

// import { HeaderService } from './services/header/header.service';



let AppComponent = class AppComponent {
    constructor(platform, router, alertCtrl, 
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    navCtrl, menuCtrl, loadingCtrl, homeService, moduleService) {
        this.platform = platform;
        this.router = router;
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.homeService = homeService;
        this.moduleService = moduleService;
        this.appPages = [
            {
                title: 'Dashboard',
                url: '/tabs/dashboard',
                icon: 'list-box'
            },
            {
                title: 'Calender',
                url: '/calender',
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
        this.menu = [
            {
                "menu": [
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
            {
                "menu": [
                    {
                        title: 'Potentials',
                        icon: 'aica_abc',
                        visible: 'true',
                        url: '/leads'
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
            {
                "menu": [
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
            {
                "menu": [
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
            {
                "menu": [
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
        ];
        this.initializeApp();
        // This is back button exit code
        this.platform.backButton.subscribe(() => {
            if (this.routerOutlet && this.routerOutlet.canGoBack()) {
                this.routerOutlet.pop();
            }
            else if (this.router.url === '/tabs/tab3') {
                navigator['app'].exitApp();
            }
            else {
                // this.presentAlertConfirm()
            }
        });
        // End
    }
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
        const id = '19x' + userid;
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Users',
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
            }
            else {
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
            url: loginData.url,
            username: loginData.username,
            password: loginData.password,
            session
        };
        this.homeService.getModuleList(getServiceData, options).subscribe(res => {
            this.data1 = res;
            if (this.data1.success === true) {
                console.log(this.data1.result.modules);
                this.modules = this.data1.result.modules;
                return this.modules;
            }
        }, (err) => {
            console.log(err);
        });
    }
    ;
    // testing purpose
    check() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            username: loginData.username,
            password: loginData.password,
            // operation: 'relatedRecordsWithGrouping',
            session
        };
        this.moduleService.getservicesListSync(getServiceData, options).subscribe(res => {
            this.data1 = res;
            if (this.data1.success === true) {
                console.log(this.data1.result.modules);
                this.modules = this.data1.result.modules;
                return this.modules;
            }
        }, (err) => {
            console.log(err);
        });
    }
    ;
    // end
    listlink(modulename) {
        this.router.navigate(['/leads/' + modulename]);
    }
    alogout() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            username: loginData.username,
            password: loginData.password,
            operation: 'logout',
            session
        };
        this.moduleService.getservicesListSync(getServiceData, options).subscribe(res => {
            this.data1 = res;
            if (this.data1.success === true) {
                console.log(this.data1.result.modules);
                this.modules = this.data1.result.modules;
                return this.modules;
            }
        }, (err) => {
            console.log(err);
        });
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
    }
    ;
    logout1() {
        localStorage.clear();
        this.navCtrl.navigateRoot('/login');
    }
    ;
};
AppComponent.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.Platform },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_5__.Router },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.AlertController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.LoadingController },
    { type: _services_home_home_service__WEBPACK_IMPORTED_MODULE_3__.HomeService },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService }
];
AppComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
        selector: 'app-root',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_app_component_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_app_component_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], AppComponent);



/***/ }),

/***/ 34750:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ 86219);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 13252);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 2050);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app-routing.module */ 83696);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services/module/module.service */ 27254);
/* harmony import */ var _services_home_home_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/home/home.service */ 28843);
/* harmony import */ var ngx_avatar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ngx-avatar */ 34276);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/platform-browser/animations */ 52650);












// import { HttpConfigInterceptor } from './httpConfig.interceptor';
let AppModule = class AppModule {
};
AppModule = (0,tslib__WEBPACK_IMPORTED_MODULE_4__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.NgModule)({
        declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
        entryComponents: [],
        imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__.BrowserModule, _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule.forRoot(), _app_routing_module__WEBPACK_IMPORTED_MODULE_1__.AppRoutingModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule, ngx_avatar__WEBPACK_IMPORTED_MODULE_9__.AvatarModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_10__.BrowserAnimationsModule,],
        providers: [{ provide: _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouteReuseStrategy, useClass: _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicRouteStrategy },
            _services_home_home_service__WEBPACK_IMPORTED_MODULE_3__.HomeService,
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
    })
], AppModule);



/***/ }),

/***/ 74344:
/*!*********************************!*\
  !*** ./src/app/auth.service.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthService": () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../environments/environment */ 18260);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 13252);





let AuthService = class AuthService {
    constructor(http, router) {
        this.http = http;
        this.router = router;
        this.validUser = false;
        // this.checkUser();
    }
    login() {
        // console.log('localStorage clear'); 
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseurl;
        const session = localStorage.getItem('session');
        var formdata = new FormData();
        formdata.append('_operation', 'loginAndFetchModules');
        formdata.append('_session', session);
        this.http.post(url, formdata, {})
            .toPromise()
            .then(response => {
            this.data = response;
            // console.log('check user', response);
        })
            .catch(console.log);
        localStorage.clear();
        this.router.navigateByUrl("/login");
    }
    getToken() {
        //console.log('checkUser',this.checkUser()); 
        return !!localStorage.getItem('session');
    }
};
AuthService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__.Router }
];
AuthService = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Injectable)({
        providedIn: 'root'
    })
], AuthService);



/***/ }),

/***/ 10194:
/*!*************************************!*\
  !*** ./src/app/guard/auth.guard.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AuthGuard": () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../auth.service */ 74344);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 13252);





let AuthGuard = class AuthGuard {
    constructor(authService, router, http) {
        this.authService = authService;
        this.router = router;
        this.http = http;
        this.validUser = false;
    }
    canActivate(route) {
        let authInfo = {
            authenticated: false
        };
        /*  if (localStorage.getItem("session") == null) {
           authInfo.authenticated = true;
           this.router.navigate(["signup"]);
           return false;
         }
         if (localStorage.getItem("session") != null) {
           authInfo.authenticated = false;
          
           //this.router.navigate(['dashboard']);
           return true;
         } */
        // console.log('before','logout');
        if (!this.authService.getToken()) {
            // console.log('auth','logout');
            this.authService.login();
            return false;
        }
        return true;
    }
};
AuthGuard.ctorParameters = () => [
    { type: _auth_service__WEBPACK_IMPORTED_MODULE_0__.AuthService },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_1__.Router },
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient }
];
AuthGuard = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.Injectable)({
        providedIn: "root"
    })
], AuthGuard);



/***/ }),

/***/ 28843:
/*!***********************************************!*\
  !*** ./src/app/services/home/home.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HomeService": () => (/* binding */ HomeService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 18252);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 85029);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 10592);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 18260);






let HomeService = class HomeService {
    constructor(http) {
        this.http = http;
    }
    // Error
    handleError(operation = 'operation', result) {
        return (error) => {
            console.error(error);
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(result);
        };
    }
    getModuleList(moduledata, options) {
        const formdata = new FormData();
        formdata.append('_operation', 'loginAndFetchModules');
        formdata.append('username', moduledata.username);
        formdata.append('password', moduledata.password);
        formdata.append('session', moduledata.session);
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseurl;
        // http://realestatedemo.biztechnosys.com/
        // http://beml.biztechnosys.com/
        // https://bizuiaccountingcrm.biztechnosys.com/
        // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, options).pipe(
        return this.http.post(url, formdata, options).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.tap)((logindata) => console.log(`moduledata`)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(this.handleError('module')));
    }
};
HomeService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient }
];
HomeService = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Injectable)({
        providedIn: 'root'
    })
], HomeService);



/***/ }),

/***/ 27254:
/*!***************************************************!*\
  !*** ./src/app/services/module/module.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ModuleService": () => (/* binding */ ModuleService)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 18252);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 85029);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 10592);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 18260);







let ModuleService = class ModuleService {
    constructor(http) {
        this.http = http;
    }
    callHeader() {
        const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpHeaders();
        headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        headers.append('Content-Type', 'Access-Control-Allow-Origin:*');
        return {
            headers
        };
    }
    // Error handle
    handleError(operation = 'operation', result) {
        return (error) => {
            console.error(error);
            return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.of)(result);
        };
    }
    getservicesListSync(moduledata, id = null) {
        // console.log('hihiihii');
        // console.log(id);
        const formdata = new FormData();
        formdata.append('_operation', moduledata.operation);
        formdata.append('_session', moduledata.session);
        formdata.append('module', moduledata.module);
        // formdata.append('record', '10x7925');
        // formdata.append('relatedmodule', 'Products');
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseurl;
        if (id != null) {
            formdata.append('record', id);
        }
        formdata.append('values', moduledata.values);
        // http://realestatedemo.biztechnosys.com/
        // http://beml.biztechnosys.com/
        https: //bizuiaccountingcrm.biztechnosys.com/
         
        // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, this.callHeader()).pipe(
        return this.http.post(url, formdata, this.callHeader()).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)((logindata) => console.log(`moduledata`)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(this.handleError('module')));
    }
    getModuleListRelation(moduledata, options) {
        const formdata = new FormData();
        formdata.append('_operation', moduledata.operation);
        // formdata.append('username', moduledata.username);
        // formdata.append('password', moduledata.password);
        formdata.append('_session', moduledata.session);
        formdata.append('record', moduledata.record);
        formdata.append('relatedmodule', moduledata.relatedmodule);
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseurl;
        // http://realestatedemo.biztechnosys.com/
        // http://beml.biztechnosys.com/
        // https://bizuiaccountingcrm.biztechnosys.com/
        // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, options).pipe(
        return this.http.post(url, formdata, options).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)((logindata) => console.log(`moduledata`)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(this.handleError('module')));
    }
    calender(moduledata, options) {
        const formdata = new FormData();
        formdata.append('_operation', moduledata.operation);
        formdata.append('_session', moduledata.session);
        formdata.append('module', moduledata.module);
        formdata.append('search_key', moduledata.search_key);
        formdata.append('search_value', moduledata.search_value);
        formdata.append('operator', moduledata.operator);
        let url = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.baseurl;
        // http://realestatedemo.biztechnosys.com/
        // http://beml.biztechnosys.com/
        // https://bizuiaccountingcrm.biztechnosys.com/
        // return this.http.post<any>(moduledata.url + '/modules/Mobile/api.php', formdata, options).pipe(
        return this.http.post(url, formdata, options).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)((logindata) => console.log(`moduledata`)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.catchError)(this.handleError('module')));
    }
};
ModuleService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient }
];
ModuleService = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Injectable)({
        providedIn: 'root'
    })
], ModuleService);



/***/ }),

/***/ 18260:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    /* baseurl:"https://3.110.88.179/justo/modules/Mobile/api.php",
    signupurl: "https://3.110.88.179/justo/modules/Webforms/capture.php", */
    /* baseurl:"https://account.biztechnosys.com/modules/Mobile/api.php",
    signupurl: "https://account.biztechnosys.com/modules/Webforms/capture.php", */
    baseurl: "https://bizuiaccountingcrm.biztechnosys.com/modules/Mobile/api.php",
    // signupurl: "https://justoapp.co.in/justo/modules/Webforms/capture.php",
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ 90271:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ 42577);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 34750);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 18260);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
(0,_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_3__.platformBrowserDynamic)().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule)
    .catch(err => console.log(err));


/***/ }),

/***/ 50863:
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/@ionic/core/dist/esm/ lazy ^\.\/.*\.entry\.js$ include: \.entry\.js$ exclude: \.system\.entry\.js$ namespace object ***!
  \******************************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./ion-accordion_2.entry.js": [
		83477,
		"node_modules_ionic_core_dist_esm_ion-accordion_2_entry_js"
	],
	"./ion-action-sheet.entry.js": [
		67196,
		"node_modules_ionic_core_dist_esm_ion-action-sheet_entry_js"
	],
	"./ion-alert.entry.js": [
		38081,
		"node_modules_ionic_core_dist_esm_ion-alert_entry_js"
	],
	"./ion-app_8.entry.js": [
		75017,
		"node_modules_ionic_core_dist_esm_ion-app_8_entry_js"
	],
	"./ion-avatar_3.entry.js": [
		69721,
		"node_modules_ionic_core_dist_esm_ion-avatar_3_entry_js"
	],
	"./ion-back-button.entry.js": [
		99216,
		"node_modules_ionic_core_dist_esm_ion-back-button_entry_js"
	],
	"./ion-backdrop.entry.js": [
		96612,
		"node_modules_ionic_core_dist_esm_ion-backdrop_entry_js"
	],
	"./ion-breadcrumb_2.entry.js": [
		42694,
		"common",
		"node_modules_ionic_core_dist_esm_ion-breadcrumb_2_entry_js"
	],
	"./ion-button_2.entry.js": [
		22938,
		"node_modules_ionic_core_dist_esm_ion-button_2_entry_js"
	],
	"./ion-card_5.entry.js": [
		51379,
		"node_modules_ionic_core_dist_esm_ion-card_5_entry_js"
	],
	"./ion-checkbox.entry.js": [
		97552,
		"node_modules_ionic_core_dist_esm_ion-checkbox_entry_js"
	],
	"./ion-chip.entry.js": [
		37218,
		"node_modules_ionic_core_dist_esm_ion-chip_entry_js"
	],
	"./ion-col_3.entry.js": [
		97479,
		"node_modules_ionic_core_dist_esm_ion-col_3_entry_js"
	],
	"./ion-datetime_3.entry.js": [
		64134,
		"common",
		"node_modules_ionic_core_dist_esm_ion-datetime_3_entry_js"
	],
	"./ion-fab_3.entry.js": [
		71439,
		"node_modules_ionic_core_dist_esm_ion-fab_3_entry_js"
	],
	"./ion-img.entry.js": [
		76397,
		"node_modules_ionic_core_dist_esm_ion-img_entry_js"
	],
	"./ion-infinite-scroll_2.entry.js": [
		33296,
		"node_modules_ionic_core_dist_esm_ion-infinite-scroll_2_entry_js"
	],
	"./ion-input.entry.js": [
		12413,
		"node_modules_ionic_core_dist_esm_ion-input_entry_js"
	],
	"./ion-item-option_3.entry.js": [
		39411,
		"node_modules_ionic_core_dist_esm_ion-item-option_3_entry_js"
	],
	"./ion-item_8.entry.js": [
		99133,
		"node_modules_ionic_core_dist_esm_ion-item_8_entry_js"
	],
	"./ion-loading.entry.js": [
		79003,
		"node_modules_ionic_core_dist_esm_ion-loading_entry_js"
	],
	"./ion-menu_3.entry.js": [
		96065,
		"node_modules_ionic_core_dist_esm_ion-menu_3_entry_js"
	],
	"./ion-modal.entry.js": [
		86991,
		"node_modules_ionic_core_dist_esm_ion-modal_entry_js"
	],
	"./ion-nav_2.entry.js": [
		82947,
		"node_modules_ionic_core_dist_esm_ion-nav_2_entry_js"
	],
	"./ion-picker-column-internal.entry.js": [
		25919,
		"node_modules_ionic_core_dist_esm_ion-picker-column-internal_entry_js"
	],
	"./ion-picker-internal.entry.js": [
		93109,
		"node_modules_ionic_core_dist_esm_ion-picker-internal_entry_js"
	],
	"./ion-popover.entry.js": [
		99459,
		"node_modules_ionic_core_dist_esm_ion-popover_entry_js"
	],
	"./ion-progress-bar.entry.js": [
		20301,
		"node_modules_ionic_core_dist_esm_ion-progress-bar_entry_js"
	],
	"./ion-radio_2.entry.js": [
		43799,
		"node_modules_ionic_core_dist_esm_ion-radio_2_entry_js"
	],
	"./ion-range.entry.js": [
		12140,
		"node_modules_ionic_core_dist_esm_ion-range_entry_js"
	],
	"./ion-refresher_2.entry.js": [
		86197,
		"common",
		"node_modules_ionic_core_dist_esm_ion-refresher_2_entry_js"
	],
	"./ion-reorder_2.entry.js": [
		41975,
		"node_modules_ionic_core_dist_esm_ion-reorder_2_entry_js"
	],
	"./ion-ripple-effect.entry.js": [
		58387,
		"node_modules_ionic_core_dist_esm_ion-ripple-effect_entry_js"
	],
	"./ion-route_4.entry.js": [
		98659,
		"node_modules_ionic_core_dist_esm_ion-route_4_entry_js"
	],
	"./ion-searchbar.entry.js": [
		26404,
		"node_modules_ionic_core_dist_esm_ion-searchbar_entry_js"
	],
	"./ion-segment_2.entry.js": [
		85253,
		"node_modules_ionic_core_dist_esm_ion-segment_2_entry_js"
	],
	"./ion-select_3.entry.js": [
		92619,
		"node_modules_ionic_core_dist_esm_ion-select_3_entry_js"
	],
	"./ion-slide_2.entry.js": [
		82871,
		"node_modules_ionic_core_dist_esm_ion-slide_2_entry_js"
	],
	"./ion-spinner.entry.js": [
		17668,
		"common",
		"node_modules_ionic_core_dist_esm_ion-spinner_entry_js"
	],
	"./ion-split-pane.entry.js": [
		55342,
		"node_modules_ionic_core_dist_esm_ion-split-pane_entry_js"
	],
	"./ion-tab-bar_2.entry.js": [
		174,
		"node_modules_ionic_core_dist_esm_ion-tab-bar_2_entry_js"
	],
	"./ion-tab_2.entry.js": [
		86185,
		"node_modules_ionic_core_dist_esm_ion-tab_2_entry_js"
	],
	"./ion-text.entry.js": [
		97337,
		"node_modules_ionic_core_dist_esm_ion-text_entry_js"
	],
	"./ion-textarea.entry.js": [
		4833,
		"node_modules_ionic_core_dist_esm_ion-textarea_entry_js"
	],
	"./ion-toast.entry.js": [
		9468,
		"node_modules_ionic_core_dist_esm_ion-toast_entry_js"
	],
	"./ion-toggle.entry.js": [
		25705,
		"node_modules_ionic_core_dist_esm_ion-toggle_entry_js"
	],
	"./ion-virtual-scroll.entry.js": [
		87463,
		"node_modules_ionic_core_dist_esm_ion-virtual-scroll_entry_js"
	]
};
function webpackAsyncContext(req) {
	if(!__webpack_require__.o(map, req)) {
		return Promise.resolve().then(() => {
			var e = new Error("Cannot find module '" + req + "'");
			e.code = 'MODULE_NOT_FOUND';
			throw e;
		});
	}

	var ids = map[req], id = ids[0];
	return Promise.all(ids.slice(1).map(__webpack_require__.e)).then(() => {
		return __webpack_require__(id);
	});
}
webpackAsyncContext.keys = () => (Object.keys(map));
webpackAsyncContext.id = 50863;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 75158:
/*!***************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/app.component.html ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-app>\r\n  <ion-split-pane contentId=\"main\">\r\n    <ion-menu contentId=\"main\" type=\"overlay\">\r\n        <ion-header >\r\n           <ion-toolbar color=\"primary\">\r\n              <div class=\"user\" *ngIf=\"moduledata\">\r\n                 <ngx-avatar size=\"50\" [round]=\"true\" class=\"my-avatar\" [name]=\" moduledata.first_name.charAt(0).toUpperCase()\"></ngx-avatar>\r\n                 <ion-title >{{ moduledata.first_name}} {{ moduledata.last_name}}\r\n                 </ion-title>\r\n              </div>\r\n           </ion-toolbar>\r\n        </ion-header>\r\n        <!--Rajesh Saha-->\r\n        <ion-content>\r\n           <div class=\"nav\" >\r\n              <input type=\"checkbox\" id=\"menu\" />\r\n              <label for=\"menu\" id=\"nav-icon\"></label>\r\n              <div class=\"multi-level\" >\r\n                 <ion-menu-toggle auto-hide=\"false\">\r\n                    <a routerLink=\"/home\" class=\"menulink\">\r\n                       <div class=\"item\">\r\n                          <input type=\"checkbox\" id=\"C\"/>\r\n                          <img src=\"../assets/img/Arrow.png\" class=\"arrow\"><label for=\"C\">Home</label>                   \r\n                          <!-- <ul>\r\n                             <li><a href=\"#\">Our Team</a></li>\r\n                             <li><a href=\"#\">Clients</a></li>  \r\n                             <li><a href=\"#\">Our Work</a></li>\r\n                             </ul> -->\r\n                       </div>\r\n                    </a>\r\n                    <a routerLink=\"/dashboard\" class=\"menulink\">\r\n                       <div class=\"item\">\r\n                          <input type=\"checkbox\" id=\"d\"/>\r\n                          <img src=\"../assets/img/Arrow.png\" class=\"arrow\"><label for=\"d\">Dashboard</label>                   \r\n                       </div>\r\n                    </a>\r\n                    <a routerLink=\"/calender\" class=\"menulink\">\r\n                     <div class=\"item\">\r\n                        <input type=\"checkbox\" id=\"d\"/>\r\n                        <img src=\"../assets/img/Arrow.png\" class=\"arrow\"><label for=\"d\">Calender</label>                   \r\n                     </div>\r\n                  </a>\r\n                    <!-- <a routerLink=\"/tabs/calender\"class=\"menulink\">\r\n                       <div class=\"item\">\r\n                          <input type=\"checkbox\" id=\"d\"/>\r\n                          <img src=\"../assets/img/Arrow.png\" class=\"arrow\"><label for=\"d\">Calender</label>                   \r\n                       </div>\r\n                    </a> -->\r\n                 </ion-menu-toggle>\r\n                 <div class=\"item\" *ngFor=\"let p of menu; let i = index\">\r\n                    <input type=\"checkbox\" id=\"{{i}}\"/>\r\n                    <img src=\"../assets/img/Arrow.png\" class=\"arrow\" ><label for=\"{{i}}\">{{p.menuname |titlecase}}</label>\r\n                    <ul *ngFor=\"let items of p.menu\">\r\n                       <ion-menu-toggle auto-hide=\"false\">\r\n                          <label *ngFor=\"let md of modules\">\r\n                          <li [routerDirection]=\"'root'\" [routerLink]=\"['/leads/'+md.name]\" *ngIf=\"md.name == items.title\">\r\n                          <img src=\"../assets/img/setting/leftarrow.png\" style=\"height: 20px;margin-left: 50px;\">\r\n                          <a href=\"#\">{{items.title}}</a>\r\n                          </li>\r\n                          </label>  \r\n                       </ion-menu-toggle>\r\n                    </ul>\r\n                 </div>\r\n                 <ion-menu-toggle auto-hide=\"false\">\r\n                    <!-- <a routerLink=\"/settings\"class=\"menulink\">\r\n                       <div class=\"item\">\r\n                          <input type=\"checkbox\" id=\"d\"/>\r\n                          <img src=\"../assets/img/Arrow.png\" class=\"arrow\"><label for=\"d\">Settings</label>                   \r\n                       </div>\r\n                    </a> -->\r\n                 </ion-menu-toggle>\r\n              </div>\r\n           </div>\r\n           <ion-fab vertical=\"bottom\" class=\"addbutton\" horizontal=\"end\" slot=\"fixed\">\r\n              <ion-button icon-left (click)=\"alogout()\" expand=\"full\" color=\"danger\"  tappable>\r\n                 <ion-icon name=\"log-out\"></ion-icon>\r\n              </ion-button>\r\n           </ion-fab>\r\n      \r\n        </ion-content>\r\n        <!--Rajesh Saha-->\r\n     </ion-menu>\r\n     <ion-router-outlet id=\"main\"></ion-router-outlet>\r\n  </ion-split-pane>\r\n</ion-app>");

/***/ }),

/***/ 30836:
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = ".menulink {\n  text-decoration: none;\n  color: inherit;\n}\n\n.user {\n  display: inline-flex;\n  padding: 10px;\n}\n\n.leftarrow {\n  float: left;\n  height: 20px;\n}\n\n.img {\n  width: 50px;\n  height: 50px;\n  margin-top: 8px;\n  border: 2px;\n  background-color: aquamarine;\n  border-radius: 70px;\n  font-size: 50px;\n}\n\n.addbutton {\n  position: fixed !important;\n}\n\n:host {\n  --width:262px;\n}\n\n.text {\n  margin-left: 15px;\n}\n\n/*Func*/\n\n.item ul, .nav input[type=checkbox] {\n  display: none;\n}\n\n#menu:checked ~ .multi-level, .item input:checked ~ ul {\n  display: block;\n}\n\n/*Arrow*/\n\n.arrow {\n  width: 12px;\n  height: 12px;\n  vertical-align: middle;\n  float: left;\n  z-index: 0;\n  margin: 17px 1em 0 2em;\n  color: black;\n}\n\n.item input + .arrow {\n  transform: rotate(-90deg);\n  transition: 0.1s;\n}\n\n.item input:checked + .arrow {\n  transform: rotate(0deg);\n  transition: 0.1s;\n}\n\n/*Styles*/\n\nlabel:hover {\n  cursor: pointer;\n}\n\nlabel {\n  width: 100%;\n  display: block;\n  z-index: 3;\n  position: relative;\n}\n\n.nav {\n  width: 100%;\n  overflow-x: hidden;\n  border-bottom: 1px solid #CFD8DC;\n}\n\n#nav-icon {\n  font-size: 28px;\n  line-height: 50px;\n  padding-left: 1em;\n  color: white;\n  margin-top: 50px;\n}\n\n.nav ul, .nav li, label {\n  line-height: 50px;\n  margin: 0;\n  padding: 0 0.5em;\n  list-style: none;\n  text-decoration: none;\n  font-weight: 100;\n  width: 100%;\n}\n\n.item ul {\n  padding: 0 0.25em;\n}\n\n.nav li a {\n  line-height: 50px;\n  margin: 0;\n  list-style: none;\n  text-decoration: none;\n  font-weight: 100;\n}\n\n.center {\n  margin: auto;\n  width: 30%;\n  padding: 10px;\n  height: 10%;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLHFCQUFBO0VBQ0EsY0FBQTtBQUNGOztBQUNBO0VBQ0Msb0JBQUE7RUFDQSxhQUFBO0FBRUQ7O0FBQUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtBQUdGOztBQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUNBLDRCQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBR0E7O0FBTUE7RUFDRSwwQkFBQTtBQUhGOztBQUtBO0VBQU0sYUFBQTtBQUROOztBQUdBO0VBQ0EsaUJBQUE7QUFBQTs7QUFNQSxPQUFBOztBQUVBO0VBQ0UsYUFBQTtBQUpGOztBQU1BO0VBQ0UsY0FBQTtBQUhGOztBQU1BLFFBQUE7O0FBRUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLHNCQUFBO0VBQ0EsV0FBQTtFQUNBLFVBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7QUFKRjs7QUFNQTtFQUNFLHlCQUFBO0VBQ0EsZ0JBQUE7QUFIRjs7QUFLQTtFQUNFLHVCQUFBO0VBQ0EsZ0JBQUE7QUFGRjs7QUFPQSxTQUFBOztBQUVBO0VBQ0UsZUFBQTtBQUxGOztBQU9BO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxVQUFBO0VBQ0Esa0JBQUE7QUFKRjs7QUFNQTtFQUNFLFdBQUE7RUFFQSxrQkFBQTtFQUNBLGdDQUFBO0FBSkY7O0FBT0E7RUFDRSxlQUFBO0VBQ0EsaUJBQUE7RUFDQSxpQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtBQUpGOztBQVFBO0VBQ0UsaUJBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLHFCQUFBO0VBRUEsZ0JBQUE7RUFDQSxXQUFBO0FBTkY7O0FBUUE7RUFDRSxpQkFBQTtBQUxGOztBQU9BO0VBQ0UsaUJBQUE7RUFDQSxTQUFBO0VBRUEsZ0JBQUE7RUFDQSxxQkFBQTtFQUVBLGdCQUFBO0FBTkY7O0FBV0E7RUFDQSxZQUFBO0VBQ0EsVUFBQTtFQUVBLGFBQUE7RUFDQSxXQUFBO0FBVEEiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1lbnVsaW5re1xyXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTsgXHJcbiAgY29sb3I6IGluaGVyaXQ7XHJcbn1cclxuLnVzZXJ7XHJcbiBkaXNwbGF5OmlubGluZS1mbGV4O1xyXG4gcGFkZGluZzoxMHB4OyBcclxufVxyXG4ubGVmdGFycm93e1xyXG4gIGZsb2F0OiBsZWZ0O1xyXG4gIGhlaWdodDogMjBweDtcclxufVxyXG5cclxuLmltZ3tcclxud2lkdGg6IDUwcHg7XHJcbmhlaWdodDogNTBweDtcclxubWFyZ2luLXRvcDogOHB4O1xyXG5ib3JkZXI6IDJweDtcclxuYmFja2dyb3VuZC1jb2xvcjogYXF1YW1hcmluZTtcclxuYm9yZGVyLXJhZGl1czogNzBweDtcclxuZm9udC1zaXplOiA1MHB4O1xyXG5cclxufVxyXG4vLyBpb24tY29udGVudCB7XHJcbi8vICAgIC0tYmFja2dyb3VuZDogdXJsKCcuLi9hc3NldHMvaW1nL2JnLnBuZycpO1xyXG4vLyAgICAgLy8gYmFja2dyb3VuZC1jb2xvcjojRkYyNTJDO1xyXG4vLyAgICAgLS1iYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xyXG4vLyAgICAgLS1iYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJTtcclxuLy8gfVxyXG4uYWRkYnV0dG9ue1xyXG4gIHBvc2l0aW9uOiBmaXhlZCAhaW1wb3J0YW50O1xyXG59XHJcbjpob3N0ey0td2lkdGg6MjYycHg7fVxyXG5cclxuLnRleHR7XHJcbm1hcmdpbi1sZWZ0OiAxNXB4O1xyXG59XHJcblxyXG5cclxuXHJcblxyXG4vKkZ1bmMqL1xyXG5cclxuLml0ZW0gdWwsIC5uYXYgaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdIHtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcbiNtZW51OmNoZWNrZWQgfiAubXVsdGktbGV2ZWwsIC5pdGVtIGlucHV0OmNoZWNrZWQgfiB1bCB7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbn1cclxuXHJcbi8qQXJyb3cqL1xyXG5cclxuLmFycm93IHtcclxuICB3aWR0aDogMTJweDtcclxuICBoZWlnaHQ6IDEycHg7XHJcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcclxuICBmbG9hdDogbGVmdDtcclxuICB6LWluZGV4OiAwO1xyXG4gIG1hcmdpbjogMTdweCAxZW0gMCAyZW07XHJcbiAgY29sb3I6YmxhY2s7XHJcbn1cclxuLml0ZW0gaW5wdXQgKyAuYXJyb3cge1xyXG4gIHRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7XHJcbiAgdHJhbnNpdGlvbjogMC4xcztcclxufVxyXG4uaXRlbSBpbnB1dDpjaGVja2VkICsgLmFycm93IHtcclxuICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcclxuICB0cmFuc2l0aW9uOiAwLjFzO1xyXG59XHJcblxyXG5cclxuXHJcbi8qU3R5bGVzKi9cclxuXHJcbmxhYmVsOmhvdmVyIHtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxubGFiZWwge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIHotaW5kZXg6IDM7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcbi5uYXYge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIC8vIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gIG92ZXJmbG93LXg6IGhpZGRlbjtcclxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI0NGRDhEQztcclxufVxyXG5cclxuI25hdi1pY29uIHtcclxuICBmb250LXNpemU6IDI4cHg7XHJcbiAgbGluZS1oZWlnaHQ6IDUwcHg7XHJcbiAgcGFkZGluZy1sZWZ0OiAxZW07XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIG1hcmdpbi10b3A6IDUwcHg7XHJcbiAgLy8gYmFja2dyb3VuZC1jb2xvcjogI0Y0NDMzNjtcclxufVxyXG5cclxuLm5hdiB1bCwgLm5hdiBsaSwgbGFiZWwge1xyXG4gIGxpbmUtaGVpZ2h0OiA1MHB4O1xyXG4gIG1hcmdpbjogMDtcclxuICBwYWRkaW5nOiAwIDAuNWVtO1xyXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gIC8vIGNvbG9yOiAjOTBBNEFFO1xyXG4gIGZvbnQtd2VpZ2h0OiAxMDA7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuLml0ZW0gdWwge1xyXG4gIHBhZGRpbmc6IDAgMC4yNWVtO1xyXG59XHJcbi5uYXYgbGkgYSB7XHJcbiAgbGluZS1oZWlnaHQ6IDUwcHg7XHJcbiAgbWFyZ2luOiAwO1xyXG4gIC8vIHBhZGRpbmc6IDAgNGVtO1xyXG4gIGxpc3Qtc3R5bGU6IG5vbmU7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG4gIC8vIGNvbG9yOiAjOTBBNEFFO1xyXG4gIGZvbnQtd2VpZ2h0OiAxMDA7XHJcbn1cclxuXHJcblxyXG5cclxuLmNlbnRlciB7XHJcbm1hcmdpbjogYXV0bztcclxud2lkdGg6IDMwJTtcclxuLy8gICBib3JkZXI6IDNweCBzb2xpZCBncmVlbjtcclxucGFkZGluZzogMTBweDtcclxuaGVpZ2h0OjEwJTtcclxufVxyXG5cclxuXHJcblxyXG5cclxuIl19 */";

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(90271)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map