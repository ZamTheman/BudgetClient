import { Injectable } from '@angular/core';
import { Salary } from '../models/salary';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SalaryService {
  activeSalary: Salary;
  apiEndpoint: string;
  salaryChanged = new Subject();

  constructor(
    private httpClient: HttpClient,
    private appSettingsService: AppSettingsService
  ) { 
    this.apiEndpoint = this.appSettingsService.apiEndpoint + "Salaries/";
    this.activeSalary = new Salary(null, 0, 0);
  }

  getActiveSalary(){
    return this.activeSalary;
  }

  getSalariesForMonth(date: Date){
    this.requestGetSalaryForMonth(date);
  }

  addSalary(salary: Salary){
    this.requestAddSalary(salary);
  }

  updateSalary(salary: Salary){
    this.requestUpdateSalary(salary);
  }

  private requestGetSalaryForMonth(date: Date){
    let formatedDate = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-1";
    this.httpClient.get<Salary>(this.apiEndpoint + formatedDate)
    .subscribe(
      (data) => {
        if(data !== null){
          this.activeSalary = data;
          this.salaryChanged.next();
        }
      }
    )
  }

  private requestAddSalary(salary: Salary){
    this.httpClient.post(this.apiEndpoint, salary)
    .subscribe(
      () => {
        this.requestGetSalaryForMonth(salary.date)
      }
    )
  }

  private requestUpdateSalary(salary: Salary){
    this.httpClient.put(this.apiEndpoint, salary)
    .subscribe(
      () => {
        this.requestGetSalaryForMonth(salary.date)
      }
    )
  }
}
