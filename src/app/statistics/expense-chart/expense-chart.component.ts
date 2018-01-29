import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ExpensesService } from '../../services/expenses.service';
import { SwedishCurrencyPipe } from '../../shared/swedish-currency.pipe';
import { Expense } from '../../models/expense';
import { MonthService } from '../../services/month.service';

@Component({
  selector: 'app-expense-chart',
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.css']
})
export class ExpenseChartComponent implements OnInit {
  expenses: {};
  expensesReceived: Subscription;
  adaptiveWidth: number;
  adaptiveHeight: number;
  
  constructor(
    private expensesService: ExpensesService, 
    private currencyPipe: SwedishCurrencyPipe,
    private monthService: MonthService) { }

  ngOnInit() {
    this.expensesReceived = this.expensesService.statisticsExpensesChanged.subscribe(
      data => {
        this.expenses = this.convertExpensesToDataSource(data)
      }
    )
    this.setChartWidth(window.innerWidth); 
  }

  customizeTooltip = (args: any) => {
    return {
        html: "<div class='state-tooltip'><h4><b>Utgift: </b>" +
        args.argument + "</br><b>Belopp: </b>" +
        this.currencyPipe.transform(args.value) + "</h4>"+ "</div>" + "</div>" + "</div>"
    };
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler (e) {
    let arg = e.target,
        item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    if(item.isVisible()) {
        item.hide();
    } else { 
        item.show();
    }
  }

  convertExpensesToDataSource(expenses: Expense[]){
    let datasource = new Array();
    for(let i of expenses){
      let unchanged = true;
      for(let j of datasource){
        if(i.expenseType.name == j.name){
          j.amount += i.amount;
          unchanged = false;
        }
      }
      if (unchanged){
        datasource.push({
          'amount': i.amount,
          'name': i.expenseType.name
        })
      }
    }
    return datasource;
  }

  resize(){
    this.setChartWidth(window.innerWidth); 
  }

  private setChartWidth(width: number){
    if (width < 700){
      this.adaptiveWidth = 300;
      this.adaptiveHeight = 600;
    } else {
      this.adaptiveWidth = 600;
      this.adaptiveHeight = 800;
    } 
  }
}