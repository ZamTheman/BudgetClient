import { Injectable, OnInit } from '@angular/core';
import { Expense } from '../models/expense';
import { Subject } from 'rxjs/Subject';
import { ExpenseType } from '../models/expenseType';
import { Response } from '@angular/http';
import { ExpenseTypeService } from './expense-type.service';
import { MonthService } from './month.service';
import { Subscription } from 'rxjs/Subscription';
import { ExpenseFormComponent } from '../create-month/expense-form/expense-form.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';
import { HttpHeaders } from '@angular/common/http/src/headers';

@Injectable()
export class ExpensesService {
  expenseChanged = new Subject<Expense>();
  expensesChanged = new Subject<Expense[]>();
  addExpenseReturned = new Subject<number>();
  errorReturned = new Subject();
  expensesRequestSent = new Subject();
  monthChanged = new Subscription();
  expenses = new Array<Expense>();
  apiEndPoint: string;

  constructor(
    private httpClient: HttpClient,
    private expenseTypeService: ExpenseTypeService, 
    private monthService: MonthService,
    private appSettingsService: AppSettingsService
  ) { 
    this.monthChanged = this.monthService.dateChanged.subscribe(
      value => {
        this.getExpensesForMonth(value);
      });
    this.apiEndPoint = this.appSettingsService.apiEndpoint + "Expenses/";
  }

  getExpensesForMonth(date: Date){
    this.getData(date);
  }

  getExpensesForCurrentMonth(){
    this.getData();
  }

  private getData(date = new Date()){
    this.expensesRequestSent.next();
    this.requestExpensesForMonth(date).subscribe(
      data => {
        this.expenses = data;
        this.expensesChanged.next(data);
      },
      err => {
        this.errorReturned.next();
      }
    );
  }
  
  copyExpensesFromLastMonth(date: Date){
    this.requestExpensesForMonth(date).subscribe(
      data => {
        this.addExpensesToCopyToActiveMonth(date, data)
      }
    );
  }

  setActiveExpense(id: number){
    for(let i of this.expenses){
      if(i.id === id){
        this.expenseChanged.next(i);
        return;
      }    
    }
    this.expenseChanged.next(null);
  }

  addExpense(expense: Expense){
    this.requestAddExpense(expense);
  }

  updateExpense(expense: Expense){
    this.requestUpdateExpense(expense);
  }

  deleteExpense(id: number){
    this.requestDeleteExpense(id);
  }

  private addExpensesToCopyToActiveMonth(date: Date, expenses: Expense[]){
    let expensesToCopy = new Array();
    for(let i of expenses){
      if(i.copyWithAmount || i.copyWithoutAmount){
        i.date = new Date(date.getFullYear(), date.getMonth() +1, 2)
        if(i.copyWithoutAmount){
          i.amount = 0;
        }
        expensesToCopy.push(i);
      }
    }
    this.requestAddExpenses(expensesToCopy);
  }

  private requestAddExpense(expense: Expense){
    this.httpClient.post(this.apiEndPoint, expense)
    .subscribe(
      data => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestAddExpenses(expenses: Expense[]){
    this.httpClient.post(this.apiEndPoint + "multiple", expenses)
    .subscribe(
      data => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestUpdateExpense(expense: Expense){
    this.httpClient.put(this.apiEndPoint, expense)
    .subscribe(
      data => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestDeleteExpense(id: number){
    this.httpClient.delete(this.apiEndPoint + id)
      .subscribe(
        data => {
          this.addExpenseReturned.next(parseInt(data.toString()));
        }
      )
  }

  private requestExpensesForMonth(date: Date){
    const formatedDate = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-1";
    const paramsObject = new HttpParams().set(
      'startDate', formatedDate
    )
    return this.httpClient.get<Expense[]>(this.apiEndPoint, {
      params: paramsObject
    }) 
      .map(
        expenses => {
          this.addExpenseTypeToExpens(expenses);
          return expenses;
        }
      )
  }

  private addExpenseTypeToExpens(expenses: Expense[]): Expense[]{
    for(let i of expenses){
      i.expenseType = this.expenseTypeService.getExpenseTypeById(i.expenseType.id);
    }
    return expenses;
  }
}
