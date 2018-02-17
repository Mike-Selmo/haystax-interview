import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { UserRegComponent } from './userreg/userreg.component'
import { UserLoginComponent } from './userlogin/userlogin.component'
import { CommonService } from './common/common.service'
import { MatButtonModule, MatCheckboxModule, MatCardModule} from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
    UserRegComponent,
    UserLoginComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatButtonModule, 
    MatCheckboxModule,
    MatCardModule
  ],
  providers: [CommonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
