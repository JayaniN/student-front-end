import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentComponent } from './student/student.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { EditService } from "./edit.service";
import { GraphQLModule } from './graphql.module';
import { DialogsModule } from '@progress/kendo-angular-dialog';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { MatDialogModule } from '@angular/material/dialog';
import { UploadsModule } from '@progress/kendo-angular-upload';
import { APP_BASE_HREF } from '@angular/common';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NotifierModule } from 'angular-notifier';
import { NotificationModule } from '@progress/kendo-angular-notification';

const config: SocketIoConfig = { url: "http://localhost:3001", options: {} };

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GridModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    GraphQLModule,
    DialogsModule,
    ButtonsModule,
    MatDialogModule,
    UploadsModule,
    SocketIoModule.forRoot(config),
    NotificationModule
  ],
  providers: [
    {
      deps: [HttpClient],
      provide: EditService,
      useFactory: (jsonp: HttpClient) => () => new EditService(jsonp),
    },
    { provide: APP_BASE_HREF, useValue: "/" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
