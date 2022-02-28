"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_relation_relation_module_ts"],{

/***/ 86645:
/*!*****************************************************!*\
  !*** ./src/app/relation/relation-routing.module.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RelationPageRoutingModule": () => (/* binding */ RelationPageRoutingModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 13252);
/* harmony import */ var _relation_page__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./relation.page */ 19294);




const routes = [
    {
        path: '',
        component: _relation_page__WEBPACK_IMPORTED_MODULE_0__.RelationPage
    }
];
let RelationPageRoutingModule = class RelationPageRoutingModule {
};
RelationPageRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    })
], RelationPageRoutingModule);



/***/ }),

/***/ 31661:
/*!*********************************************!*\
  !*** ./src/app/relation/relation.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RelationPageModule": () => (/* binding */ RelationPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 28267);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 18346);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _relation_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./relation-routing.module */ 86645);
/* harmony import */ var _relation_page__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./relation.page */ 19294);







let RelationPageModule = class RelationPageModule {
};
RelationPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_2__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_6__.IonicModule,
            _relation_routing_module__WEBPACK_IMPORTED_MODULE_0__.RelationPageRoutingModule
        ],
        declarations: [_relation_page__WEBPACK_IMPORTED_MODULE_1__.RelationPage]
    })
], RelationPageModule);



/***/ }),

/***/ 19294:
/*!*******************************************!*\
  !*** ./src/app/relation/relation.page.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RelationPage": () => (/* binding */ RelationPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_relation_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./relation.page.html */ 6035);
/* harmony import */ var _relation_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./relation.page.scss */ 44261);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 13252);








let RelationPage = class RelationPage {
    constructor(route, router, navCtrl, menuCtrl, loadingCtrl, moduleService) {
        this.route = route;
        this.router = router;
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.moduleService = moduleService;
        this.moduleid = this.route.snapshot.queryParamMap.get('id');
        this.mainmodulename = this.route.snapshot.queryParamMap.get('name');
    }
    ngOnInit() {
        this.moduleid = this.route.snapshot.queryParamMap.get('id');
        const modulename = JSON.parse(localStorage.getItem('modulesname'));
        for (let x of modulename) {
            //  console.log("listm",x.name)
            if (this.mainmodulename === x.name) {
                console.log("moduleid", x.id);
                this.j = x.id;
                // return j;
            }
        }
        this.check();
    }
    check() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            username: loginData.username,
            password: loginData.password,
            operation: 'relatedRecordsWithGrouping',
            record: this.mainmodulename,
            relatedmodule: this.moduleid,
            session
        };
        this.moduleService.getModuleListRelation(getServiceData, options).subscribe(res => {
            this.data1 = res;
            if (this.data1.success === true) {
                // console.log("yy",this.data1.result.records);
                this.modules = this.data1.result.records;
                // console.log("mydata",this.modules);
                return this.modules;
            }
        }, (err) => {
            console.log(err);
        });
    }
    ;
};
RelationPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__.ActivatedRoute },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__.Router },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_4__.LoadingController },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService }
];
RelationPage = (0,tslib__WEBPACK_IMPORTED_MODULE_5__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-relation',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_relation_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_relation_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], RelationPage);



/***/ }),

/***/ 6035:
/*!************************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/relation/relation.page.html ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n     <ion-title>\r\n        <a routerLink=\"/leads/{{moduleid}}\">\r\n           <ion-icon name=\"arrow-back\" ></ion-icon>\r\n        </a>\r\n        &nbsp;&nbsp;&nbsp;\r\n       Relation\r\n     </ion-title>\r\n  </ion-toolbar>\r\n</ion-header>\r\n\r\n<ion-content>\r\n<!-- <h1>Relation</h1> -->\r\n<!-- <button (click)=\"check()\">Check</button> -->\r\n\r\n<!-- <div *ngFor=\"let a of modules;let i = index\">\r\n  <div *ngFor=\"let b of a.blocks;let i = index\">\r\n\r\n<div *ngFor=\"let fields of b.fields;let i = index\">\r\n{{fields.label}} {{fields.value}} <br>\r\n\r\n</div>\r\n  </div>\r\n</div> -->\r\n\r\n<ion-card *ngFor=\"let a of modules;let i = index\">\r\n \r\n  <span *ngFor=\"let b of a.blocks;let i = index\">\r\n    <ion-icon color=\"warning\" slot=\"icon-only\" name=\"create\" size=\"large\" ></ion-icon>\r\n      <ion-card-content *ngFor=\"let fields of b.fields;let i = index\">\r\n        {{fields.label}} {{fields.value}}\r\n      </ion-card-content>\r\n  </span>\r\n</ion-card>\r\n\r\n\r\n</ion-content>\r\n");

/***/ }),

/***/ 44261:
/*!*********************************************!*\
  !*** ./src/app/relation/relation.page.scss ***!
  \*********************************************/
/***/ ((module) => {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJyZWxhdGlvbi5wYWdlLnNjc3MifQ== */";

/***/ })

}]);
//# sourceMappingURL=src_app_relation_relation_module_ts.js.map