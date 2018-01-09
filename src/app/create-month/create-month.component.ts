import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSortable } from '@angular/material'
import { ExpensesService } from '../services/expenses.service';
import { Expense } from '../models/expense';
import { Subscription } from 'rxjs/Subscription';
import { MonthService } from '../services/month.service';
import { ExpenseTypeService } from '../services/expense-type.service';
import { Salary } from '../models/salary';
import { SalaryService } from '../services/salary.service';

@Component({
  selector: 'app-create-month',
  templateUrl: './create-month.component.html',
  styleUrls: ['./create-month.component.css']
})
export class CreateMonthComponent implements OnInit, OnDestroy {
  displayedColumns = ["expenseType", "amount", "comment", "split", "date"];
  dataSource = new MatTableDataSource;
  expenseExpanded: boolean;
  expensesChanged: Subscription;
  responseReceived: Subscription;
  salariesChanged: Subscription;
  awaitingRespons: boolean;
  awaitingOnMessage: string;
  summaryTotal: number;
  summaryTotalMarie: number;
  summaryTotalSamuel: number;
  summarySamuelToMarie: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  constructor(
    private expensesService: ExpensesService, 
    private monthService: MonthService,
    private expenseTypeService: ExpenseTypeService,
    private salaryService: SalaryService) { }

  ngOnInit() {
    this.expensesChanged = this.expensesService.expensesChanged.subscribe(
      value => {
        this.dataSource = new MatTableDataSource(this.convertExpenseArrayForTableView(value));
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.calculateSummary(this.salaryService.getActiveSalary(), this.expensesService.expenses)
      }
    )

    this.salariesChanged = this.salaryService.salaryChanged.subscribe(
      () => this.calculateSummary(this.salaryService.getActiveSalary(), this.expensesService.expenses)
    )

    this.responseReceived = this.expensesService.addExpenseReturned.subscribe(
      value => {
        this.expensesService.getExpensesForMonth(this.monthService.activeDate);
      }
    )

    this.expenseTypeService.getExpenseTypes();
    this.expenseTypeService.testValue = 2;
    this.monthService.activeMonthChanged(new Date());
    this.awaitingRespons = false;
    this.awaitingOnMessage = "";
    this.summaryTotal = this.summaryTotalMarie = this.summaryTotalSamuel = this.summarySamuelToMarie = 0;
    this.expenseExpanded = false;
  }

  getCopiedExpenses(){
    this.expensesService.copyExpensesFromLastMonth(new Date(this.monthService.activeDate.getFullYear(), this.monthService.activeDate.getMonth() -1, 1))
  }
  
  ngOnDestroy(): void {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  expenseSelected(id: number) {
    this.expensesService.setActiveExpense(id);
    this.expenseExpanded = true;
  }

  private convertExpenseArrayForTableView(expenses: Expense[]){
    let matTableList = new Array();
    for(let item of expenses){
      matTableList.push({
        'expenseType': item.expenseType.name,
        'amount': item.amount,
        'split': item.split,
        'comment': item.comment,
        'date': item.date,
        'id': item.id
      })
    }
    return matTableList;
  }

  private calculateSummary(salary: Salary, expenses: Expense[]){
    if(salary.incomeMarie === 0 || salary.incomeSamuel === 0){
      this.summaryTotal = "";
      this.summaryTotalMarie = "";
      this.summaryTotalSamuel = "";
      this.summarySamuelToMarie = "";
      return;
    }
    let totMarie = 0;
    let totSamuel = 0;
    let samuelToMarie = 0;
    let samuelAlreadyPaid = 0;
    let total = 0;
    let splitMarie = salary.incomeMarie / (salary.incomeMarie + salary.incomeSamuel);
    let splitSamuel = salary.incomeSamuel / (salary.incomeMarie + salary.incomeSamuel); 
    for(let item of expenses)
    {
      let amount = item.amount;
      total += amount;
      switch (item.split)
      {
          case "Bägge":
          case "Marie Autogiro":
          case "Betalt av Marie, ska delas":
              totMarie += item.amount * splitMarie;
              totSamuel += item.amount * splitSamuel;
              break;
          case "Bara Marie":
              totMarie += item.amount;
              break;
          case "Bara Samuel":
              totSamuel += item.amount;
              break;
          case "Samuel Autogiro":
          case "Betalt av Samuel, ska delas":
              totMarie += item.amount * splitMarie;
              totSamuel += item.amount * splitSamuel;
              samuelAlreadyPaid += item.amount;
              break;
          case "Överföring Marie till Samuel":
              totMarie += item.amount;
              samuelAlreadyPaid += item.amount;
              break;
          case "Överföring Samuel till Marie":
              totSamuel += item.amount;
              break;
          default:
              break;
          }
    }
    samuelToMarie = totSamuel - samuelAlreadyPaid;
    this.summaryTotal = total;
    this.summaryTotalMarie = totMarie;
    this.summaryTotalSamuel = totSamuel;
    this.summarySamuelToMarie = samuelToMarie;
  }
}