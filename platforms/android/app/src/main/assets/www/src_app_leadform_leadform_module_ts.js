"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_leadform_leadform_module_ts"],{

/***/ 38523:
/*!*********************************************!*\
  !*** ./src/app/leadform/leadform.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadformPageModule": () => (/* binding */ LeadformPageModule)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 28267);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 18346);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 13252);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 83981);
/* harmony import */ var _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/header/header.service */ 36203);
/* harmony import */ var _leadform_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./leadform.page */ 64245);










const routes = [
    {
        path: '',
        component: _leadform_page__WEBPACK_IMPORTED_MODULE_2__.LeadformPage
    }
];
let LeadformPageModule = class LeadformPageModule {
};
LeadformPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.ReactiveFormsModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes)
        ],
        declarations: [_leadform_page__WEBPACK_IMPORTED_MODULE_2__.LeadformPage],
        providers: [
            _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__.HeaderService,
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__.ModuleService
        ]
    })
], LeadformPageModule);



/***/ }),

/***/ 64245:
/*!*******************************************!*\
  !*** ./src/app/leadform/leadform.page.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeadformPage": () => (/* binding */ LeadformPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leadform_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./leadform.page.html */ 46737);
/* harmony import */ var _leadform_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./leadform.page.scss */ 83322);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 18346);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/toast/toast.service */ 19179);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 13252);







// import { HeaderService } from '../services/header/header.service';



let LeadformPage = class LeadformPage {
    constructor(navCtrl, menuCtrl, toastCtrl, alertCtrl, loadingCtrl, formBuilder, router, 
    // private headerservice: HeaderService,
    toastService, moduleService, route) {
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.toastCtrl = toastCtrl;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.formBuilder = formBuilder;
        this.router = router;
        this.toastService = toastService;
        this.moduleService = moduleService;
        this.route = route;
        this.leadData = {};
        this.modules = [];
        this.loaddata = 0;
        this.showSpinner = true;
        this.moduleid = this.route.snapshot.queryParamMap.get('id');
        this.mainmodulename = this.route.snapshot.queryParamMap.get('name');
    }
    ngOnInit() {
        const modulename = JSON.parse(localStorage.getItem('modulesname'));
        for (let x of modulename) {
            //  console.log("listm",x.name)
            if (this.mainmodulename === x.name) {
                console.log("moduleid", x.id);
                this.j = x.id;
                // return j;
            }
        }
        console.log("mop", this.moduleid);
        this.bizFormData = {};
        this.profileList();
        this.onLeadForm = this.formBuilder.group({
            'lastname': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.compose([
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required
                ])],
            'assigned_user_id': [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.compose([
                    _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required
                ])]
        });
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
        });
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const record = this.j + "x" + this.moduleid;
        const getFetchData = {
            url: loginData.url,
            session,
            module: this.mainmodulename,
            operation: 'fetchRecord',
        };
        if (this.moduleid !== null) { // fetchrecord
            this.moduleService.getservicesListSync(getFetchData, record).subscribe(res => {
                this.data = res;
                if (this.data !== null) {
                    if (this.data.success === true) {
                        // console.log(this.data);
                        if (this.data.result.record !== null) {
                            this.editrecord = this.data.result.record;
                            let dataRecieved = Object.keys(this.data.result.record);
                            for (let l = 0; l < dataRecieved.length; l++) {
                                this.bizFormData[dataRecieved[l]] = this.editrecord[dataRecieved[l]];
                            }
                        }
                    }
                    else {
                        this.toastService.presentToast('jj Wrong');
                    }
                }
                else {
                    this.toastService.presentToast('ff Wrong');
                }
            }, (err) => {
                console.log(err);
            });
        }
    }
    profileList() {
        console.log("moduleidnew", this.j);
        this.route.paramMap.subscribe(params => {
            this.id = params.get('id');
        });
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const record = this.id;
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: this.mainmodulename,
            operation: 'describe'
        };
        this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
            this.data = res;
            this.showSpinner = false;
            if (this.data.success === true) {
                this.loaddata = 1;
                this.modules = this.data.result.describe.fields;
                // console.log("ghdata",this.modules)
                let test_this = this;
                const test = "assigned_user_id";
                this.modules.forEach(function (value, i) {
                    if (test === value.name) {
                        console.log('dataidssss%d', i);
                        test_this.k = i;
                    }
                });
                // console.log("jkjk",this.modules.indexOf(test));
                // console.log("kvalue",test_this.k)
                if (this.k) {
                    let ids = Object.keys(this.modules[test_this.k]['type']['picklistValues']['users']);
                    this.modules['ownerdata'] = [];
                    for (let i = 0; i < ids.length; i++) {
                        let a = { 'id': ids[i], 'label': this.modules[test_this.k]['type']['picklistValues']['users'][ids[i]] };
                        this.modules['ownerdata'].push(a);
                    }
                    let idGrops = Object.keys(this.modules[test_this.k]['type']['picklistValues']['groups']);
                    let igGroupslength = idGrops.length;
                    for (let j = 0; j < igGroupslength; j++) {
                        let a = { 'id': idGrops[j], 'label': this.modules[test_this.k]['type']['picklistValues']['groups'][idGrops[j]] };
                        this.modules['ownerdata'].push(a);
                    }
                }
                // console.log(this.modules);
                let group = {};
                for (let z = 0; z < this.modules.length; z++) {
                    let label = this.modules[z]['name'];
                    group[label] = [''];
                }
                this.onLeadForm = this.formBuilder.group(group);
                // return this.modules;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    openModel(modulename) {
        console.log("ll", modulename);
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
                    console.log("relad", this.recordsdata);
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
    onSubmit(form) {
        console.log("formdatanew", this.bizFormData);
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const record = this.j + "x" + this.moduleid;
        if (this.moduleid !== null) {
            //Update Record
            const getServiceData = {
                url: loginData.url,
                session,
                module: this.mainmodulename,
                operation: 'saveRecord',
                values: JSON.stringify(this.bizFormData),
                // record : this.id
            };
            this.moduleService.getservicesListSync(getServiceData, record).subscribe(res => {
                this.data = res;
                if (this.data !== null) {
                    if (this.data.success === true) {
                        this.toastService.presentToast('Record has been successfully updated');
                        // this.navCtrl.navigateRoot('/leads/{{mainmodulename}}');
                        this.router.navigateByUrl('/leads/' + this.mainmodulename);
                    }
                    else {
                        this.toastService.presentToast('Something Wrong');
                    }
                }
                else {
                    this.toastService.presentToast('Something Wrong');
                }
            }, (err) => {
                console.log(err);
            });
        }
        else { //Insert Record
            form['id'] = undefined;
            const getServiceData = {
                url: loginData.url,
                session,
                module: this.mainmodulename,
                operation: 'saveRecord',
                values: JSON.stringify(this.bizFormData)
            };
            this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
                this.data = res;
                if (this.data !== null) {
                    if (this.data.success === true) {
                        this.toastService.presentToast('Record has been successfully added');
                        // this.navCtrl.navigateRoot('/leads/{{this.mainmodulename}}');
                        this.router.navigateByUrl('/leads/' + this.mainmodulename);
                    }
                    // else {
                    // this.toastService.presentToast('Something Wrong');
                    // }
                }
                // else {
                // this.toastService.presentToast('Something Wrong');
                // }
            }, (err) => {
                console.log(err);
            });
        }
    }
};
LeadformPage.ctorParameters = () => [
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.ToastController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.AlertController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.LoadingController },
    { type: _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__.Router },
    { type: _services_toast_toast_service__WEBPACK_IMPORTED_MODULE_3__.ToastService },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_6__.ActivatedRoute }
];
LeadformPage = (0,tslib__WEBPACK_IMPORTED_MODULE_7__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.Component)({
        selector: 'app-leadform',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_leadform_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_leadform_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], LeadformPage);



/***/ }),

/***/ 46737:
/*!************************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/leadform/leadform.page.html ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n  <ion-toolbar color=\"primary\">\r\n     <ion-title>\r\n        <form [formGroup]=\"onLeadForm\" (submit)=\"onSubmit(onLeadForm.value)\" padding>\r\n          <a routerLink=\"/leads/{{mainmodulename}}\">\r\n           <ion-icon name=\"arrow-back\" ></ion-icon>\r\n        </a>\r\n        &nbsp;&nbsp;&nbsp;\r\n        {{mainmodulename}} Form\r\n       \r\n            <!-- <ion-button  float-right type=\"submit\" *ngIf=\"onLeadForm\" [disabled]=\"!onLeadForm.valid\"  fill=\"clear\" class=\"savebutton\" style=\"--background-color: transparent !important;\"> \r\n                <ion-icon size=\"large\" name=\"checkmark-circle\"></ion-icon>\r\n              </ion-button> -->\r\n            </form>\r\n        </ion-title>\r\n      </ion-toolbar>\r\n  </ion-header>\r\n<!--Rajesh Saha-->\r\n  <br>\r\n  <ion-content>\r\n\r\n\r\n\r\n<div class=\"card1\" *ngIf=\"loaddata == 1\">\r\n  <form [formGroup]=\"onLeadForm\" (submit)=\"onSubmit(onLeadForm.value)\">\r\n    <div class=\"card\" style=\"padding: 10px;\">\r\n      <div class=\"card-body\">\r\n       \r\n        <!-- <h5 class=\"card-title text-center\"> {{mainmodulename}} Form</h5> -->\r\n        <div class=\"row\">\r\n        \r\n           \r\n          <div class=\"col-sm-6\">\r\n            <div class=\"card\" style=\"padding: 10px;\">\r\n              <div class=\"card-header\">\r\n                <!-- <strong>Lead Details</strong> -->\r\n              </div>\r\n              <div class=\"card-body was-validated\">\r\n              \r\n                <div class=\"form-group\" *ngFor=\"let lead of modules;let i = index\">\r\n                  <div *ngIf=\"(lead.displaytype !=='2' && lead.displaytype !=='3')\">\r\n                    <span *ngIf=\"(lead.uitype !=='4' )\">\r\n                    <!-- ({{lead.displaytype}}  ? '$2.00' : '$10.00') -->\r\n                   \r\n                    <!-- This is new design inputbox style -->\r\n                  <!-- <div *ngIf=\"lead.type.name =='text'\">\r\n                    <ion-item>\r\n                      <ion-label position=\"floating\" for=\"inputSuccess2\">{{ lead.label }}</ion-label>\r\n                      <ion-input [(ngModel)]=\"bizFormData[lead.name]\" type=\"text\"  [formControlName]= \"modules[i]['name']\" name=lead.name></ion-input>\r\n                    </ion-item>\r\n                  </div> -->\r\n\r\n                    <div *ngIf=\"(lead.type.name =='string' || lead.type.name =='url') &&  lead.name !='salutationtype'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" class=\"form-control formstyle\" [formControlName]=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='date'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"date\" class=\"form-control formstyle\" [formControlName]= \"modules[i]['name']\" name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='text'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"text\" class=\"form-control\" [formControlName]= \"modules[i]['name']\" name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='integer' || lead.type.name =='decimal'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"number\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='double'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"percent\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='boolean'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"boolean\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='datetime'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"datetime\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='autogenerated'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"autogenerated\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='time'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"time\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='phone'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"phone\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='email'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"email\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n                    <div *ngIf=\"lead.type.name =='currency'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <input [(ngModel)]=\"bizFormData[lead.name]\" type=\"currency\" class=\"form-control\" [formControlName]=lead.name name=lead.name>\r\n                    </div>\r\n\r\n\r\n                    <div *ngIf=\"lead.type.name =='reference'\" >\r\n\r\n                      <!-- <div *ngIf=\"lead.type.refersTo[0] == 'Project'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select [(ngModel)]=\"bizFormData[lead.name]\" [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=val *ngFor=\"let val of lead.type.refersTo;let i = index\">\r\n                            {{ val }}\r\n                          </option>\r\n                        </select>\r\n                      </div> -->\r\n\r\n                      <!-- <div *ngIf=\"lead.type.refersTo[0] == 'Accounts'\" >\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div> -->\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Accounts'\" (click)=\"openModel(lead.type.refersTo[0])\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\" >{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let record of recordsdata;let i = index\" >\r\n                            {{ record.firstname|| record.accountname }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Project'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=val *ngFor=\"let val of lead.type.refersTo;let i = index\">\r\n                            {{ val }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Products'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Currency'\" (click)=\"openModel(lead.type.refersTo[0])\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\" >{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let record of recordsdata;let i = index\" >\r\n                            {{ record.firstname }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Vendors'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n\r\n\r\n\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Leads'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'PurchaseOrder'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Quotes'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Invoice'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Faq'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'HelpDesk'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'ProjectTask'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Potentials'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'Contacts'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select  [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n                      <div *ngIf=\"lead.type.refersTo[0] == 'SalesOrder'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span></label>\r\n                        <select [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals *ngFor=\"let vals of lead.type.refersTo;let i = index\">\r\n                            {{ vals }}\r\n                          </option>\r\n                        </select>\r\n                      </div>\r\n\r\n\r\n                      <!-- <div *ngIf=\"lead.type.refersTo[0] == 'Users'\">\r\n                        <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}  <span *ngIf=\"lead.mandatory == true\" class=\"error\"> * </span> </label>\r\n                        <select [(ngModel)]=\"bizFormData[lead.name]\" [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                          <option [value]=vals.id *ngFor=\"let vals of testarry;let i = index\">\r\n                            {{ vals.subject }}\r\n                          </option>\r\n                        </select>\r\n                      </div> -->\r\n                   \r\n\r\n                    \r\n                    </div>\r\n\r\n\r\n                    <div *ngIf=\"lead.type.name =='picklist' ||   lead.name =='salutationtype'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <select [(ngModel)]=\"bizFormData[lead.name]\" [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                        <option [value]=pick.value *ngFor=\"let pick of lead.type.picklistValues;let i = index\">\r\n                          {{pick.label}}\r\n                        </option>\r\n                      </select>\r\n                    </div>\r\n\r\n                    <div *ngIf=\"lead.type.name =='owner'\">\r\n                      <label class=\"form-col-form-label\" for=\"inputSuccess2\">{{ lead.label }}</label>\r\n                      <select [(ngModel)]=\"bizFormData[lead.name]\" [formControlName]=lead.name name=lead.name class=\"form-control\">\r\n                        <option [value]=k.id *ngFor=\"let k of modules['ownerdata']\">{{ k.label }}</option>\r\n                      </select>\r\n                    </div>\r\n\r\n                    \r\n                 \r\n                  </span>\r\n                 </div>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <button type=\"submit\" *ngIf=\"onLeadForm\" \r\n              class=\"btn btn-primary btn-lg btn-block\">Save {{mainmodulename}}\r\n            </button>\r\n            <!-- [disabled]=\"!onLeadForm.valid\" -->\r\n\r\n          </div>\r\n\r\n        </div>\r\n\r\n      </div>\r\n      <!-- <a routerLink=\"/leadform\" class=\"btn btn-primary text-center btn-lg active\" role=\"button\" aria-pressed=\"true\">Add\r\n        Lead</a> -->\r\n    </div>\r\n\r\n  </form>\r\n</div>\r\n\r\n<!-- type=\"submit\" *ngIf=\"onLeadForm\" [disabled]=\"!onLeadForm.valid\" -->\r\n</ion-content>\r\n<!--Rajesh Saha-->");

/***/ }),

/***/ 83322:
/*!*********************************************!*\
  !*** ./src/app/leadform/leadform.page.scss ***!
  \*********************************************/
/***/ ((module) => {

module.exports = ".inputbutton {\n  margin-bottom: -30px;\n  margin-left: 60%;\n}\n\n.iabeltext {\n  font-size: 20px;\n}\n\n.ion-labelmain {\n  margin-left: 9px;\n}\n\n.back {\n  color: #222428;\n}\n\n.savebutton {\n  margin-top: -8px;\n}\n\n.header {\n  background-color: #3880ff;\n  height: 60px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRmb3JtLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG9CQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLGVBQUE7QUFDRjs7QUFDQTtFQUNFLGdCQUFBO0FBRUY7O0FBQUE7RUFDRSxjQUFBO0FBR0Y7O0FBQ0E7RUFDRSxnQkFBQTtBQUVGOztBQUFBO0VBQ0EseUJBQUE7RUFDQSxZQUFBO0FBR0EiLCJmaWxlIjoibGVhZGZvcm0ucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmlucHV0YnV0dG9ue1xyXG4gIG1hcmdpbi1ib3R0b206IC0zMHB4O1xyXG4gIG1hcmdpbi1sZWZ0OiA2MCU7XHJcblxyXG59XHJcbi5pYWJlbHRleHR7XHJcbiAgZm9udC1zaXplOiAyMHB4O1xyXG59XHJcbi5pb24tbGFiZWxtYWlue1xyXG4gIG1hcmdpbi1sZWZ0OiA5cHg7XHJcbn1cclxuLmJhY2t7XHJcbiAgY29sb3I6ICMyMjI0Mjg7XHJcbn1cclxuXHJcblxyXG4uc2F2ZWJ1dHRvbiB7XHJcbiAgbWFyZ2luLXRvcDogLThweDtcclxufVxyXG4uaGVhZGVye1xyXG5iYWNrZ3JvdW5kLWNvbG9yOiMzODgwZmY7XHJcbmhlaWdodDo2MHB4O1xyXG59XHJcblxyXG4vLyAuZm9ybXN0eWxle1xyXG4vLyAgIG1hcmdpbi10b3A6IC0zMHB4O21hcmdpbi1sZWZ0OiA3NXB4O1xyXG4vLyB9Il19 */";

/***/ })

}]);
//# sourceMappingURL=src_app_leadform_leadform_module_ts.js.map