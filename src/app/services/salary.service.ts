import { Injectable } from '@angular/core';
import { Salary } from '../models/salary';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MonthService } from './month.service';

@Injectable()
export class SalaryService {
  activeSalary: Salary;
  apiEndpoint: string;
  salaryChanged = new Subject();
  statisticsMonthChanged = new Subscription();
  salariesReceived = new Subject<Salary[]>();

  constructor(
    private httpClient: HttpClient,
    private appSettingsService: AppSettingsService,
    private monthService: MonthService) {
    this.apiEndpoint = this.appSettingsService.apiEndpoint + 'Salaries';
    this.activeSalary = new Salary(null, 0, 0);
  }

  getActiveSalary() {
    return this.activeSalary;
  }

  getSalaries(date: Date) {
    this.requestSalaries(date);
  }

  getSalariesForMonth(date: Date) {
    this.requestGetSalaryForMonth(date);
  }

  requestSalariesForYear(date: Date) {
    this.requestSalaries(date) ;
  }

  addSalary(salary: Salary) {
    this.requestAddSalary(salary);
  }

  updateSalary(salary: Salary) {
    this.requestUpdateSalary(salary);
  }

  private requestGetSalaryForMonth(date: Date) {
    const startDate = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-1';
    const endDateAsDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const endDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + endDateAsDate.getDate();
    const paramsObject = {
      'startDate': startDate,
      'endDate': endDate
    };
    this.httpClient.get<Salary[]>(this.apiEndpoint, { params: paramsObject })
    .subscribe(
      data => {
        if (data !== null || data.length === 0) {
          this.activeSalary = data[0];
          this.salaryChanged.next();
        }
      }
    );
  }

  private requestSalaries(date: Date) {
    const startDate = date.getFullYear() + '-1-1';
    const endDate = date.getFullYear() + '-12-31';
    const paramsObject = {
      'startDate': startDate,
      'endDate': endDate
    }

    this.httpClient.get<Salary[]>(this.apiEndpoint, { params: paramsObject }).subscribe(
      salaries => this.salariesReceived.next(salaries));
  }

  private requestAddSalary(salary: Salary) {
    this.httpClient.post(this.apiEndpoint, salary)
    .subscribe(
      () => this.requestGetSalaryForMonth(salary.date)
    );
  }

  private requestUpdateSalary(salary: Salary) {
    this.httpClient.put(this.apiEndpoint, salary)
    .subscribe(
      () => this.requestGetSalaryForMonth(salary.date)
    );
  }
}
