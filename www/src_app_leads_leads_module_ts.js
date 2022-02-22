"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_leads_leads_module_ts"],{

/***/ 86764:
/*!***************************************!*\
  !*** ./src/app/leads/leads.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadsPageModule": () => (/* binding */ LeadsPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 28267);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 18346);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 13252);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/header/header.service */ 36203);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _leads_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./leads.page */ 41080);










const routes = [
    {
        path: '',
        component: _leads_page__WEBPACK_IMPORTED_MODULE_2__.LeadsPage
    }
];
let LeadsPageModule = class LeadsPageModule {
};
LeadsPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes)
        ],
        declarations: [_leads_page__WEBPACK_IMPORTED_MODULE_2__.LeadsPage],
        providers: [
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__.ModuleService,
            _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__.HeaderService
        ]
    })
], LeadsPageModule);



/***/ }),

/***/ 41080:
/*!*************************************!*\
  !*** ./src/app/leads/leads.page.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadsPage": () => (/* binding */ LeadsPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leads_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./leads.page.html */ 35534);
/* harmony import */ var _leads_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./leads.page.scss */ 82629);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/toast/toast.service */ 19179);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 13252);






// import { HeaderService } from '../services/header/header.service';

// import { ItemSliding } from 'ionic-angular';


let LeadsPage = class LeadsPage {
    constructor(activatedRoute, navCtrl, menuCtrl, loadingCtrl, moduleService, router, 
    // private headerservice: HeaderService,
    toastService) {
        this.activatedRoute = activatedRoute;
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.moduleService = moduleService;
        this.router = router;
        this.toastService = toastService;
        this.modules = [];
        this.recordsdata = [];
        this.showSpinner = true;
        this.searchTerm = "";
        this.modulename = this.activatedRoute.snapshot.paramMap.get('module');
        // this.modulename =this.activatedRoute.snapshot.queryParamMap.get('modulename')
        // this.moduleid =this.activatedRoute.snapshot.queryParamMap.get('id')
        this.generateTopics();
    }
    ngOnInit() {
        this.leadsList();
        // this.leadsdeleteList();
        // console.log("mymname",this.modulename);
        // console.log("myid",this.moduleid);
    }
    go(modulename, moduleid) {
        const sampleid = "989809809";
        const name = "rajesh";
        this.router.navigateByUrl('leadsdetails?id=' + moduleid + '&name=' + modulename);
    }
    form(modulename, moduleid) {
        this.router.navigateByUrl('leadform?name=' + modulename);
    }
    formedit(modulename, moduleid) {
        this.router.navigateByUrl('leadform?id=' + moduleid + '&name=' + modulename);
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
                    // console.log(this.modules);
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
                    let headers = this.modules;
                    return this.modules;
                }
            }
            else {
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
    getTopics(ev) {
        // console.log('TESTDFDSF');
        // console.log(this.topics);
        // console.log('xxxxxxx');
        //  console.log(this.modules);
        var blocks;
        //  var fields: string[];
        this.generateTopics();
        let serVal = ev.target.value;
        if (serVal && serVal.trim() != '') {
            this.modules = this.modules.filter((modules) => {
                // console.log(this.topics);
                return (modules);
            });
        }
    }
};
LeadsPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.LoadingController },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.Router },
    { type: _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__.ToastService }
];
LeadsPage = (0,tslib__WEBPACK_IMPORTED_MODULE_6__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_7__.Component)({
        selector: 'app-leads',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leads_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_leads_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], LeadsPage);



/***/ }),

/***/ 35534:
/*!******************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/leads/leads.page.html ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n     <ion-buttons slot=\"start\">\r\n        <ion-menu-button></ion-menu-button>\r\n     </ion-buttons>\r\n     <ion-title>\r\n        <!-- Listing All Data -->\r\n        {{modulename}} All Data\r\n        <ion-icon name=\"refresh\" (click)=\"refresh($event)\" float-right></ion-icon>\r\n     </ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n<!--Rajesh Saha-->\r\n<br>\r\n<ion-content *ngFor=\"let record of recordsdata;let i = index\">\r\n  <!-- <ion-searchbar (ionInput)=\"getTopics($event)\"></ion-searchbar> -->\r\n  <!-- <ion-searchbar [(ngModel)]=\"searchTerm\" (ionInput)=\"setFilteredItems()\"></ion-searchbar> -->\r\n  <ion-spinner  *ngIf=\"showSpinner\" color=\"primary\" name=\"lines\" class=\"addbutton\" ></ion-spinner>\r\n  <ion-fab vertical=\"bottom\" class=\"addbutton\" horizontal=\"end\" slot=\"fixed\" (click)=\"form(modulename)\">\r\n     <!-- <a routerLink=\"/leadform\" > -->\r\n        <ion-fab-button>\r\n           <ion-icon name=\"add\" style=\"color:white;\"></ion-icon> \r\n           <!-- ADD -->\r\n        </ion-fab-button>\r\n     <!-- </a> -->\r\n  </ion-fab>\r\n  <ion-item-sliding #slidingItem id=\"item100\"  style=\"background-color:#dbdddb; border-radius: 10px;\">\r\n \r\n     \r\n    \r\n         <ion-item>\r\n            <div *ngFor=\"let header of headers;let i = index\" (click)=\"go(modulename,record.id)\">\r\n             \r\n                  <!-- <a routerLink=\"/leadsdetails/{{ record.id }}\" class=\"alllink\" > -->\r\n                     <div class=\"headerlabel\"> \r\n                        {{ header.label}}\r\n                     </div>\r\n                     <div  class=\"headervalue\">\r\n                        {{ record[header.name]}}\r\n                     </div>\r\n                   \r\n                  <!-- </a> -->\r\n             \r\n            </div>\r\n         </ion-item>\r\n    \r\n  \r\n     <ion-item-options side=\"end\">\r\n        <ion-button fill=\"clear\" \r\n        (click)=\"slidingclose(slidingItem)\" (click)=\"leadsdeleteList(record.id)\" (click)=\"refresh($event)\" style=\"height: 48px;\" >\r\n        <ion-icon slot=\"icon-only\" color=\"danger\" name=\"trash\" size=\"small\"></ion-icon>\r\n        delete\r\n        </ion-button> \r\n        <div class=\"vl\"></div>\r\n        <ion-button fill=\"clear\" (click)=\"slidingclose(slidingItem)\" (click)=\"formedit(modulename,record.id)\" style=\"height: 48px;\">\r\n           <ion-icon color=\"warning\" slot=\"icon-only\" name=\"create\" size=\"small\" ></ion-icon>\r\n           edit\r\n        </ion-button>\r\n     </ion-item-options>\r\n  </ion-item-sliding>\r\n  <!--Rajesh Saha-->\r\n</ion-content>");

/***/ }),

/***/ 82629:
/*!***************************************!*\
  !*** ./src/app/leads/leads.page.scss ***!
  \***************************************/
/***/ ((module) => {

module.exports = ".headerlabel {\n  font-size: 12px;\n  font-weight: 600;\n  width: 75px;\n  padding: 5px 5px 5px 0;\n  height: 40px;\n  vertical-align: top;\n}\n\n.headervalue {\n  padding: 5px 5px 5px 0;\n  font-size: 12px;\n  height: 55px;\n  word-break: break-word;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRzLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLGVBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtBQUNKOztBQUNBO0VBQ0ksc0JBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLHNCQUFBO0FBRUoiLCJmaWxlIjoibGVhZHMucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlcmxhYmVse1xyXG4gICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICAgIHdpZHRoOiA3NXB4O1xyXG4gICAgcGFkZGluZzogNXB4IDVweCA1cHggMDtcclxuICAgIGhlaWdodDogNDBweDtcclxuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XHJcbn1cclxuLmhlYWRlcnZhbHVle1xyXG4gICAgcGFkZGluZzogNXB4IDVweCA1cHggMDtcclxuICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIGhlaWdodDogNTVweDtcclxuICAgIHdvcmQtYnJlYWs6IGJyZWFrLXdvcmQ7XHJcblxyXG59XHJcbiJdfQ== */";

/***/ })

}]);
//# sourceMappingURL=src_app_leads_leads_module_ts.js.map