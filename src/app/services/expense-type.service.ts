import { Injectable } from '@angular/core';
import { ExpenseType } from '../models/expenseType';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ExpenseTypeService {
  expenseTypes: ExpenseType[];
  apiEndpoint: string;
  expenseTypesChanged = new Subject();
  testValue: number;

  constructor(
    private httpClient: HttpClient,
    private appSettingsService: AppSettingsService
  ) { 
      this.apiEndpoint = this.appSettingsService.apiEndpoint + "ExpenseTypes/";
      this.getExpenseTypes();
    }

  getExpenseTypes(){
    if(this.expenseTypes !== undefined){
      return this.expenseTypes.slice();
    }
    this.requestGetExpenseTypes();
  }

  getExpenseTypeById(id: number){
    for(let i of this.expenseTypes){
      if(i.id === id){
        return i;
      }    
    }
  }

  addExpenseType(expenseType: ExpenseType){
    this.requestAddExpenseType(expenseType);
  }

  private requestGetExpenseTypes(){
    this.httpClient.get<ExpenseType[]>(this.apiEndpoint).subscribe(
      (data) => {
        this.expenseTypes = data;
        this.expenseTypesChanged.next();
      }
    )
  }

  private requestAddExpenseType(expenseType: ExpenseType){
    this.httpClient.post(this.apiEndpoint, expenseType).subscribe(
      () => this.requestGetExpenseTypes()
    )
  }
}
