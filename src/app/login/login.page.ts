import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { HeaderService } from '../services/header/header.service';
import { ToastService } from '../services/toast/toast.service';
import { ModuleService } from '../services/module/module.service';

export class LoginDetails {
  url : string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;
  public loginDetails: LoginDetails;

  data: any;
  loginData = {};

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder, 
    private authservice : AuthService,
    private headerservice : ModuleService, 
    private toastService: ToastService, 
  ) {
    this.loginDetails = new LoginDetails();    
    if(localStorage.getItem('session') !== null){
      this.navCtrl.navigateRoot('/home');
    }
  }
  
  ngOnInit() {
    this.onLoginForm = this.formBuilder.group({
      'url': [null, Validators.compose([
        Validators.required
      ])],
      'username': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  ionViewWillEnter() {
      this.menuCtrl.enable(false);
  }
  authorizeLogin() {
    const options = this.headerservice.callHeader();
    this.authservice.login(this.loginData, options).subscribe(res => {
      this.data = res;
      if (this.data !== null) {
          if (this.data.success === true) {
            localStorage.setItem('logindata', JSON.stringify(this.loginData));
            localStorage.setItem('userdata', this.data.result.login);
            localStorage.setItem('session', this.data.result.login.session);
            localStorage.setItem('userid', this.data.result.login.userid);
            this.navCtrl.navigateRoot('/home');
            this.toastService.presentToast('Login Sucessfull');
          } else {
            this.toastService.presentToast('Username and password wrong');
          }
      }
       else {
          this.toastService.presentToast('Something Wrong');
      }
    }, (err) => {
       console.log(err);
    });
  }
}