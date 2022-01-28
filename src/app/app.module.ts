import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ModuleService } from './services/module/module.service';
import { HomeService } from './services/home/home.service';
import { AvatarModule } from 'ngx-avatar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { HttpConfigInterceptor } from './httpConfig.interceptor';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,  HttpClientModule,AvatarModule, BrowserAnimationsModule, ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
  
    HomeService,
    ModuleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
