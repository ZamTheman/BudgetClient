import { Injectable, OnInit } from '@angular/core';
import { Expense } from '../models/expense';
import { Subject } from 'rxjs/Subject';
import { ExpenseType } from '../models/expenseType';
// import { Http, Response } from '@angular/http';
import { Response } from '@angular/http';
import { ExpenseTypeService } from './expense-type.service';
import { MonthService } from './month.service';
import { Subscription } from 'rxjs/Subscription';
import { ExpenseFormComponent } from '../create-month/expense-form/expense-form.component';
import { HttpClient } from '@angular/common/http';
import { AppSettingsService } from './app-settings.service';

@Injectable()
export class ExpensesService {
  expenseChanged = new Subject<Expense>();
  expensesChanged = new Subject<Expense[]>();
  addExpenseReturned = new Subject<number>();
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
    this.requestExpensesForMonth(date).subscribe(
      (data) => {
        this.expenses = data;
        this.expensesChanged.next(data);
      }
    );
  }
  
  copyExpensesFromLastMonth(date: Date){
    this.requestExpensesForMonth(date).subscribe(
      (data) => {
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
      (data) => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestAddExpenses(expenses: Expense[]){
    this.httpClient.post(this.apiEndPoint + "multiple", expenses)
    .subscribe(
      (data) => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestUpdateExpense(expense: Expense){
    this.httpClient.put(this.apiEndPoint, expense)
    .subscribe(
      (data) => {
        this.addExpenseReturned.next(parseInt(data.toString()));
      }
    )
  }

  private requestDeleteExpense(id: number){
    this.httpClient.delete(this.apiEndPoint + id)
      .subscribe(
        (data) => {
          this.addExpenseReturned.next(parseInt(data.toString()));
        }
      )
  }

  private requestExpensesForMonth(date: Date){
    let formatedDate = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-1";
    return this.httpClient.get<Expense[]>(this.apiEndPoint + formatedDate)
      .map(
        (expenses) => {
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