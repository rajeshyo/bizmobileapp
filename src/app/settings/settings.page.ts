import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { ThemeService } from '../services/theme/theme.service';

const themes = {
  autumn: {
    primary: '#1C2760',
    secondary: '#4D9078',
    tertiary: '#B4436C',
    light: '#eef1f8',
    medium: '#FCD0A2',
    dark: '#080808'
  },
  night: {
    primary: '#454545',
    secondary: '#FCFF6C',
    tertiary: '#FE5F55',
    medium: '#BCC2C7',
    dark: '#080808',
    light: '#d0d0d1'
  },
  neon: {
    primary: '#689F38',
    secondary: '#4CE0B3',
    tertiary: '#FF5E79',
    light: '#d2e4c1',
    medium: '#B682A5',
    dark: '#080808'
  }
};

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private navCntr: NavController,
    private theme: ThemeService
  ) { }

  changeTheme(name) {
    this.theme.setTheme(themes[name]);
  }

  // changeSpeed(val) {
  //   this.theme.setVariable('--speed', `${val}ms`);
  // }
  ngOnInit() {
  }

  logout(){
    localStorage.clear();
    this.navCntr.navigateRoot('/login');
  }

}
