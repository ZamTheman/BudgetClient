import { AppSettingsService } from './services/app-settings.service'
export function init_app(appSettingsService: AppSettingsService, expenseTypeService: ExpenseTypeService ){
  // Load Config service before loading other components / services
  return () => {
    return appSettingsService.loadSettings();
  };
}

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatPaginatorModule, MatTooltipModule, MatProgressSpinnerModule } from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { CreateMonthComponent } from './create-month/create-month.component';
import { ExpenseFormComponent } from './create-month/expense-form/expense-form.component';
import { MonthFormComponent } from './create-month/month-form/month-form.component';
import { SalaryFormComponent } from './create-month/salary-form/salary-form.component';
import { ExpenseTypeFormComponent } from './create-month/expense-type-form/expense-type-form.component';

import { ExpenseTypeService } from './services/expense-type.service';
import { ExpensesService } from './services/expenses.service';
import { SalaryService } from './services/salary.service';
import { MonthService } from './services/month.service';
import { SplitsService } from './services/splits.service';
import { HttpClientModule } from '@angular/common/http';
import { SwedishCurrencyPipe } from './shared/swedish-currency.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    CreateMonthComponent,
    ExpenseFormComponent,
    MonthFormComponent,
    SalaryFormComponent,
    ExpenseTypeFormComponent,
    SwedishCurrencyPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    HttpClientModule
  ],
  providers: [
    AppSettingsService,
    {
      'provide': APP_INITIALIZER,
      'useFactory': init_app,
      'deps': [AppSettingsService],
      'multi': true,
    },
    AppComponent, 
    MonthService, 
    ExpenseTypeService, 
    ExpensesService,
    SalaryService, 
    SplitsService,
    AppSettingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
