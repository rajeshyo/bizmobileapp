"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_dashboard_dashboard_module_ts"],{

/***/ 26800:
/*!***********************************************!*\
  !*** ./src/app/dashboard/dashboard.module.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DashboardPageModule": () => (/* binding */ DashboardPageModule)
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
/* harmony import */ var _dashboard_page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dashboard.page */ 2858);










const routes = [
    {
        path: '',
        component: _dashboard_page__WEBPACK_IMPORTED_MODULE_2__.DashboardPage
    }
];
let DashboardPageModule = class DashboardPageModule {
};
DashboardPageModule = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.NgModule)({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule,
            _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule,
            _ionic_angular__WEBPACK_IMPORTED_MODULE_7__.IonicModule,
            _angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClientModule,
            _angular_router__WEBPACK_IMPORTED_MODULE_9__.RouterModule.forChild(routes)
        ],
        declarations: [_dashboard_page__WEBPACK_IMPORTED_MODULE_2__.DashboardPage],
        providers: [
            _services_module_module_service__WEBPACK_IMPORTED_MODULE_0__.ModuleService,
            _services_header_header_service__WEBPACK_IMPORTED_MODULE_1__.HeaderService
        ]
    })
], DashboardPageModule);



/***/ }),

/***/ 2858:
/*!*********************************************!*\
  !*** ./src/app/dashboard/dashboard.page.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DashboardPage": () => (/* binding */ DashboardPage)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! tslib */ 98806);
/* harmony import */ var _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_dashboard_page_html__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./dashboard.page.html */ 11604);
/* harmony import */ var _dashboard_page_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.page.scss */ 8754);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 14001);
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ionic/angular */ 78099);
/* harmony import */ var _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/module/module.service */ 27254);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 13252);
var DashboardPage_1;









let DashboardPage = DashboardPage_1 = class DashboardPage {
    constructor(router, navCtrl, menuCtrl, loadingCtrl, moduleService, 
    // private headerservice: HeaderService,
    popoverController, actionSheetController) {
        this.router = router;
        this.navCtrl = navCtrl;
        this.menuCtrl = menuCtrl;
        this.loadingCtrl = loadingCtrl;
        this.moduleService = moduleService;
        this.popoverController = popoverController;
        this.actionSheetController = actionSheetController;
        this.opportunities = [];
        this.projects = [];
        this.projectstasks = [];
        this.paments = [];
        this.salesorder = [];
        this.contact = [];
    }
    ngOnInit() {
        this.opportunitiesList();
        this.projectList();
        this.projecttaskList();
        this.pamentList();
        this.salesorderList();
        this.contactList();
        // this.showChart();
    }
    link1() {
        this.router.navigate(['/leads/Potentials']);
    }
    link2() {
        this.router.navigate(['/leads/Accounts']);
    }
    link3() {
        this.router.navigate(['/leads/PriceBooks']);
    }
    link4() {
        this.router.navigate(['/leads/Vendors']);
    }
    link5() {
        this.router.navigate(['/leads/Leads']);
    }
    link6() {
        this.router.navigate(['/leads/Contacts']);
    }
    opportunitiesList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Potentials',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.opportunities = this.data.result.records;
                return this.opportunities;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    projectList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Accounts',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.projects = this.data.result.records;
                return this.projects;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    projecttaskList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'PriceBooks',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.projectstasks = this.data.result.records;
                return this.projectstasks;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    pamentList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Vendors',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.paments = this.data.result.records;
                return this.paments;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    salesorderList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Leads',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.salesorder = this.data.result.records;
                return this.salesorder;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    contactList() {
        const loginData = JSON.parse(localStorage.getItem('logindata'));
        const session = localStorage.getItem('session');
        const options = this.moduleService.callHeader();
        const getServiceData = {
            url: loginData.url,
            session,
            module: 'Contacts',
            // record : this.id,
            operation: 'listModuleRecords',
        };
        this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
            this.data = res;
            console.log(this.data);
            if (this.data.success === true) {
                this.contact = this.data.result.records;
                return this.contact;
            }
            else {
                console.log(this.data.result.error);
            }
        }, (err) => {
            console.log(err);
        });
    }
    //  showChart() {
    //   console.log('tytytyty');
    //   // Another Chart Demo
    // //   var data = google.visualization.arrayToDataTable([
    // //     ['Task', 'Hours per Day'],
    // //     ['Work', 11],
    // //     ['Eat', 2],
    // //     ['Commute', 2],
    // //     ['Watch TV', 2],
    // //     ['Sleep', 7]
    // //   ]);
    // //   var options = {
    // //     title: 'My Daily Activities'
    // //   };
    // //   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    // //   chart.draw(data, options);
    // // }
    //   // Create the data table.
    //   var projects = new google.visualization.DataTable();
    //   projects.addColumn('string', 'Topping');
    //   projects.addColumn('number', 'Slices');
    //   projects.addRows([
    //     ['Mushrooms', 3],
    //     ['Onions', 1],
    //     ['Olives', 1],
    //     ['Zucchini', 1],
    //     ['Pepperoni', 2]
    //   ]);
    //   // Set chart options
    //   var options = {'title':'How Much Pizza I Ate Last Night',
    //                  };
    //   // Instantiate and draw our chart, passing in some options.
    //   var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    //   chart.draw(projects, options);
    // }
    presentActionSheet() {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            const actionSheet = yield this.actionSheetController.create({
                header: 'Notifications All',
                buttons: [
                    //   {
                    //   text: 'Notifications 1',
                    //   role: 'destructive',
                    //   icon: 'trash',
                    //   handler: () => {
                    //     console.log('Notifications 1 clicked');
                    //   }
                    // },
                    {
                        text: 'Notifications 1',
                        icon: 'share',
                        handler: () => {
                            console.log('Notifications 1 clicked');
                        }
                    },
                    {
                        text: 'Notifications 2',
                        icon: 'share',
                        handler: () => {
                            console.log('Notifications 2 clicked');
                        }
                    },
                    {
                        text: 'Notifications 3',
                        icon: 'share',
                        handler: () => {
                            console.log('Notifications 3 clicked');
                        }
                    },
                    // {
                    //   text: 'Play (open modal)',
                    //   icon: 'arrow-dropright-circle',
                    //   handler: () => {
                    //     console.log('Play clicked');
                    //   }
                    // }, 
                    // {
                    //   text: 'Favorite',
                    //   icon: 'heart',
                    //   handler: () => {
                    //     console.log('Favorite clicked');
                    //   }
                    // }, 
                    {
                        text: 'Cancel',
                        icon: 'close',
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }
                ]
            });
            yield actionSheet.present();
        });
    }
    presentPopover(ev) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__awaiter)(this, void 0, void 0, function* () {
            const popover = yield this.popoverController.create({
                component: DashboardPage_1,
                event: ev,
                translucent: true
            });
            return yield popover.present();
        });
    }
};
DashboardPage.ctorParameters = () => [
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_4__.Router },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.NavController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.MenuController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.LoadingController },
    { type: _services_module_module_service__WEBPACK_IMPORTED_MODULE_2__.ModuleService },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.PopoverController },
    { type: _ionic_angular__WEBPACK_IMPORTED_MODULE_5__.ActionSheetController }
];
DashboardPage = DashboardPage_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_3__.__decorate)([
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.Component)({
        selector: 'app-dashboard',
        template: _E_bizmobileapp_node_modules_ngtools_webpack_src_loaders_direct_resource_js_dashboard_page_html__WEBPACK_IMPORTED_MODULE_0__["default"],
        styles: [_dashboard_page_scss__WEBPACK_IMPORTED_MODULE_1__]
    })
], DashboardPage);



/***/ }),

/***/ 11604:
/*!**************************************************************************************************************!*\
  !*** ./node_modules/@ngtools/webpack/src/loaders/direct-resource.js!./src/app/dashboard/dashboard.page.html ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<ion-header>\r\n      <ion-toolbar color=\"primary\">\r\n         <ion-buttons slot=\"start\">\r\n            <ion-menu-button></ion-menu-button>\r\n         </ion-buttons>\r\n         <ion-title>\r\n            Dashboard\r\n         </ion-title>\r\n         <ion-icon name=\"pulse\" (click)=\"showChart()\" size=\"large\" slot=\"end\"></ion-icon>\r\n         <!-- <ion-button fill=\"clear\" size=\"small\" slot=\"end\" (click)=\"presentActionSheet()\">\r\n            <ion-icon ios=\"ios-notifications\" md=\"md-notifications\"></ion-icon>\r\n         </ion-button> -->\r\n         <ion-button routerLink=\"/profile\" fill=\"clear\"  size=\"small\" slot=\"end\">\r\n            <ion-icon ios=\"ios-person\" md=\"md-person\"></ion-icon>\r\n         </ion-button>\r\n      </ion-toolbar>\r\n   </ion-header>\r\n   <!--Rajesh Saha-->\r\n   <!-- <ion-toolbar>\r\n      <ion-searchbar></ion-searchbar>\r\n   </ion-toolbar> -->\r\n   <ion-content>\r\n         <ion-grid>\r\n               <ion-row>\r\n                     <ion-col>\r\n                       <div (click)=\"link1()\" *ngIf=\"opportunities\" class=\"title\"> <b style=\"color: coral;\">{{ opportunities.length }}</b> <br> Potentials</div>\r\n                     </ion-col>\r\n                     <ion-col>\r\n                       <div (click)=\"link2()\"*ngIf=\"projects\" class=\"title\"> <b style=\"color: blue;\">{{ projects.length }}</b> <br> Accounts</div>\r\n                     </ion-col>\r\n                   </ion-row>\r\n\r\n                   <ion-row>\r\n                     <ion-col>\r\n                       <div (click)=\"link3()\"*ngIf=\"paments\" class=\"title\"> <b style=\"color: brown;\">{{ paments.length }}</b> <br> PriceBooks</div>\r\n                     </ion-col>\r\n                     <ion-col>\r\n                       <div (click)=\"link4()\"*ngIf=\"projectstasks\" class=\"title\"> <b style=\"color: green;\">{{ projectstasks.length }}</b> <br> Vendors</div>\r\n                     </ion-col>\r\n                   </ion-row>\r\n\r\n                   <ion-row>\r\n                     <ion-col>\r\n                       <div (click)=\"link5()\"*ngIf=\"salesorder\" class=\"title\"> <b style=\"color: red;\">{{ salesorder.length }}</b> <br> Leads</div>\r\n                     </ion-col>\r\n                     <ion-col>\r\n                       <div (click)=\"link6()\"*ngIf=\"contact\" class=\"title\"> <b>{{ contact.length }}</b> <br> Contacts</div>\r\n                     </ion-col>\r\n                   </ion-row>\r\n               </ion-grid>\r\n\r\n\r\n      <!-- <ion-grid >\r\n          \r\n       <ion-row>\r\n         <ion-col size=\"12\" >\r\n            <h6>Graph Chart</h6>\r\n            <div id=\"chart_div\" align=\"center\" ></div>\r\n         </ion-col>\r\n      </ion-row>\r\n   </ion-grid> -->\r\n  </ion-content>\r\n  <!--Rajesh Saha-->");

/***/ }),

/***/ 8754:
/*!***********************************************!*\
  !*** ./src/app/dashboard/dashboard.page.scss ***!
  \***********************************************/
/***/ ((module) => {

module.exports = "ion-col > div {\n  background-color: #f7f7f7;\n  border: solid 1px #ddd;\n  padding: 10px;\n}\n\n.title {\n  font-size: 20px;\n}\n\n.title b {\n  font-size: 30px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EsYUFBQTtBQUNGOztBQU1BO0VBQ0UsZUFBQTtBQUhGOztBQUtBO0VBQ0UsZUFQUztBQUtYIiwiZmlsZSI6ImRhc2hib2FyZC5wYWdlLnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJpb24tY29sID4gZGl2IHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdmN2Y3O1xyXG4gIGJvcmRlcjogc29saWQgMXB4ICNkZGQ7XHJcbiAgcGFkZGluZzogMTBweDtcclxufVxyXG5cclxuLy8gc2NzcyBcclxuJGZvbnQtc2l6ZTozMHB4O1xyXG5cclxuXHJcbi50aXRsZXtcclxuICBmb250LXNpemU6ICRmb250LXNpemUgLSAxMDtcclxufVxyXG4udGl0bGUgYntcclxuICBmb250LXNpemU6ICRmb250LXNpemU7XHJcbn0iXX0= */";

/***/ })

}]);
//# sourceMappingURL=src_app_dashboard_dashboard_module_ts.js.map