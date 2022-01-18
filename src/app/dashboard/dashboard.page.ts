import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { ModuleService } from '../services/module/module.service';
// import { HeaderService } from '../services/header/header.service';
import { count } from 'rxjs/operators';

declare var google;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

 data: any;
  opportunities = [];
  projects = [];
  projectstasks = [];
  paments = [];
  salesorder = [];
  contact = [];
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private moduleService: ModuleService,
    // private headerservice: HeaderService,
    public popoverController: PopoverController, 
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.opportunitiesList();
    this.projectList();
    this.projecttaskList();
    this.pamentList();
    this.salesorderList();
    this.contactList();
    // this.showChart();
  }

  opportunitiesList() {
      const loginData = JSON.parse(localStorage.getItem('logindata'));
      const session = localStorage.getItem('session');
      const options = this.moduleService.callHeader();
      const getServiceData = {
        url : loginData.url,
        session,
        module : 'Potentials',
        // record : this.id,
       operation: 'listModuleRecords',
      };

      this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
        this.data = res;
        console.log(this.data);
        if (this.data.success === true) {
          this.opportunities = this.data.result.records;
          return this.opportunities;
        } else {
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
      url : loginData.url,
      session,
      module : 'Accounts',
       // record : this.id,
       operation: 'listModuleRecords',
    };

    this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
      this.data = res;
      console.log(this.data);
      if (this.data.success === true) {
        this.projects = this.data.result.records;
        return this.projects;
      } else {
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
    url : loginData.url,
    session,
    module : 'PriceBooks',
     // record : this.id,
     operation: 'listModuleRecords',
  };

  this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
    this.data = res;
    console.log(this.data);
    if (this.data.success === true) {
      this.projectstasks = this.data.result.records;
      return this.projectstasks;
    } else {
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
    url : loginData.url,
    session,
    module : 'Vendors',
     // record : this.id,
     operation: 'listModuleRecords',
  };

  this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
    this.data = res;
    console.log(this.data);
    if (this.data.success === true) {
      this.paments = this.data.result.records;
      return this.paments;
    } else {
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
    url : loginData.url,
    session,
    module : 'Payment',
     // record : this.id,
     operation: 'listModuleRecords',
  };

  this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
    this.data = res;
    console.log(this.data);
    if (this.data.success === true) {
      this.salesorder = this.data.result.records;
      return this.salesorder;
    } else {
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
    url : loginData.url,
    session,
    module : 'Contacts',
     // record : this.id,
     operation: 'listModuleRecords',
  };

  this.moduleService.getservicesListSync(getServiceData).subscribe(res => {
    this.data = res;
    console.log(this.data);
    if (this.data.success === true) {
      this.contact = this.data.result.records;
      return this.contact;
    } else {
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
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
    await actionSheet.present();
  }


  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: DashboardPage,
      event: ev,
      translucent: true
    });
    return await popover.present();
  }
}