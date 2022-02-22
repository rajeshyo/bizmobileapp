"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_services_services_module_ts"],{

/***/ 18968:
/*!*********************************************!*\
  !*** ./src/app/services/services.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ServicesPageModule": () => (/* binding */ ServicesPageModule)
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
/* harmony import */ var _services_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./services.page */ 8034);










const routes = [
    {
        path: '',
        component: _services_page__WEBPACK_IMPORTED_MODULE_2__.ServicesPage
    }
];
let ServicesPageModule = class ServicesPageModule {
};
ServicesPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes)
        ],
        declarations: [_services_page__WEBPACK_IMPORTED_MODULE_2__.ServicesPage],
        providers: [
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__.ModuleService,
            _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__.HeaderService
        ]
    })
], ServicesPageModule);



/***/ }),

/***/ 8034:
/*!*******************************************!*\
  !*** ./src/app/services/services.page.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ServicesPage": () => (/* binding */ ServicesPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_services_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./services.page.html */ 7927);
/* harmony import */ var _services_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services.page.scss */ 92690);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/toast/toast.service */ 19179);






// import { HeaderService } from '../services/header/header.service';

// import { ItemSliding } from 'ionic-angular';
let ServicesPage = class ServicesPage {
    constructor(navCtrl, menuCtrl, loadingCtrl, moduleService, 
    // private headerservice: HeaderService,
    toastService) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.moduleService = moduleService;
        this.toastService = toastService;
        this.modules = [];
        this.showSpinner = true;
    }
    ngOnInit() {
        this.leadsList();
        // this.leadsdeleteList();
    }
    leadsList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Services',
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
            }
            else {
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
        const id1 = id.split('x')[1];
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Services',
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
};
ServicesPage.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.LoadingController },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService },
    { type: _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__.ToastService }
];
ServicesPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-services',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_services_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_services_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], ServicesPage);



/***/ }),

/***/ 7927:
/*!************************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/services/services.page.html ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n     <ion-buttons slot=\"start\">\r\n        <ion-menu-button></ion-menu-button>\r\n     </ion-buttons>\r\n     <ion-title>\r\n        Services\r\n        <ion-icon name=\"refresh\" (click)=\"refresh($event)\" float-right></ion-icon>\r\n     </ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n<!--Rajesh Saha-->\r\n<br>\r\n<ion-content>\r\n  <ion-spinner  *ngIf=\"showSpinner\" color=\"primary\" name=\"lines\" class=\"addbutton\" ></ion-spinner>\r\n  <ion-fab vertical=\"bottom\" class=\"addbutton\" horizontal=\"end\" slot=\"fixed\">\r\n     <a routerLink=\"/servicesform\" >\r\n        <ion-fab-button>\r\n           <ion-icon name=\"add\" style=\"color:white;\"></ion-icon>\r\n        </ion-fab-button>\r\n     </a>\r\n  </ion-fab>\r\n  <ion-item-sliding #slidingItem id=\"item100\" *ngFor=\"let lead of modules;let i = index\" style=\"background-color:#0ab22a;\">\r\n     <ion-item>\r\n        <div *ngFor=\"let field of lead.blocks;let i = index\">\r\n           <div *ngFor=\"let fieldsdt of field.fields;let i = index\">\r\n              <a routerLink=\"/servicesdetails/{{ lead.id }}\" class=\"alllink\" >\r\n                 <ion-label >\r\n                    <div>\r\n                       <p *ngIf=\"fieldsdt.name =='servicename'\">Service Name:</p>\r\n                       <p *ngIf=\"fieldsdt.name =='servicename'\" id=\"ptag\" class=\"field\">{{ fieldsdt.value }}</p>\r\n                    </div>\r\n                    <div>\r\n                       <p *ngIf=\"fieldsdt.name =='service_no'\">Service No:</p>\r\n                       <p *ngIf=\"fieldsdt.name =='service_no'\" id=\"ptag\" class=\"field\">{{ fieldsdt.value |titlecase}} </p>\r\n                    </div>\r\n                 </ion-label>\r\n              </a>\r\n           </div>\r\n        </div>\r\n     </ion-item>\r\n     <ion-item-options side=\"end\">\r\n        <ion-button fill=\"clear\" (click)=\"slidingclose(slidingItem)\" (click)=\"servicesdeleteList(lead.id)\" (click)=\"refresh($event)\" style=\"height: 48px;\" >\r\n        <ion-icon slot=\"icon-only\" color=\"danger\" name=\"trash\" size=\"small\"></ion-icon>\r\n        </ion-button> \r\n        <div class=\"vl\"></div>\r\n        <ion-button fill=\"clear\" (click)=\"slidingclose(slidingItem)\"  routerLink=\"/servicesform/{{ lead.id }}\" style=\"height: 48px;\">\r\n           <ion-icon color=\"warning\" slot=\"icon-only\" name=\"create\" size=\"small\" ></ion-icon>\r\n        </ion-button>\r\n     </ion-item-options>\r\n  </ion-item-sliding>\r\n  <!--Rajesh Saha-->\r\n</ion-content>");

/***/ }),

/***/ 92690:
/*!*********************************************!*\
  !*** ./src/app/services/services.page.scss ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzZXJ2aWNlcy5wYWdlLnNjc3MifQ== */";

/***/ })

}]);
//# sourceMappingURL=src_app_services_services_module_ts.js.map