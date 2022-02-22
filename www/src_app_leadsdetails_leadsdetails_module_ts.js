"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_leadsdetails_leadsdetails_module_ts"],{

/***/ 89478:
/*!*****************************************************!*\
  !*** ./src/app/leadsdetails/leadsdetails.module.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadsdetailsPageModule": () => (/* binding */ LeadsdetailsPageModule)
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
/* harmony import */ var _leadsdetails_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./leadsdetails.page */ 88849);










const routes = [
    {
        path: '',
        component: _leadsdetails_page__WEBPACK_IMPORTED_MODULE_2__.LeadsdetailsPage
    }
];
let LeadsdetailsPageModule = class LeadsdetailsPageModule {
};
LeadsdetailsPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes)
        ],
        declarations: [_leadsdetails_page__WEBPACK_IMPORTED_MODULE_2__.LeadsdetailsPage],
        providers: [
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__.ModuleService,
            _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__.HeaderService
        ]
    })
], LeadsdetailsPageModule);



/***/ }),

/***/ 88849:
/*!***************************************************!*\
  !*** ./src/app/leadsdetails/leadsdetails.page.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadsdetailsPage": () => (/* binding */ LeadsdetailsPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leadsdetails_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./leadsdetails.page.html */ 24111);
/* harmony import */ var _leadsdetails_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./leadsdetails.page.scss */ 71273);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 13252);






// import { HeaderService } from '../services/header/header.service';


let LeadsdetailsPage = class LeadsdetailsPage {
    constructor(navCtrl, menuCtrl, loadingCtrl, moduleService, 
    // private headerservice: HeaderService,
    route, router) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.moduleService = moduleService;
        this.route = route;
        this.router = router;
        this.modules = [];
        this.relatedmodules = [];
        this.showSpinner = true;
        this.moduleid = this.route.snapshot.queryParamMap.get('id');
        this.mainmodulename = this.route.snapshot.queryParamMap.get('name');
    }
    ngOnInit() {
        // this.data.subscribe(() => this.showSpinner =false)
        //  console.log(this.route.snapshot.queryParamMap.get('id'))
        //  console.log(this.route.snapshot.queryParamMap.get('name'))
        const modulename = JSON.parse(localStorage.getItem('modulesname'));
        for (let x of modulename) {
            //  console.log("listm",x.name)
            if (this.mainmodulename === x.name) {
                //  console.log("moduleid",x.id)
                this.j = x.id;
                // return j;
            }
        }
        this.relatedmodule();
        this.profileList();
        this.moduleidpass();
    }
    profileList() {
        console.log("moduleid", this.j);
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
        const record = this.j + "x" + this.moduleid;
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            // record : this.id,
            module: this.mainmodulename,
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
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    moduleidpass() {
        console.log("moduleid", this.j);
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
        const record = this.j + "x" + this.moduleid;
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            // record : this.id,
            module: this.mainmodulename,
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
            }
            else {
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
        const record = this.j + "x" + this.moduleid;
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            // record : this.id,
            module: this.mainmodulename,
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
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    relatediddatapass(modulename, moduleid) {
        this.router.navigateByUrl('relation?id=' + moduleid + '&name=' + modulename);
    }
    form(mainmodulename) {
        this.router.navigateByUrl('leadform?name=' + mainmodulename);
    }
    getrecordDetail(id) {
        alert(id);
    }
};
LeadsdetailsPage.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_3__.LoadingController },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.ActivatedRoute },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.Router }
];
LeadsdetailsPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-leadsdetails',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leadsdetails_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_leadsdetails_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], LeadsdetailsPage);



/***/ }),

/***/ 24111:
/*!********************************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/leadsdetails/leadsdetails.page.html ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n     <ion-title>\r\n        <a routerLink=\"/leads/{{mainmodulename}}\">\r\n           <ion-icon name=\"arrow-back\" ></ion-icon>\r\n        </a>\r\n        &nbsp;&nbsp;&nbsp;\r\n        {{mainmodulename}} Details\r\n     </ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n<!--Rajesh Saha-->\r\n<ion-content>\r\n  <!-- <div *ngFor=\"let rdata of relatedmodules;let i = index\">\r\n   \r\n   <a routerLink=\"/leads/{{rdata.modulename}}\" *ngIf=\"rdata.actions =='select'\">{{rdata.label}}</a>\r\n \r\n<p (click)=\"form(rdata.modulename)\" *ngIf=\"rdata.actions =='add'\">{{rdata.label}}</p>\r\n  </div> -->\r\n\r\n  <div *ngFor=\"let rdata of relatedmodules;let i = index\">\r\n   \r\n   <!-- <a routerLink=\"/leads/{{rdata.modulename}}\" >{{rdata.label}}</a> -->\r\n   <!-- <a routerLink=\"/leads/{{rdata.modulename}}\" *ngIf=\"rdata.actions =='add'\">{{rdata.label}}</a> -->\r\n  \r\n      <p (click)=\"relatediddatapass(moduleiddata.id,rdata.modulename)\" >{{rdata.label}}</p>\r\n\r\n\r\n  </div>\r\n  <span *ngFor=\"let lead of modules;let i = index\">\r\n     <ion-card>\r\n        <ion-card-header>\r\n           <ion-card-title> {{ lead.label }}</ion-card-title>\r\n        </ion-card-header>\r\n        <div *ngFor=\"let fieldsdt of lead.fields;let i = index\">\r\n           <ion-card-content>\r\n              <div>\r\n                 <p  >{{ fieldsdt.label }}:</p>\r\n              </div>\r\n              <!-- <ion-item>{{ fieldsdt.label }}: -->\r\n              <div >\r\n                 <p class=\"label\" *ngIf=\"(fieldsdt.name === 'assigned_user_id' || fieldsdt.name === 'modifiedby' || fieldsdt.name === 'creator')\">\r\n                    {{fieldsdt.value.label}}\r\n                 </p>\r\n              </div>\r\n              <div class=\"box\">\r\n                 <p class=\"value\" *ngIf=\"(fieldsdt.name !== 'assigned_user_id' && fieldsdt.name !=='modifiedby' && fieldsdt.name !=='creator')\">\r\n                    {{fieldsdt.value |titlecase}}\r\n                 </p>\r\n              </div>\r\n              <!-- </ion-item> -->\r\n           </ion-card-content>\r\n        </div>\r\n     </ion-card>\r\n  </span>\r\n\r\n  <!-- <ion-fab horizontal=\"end\" vertical=\"bottom\" slot=\"fixed\" >\r\n   <ion-fab-button color=\"dark\">\r\n     <ion-icon md=\"arrow-back\" ios=\"chevron-back-circle-outline\" color=\"light\"></ion-icon>\r\n   </ion-fab-button>\r\n   <ion-fab-list side=\"start\" > -->\r\n\r\n      \r\n     <!-- <ion-fab-button color=\"dark\"> -->\r\n       <!-- <ion-icon name=\"logo-facebook\" color=\"light\"></ion-icon> -->\r\n       <!-- <p color=\"red\"></p> -->\r\n     <!-- </ion-fab-button> -->\r\n     <!-- <ion-fab-button color=\"dark\"> -->\r\n       <!-- <ion-icon name=\"logo-twitter\" color=\"light\"></ion-icon> -->\r\n       <!-- <p color=\"red\">Link 2 </p> -->\r\n     <!-- </ion-fab-button> -->\r\n     <!-- <ion-fab-button color=\"dark\">\r\n       <ion-icon name=\"logo-vimeo\" color=\"light\"></ion-icon>\r\n     </ion-fab-button> -->\r\n\r\n\r\n   <!-- </ion-fab-list>\r\n </ion-fab> -->\r\n</ion-content>\r\n<!--Rajesh Saha-->");

/***/ }),

/***/ 71273:
/*!*****************************************************!*\
  !*** ./src/app/leadsdetails/leadsdetails.page.scss ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJsZWFkc2RldGFpbHMucGFnZS5zY3NzIn0= */";

/***/ })

}]);
//# sourceMappingURL=src_app_leadsdetails_leadsdetails_module_ts.js.map