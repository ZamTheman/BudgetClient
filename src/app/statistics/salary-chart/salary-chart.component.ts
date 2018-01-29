import { Component, OnInit } from '@angular/core';
import { SalaryService } from '../../services/salary.service';
import { Salary } from '../../models/salary';
import { Subscription } from 'rxjs/Subscription';
import { SwedishCurrencyPipe } from '../../shared/swedish-currency.pipe';
import { MonthService } from '../../services/month.service';

@Component({
  selector: 'app-salary-chart',
  templateUrl: './salary-chart.component.html',
  styleUrls: ['./salary-chart.component.css']
})

export class SalaryChartComponent implements OnInit {
  adaptiveWidth: number;
  adaptiveHeight: number;
  dataSource = new Array;
  salariesReceived: Subscription;

  constructor(
    private salaryService: SalaryService, 
    private monthService: MonthService, 
    private currencyPipe: SwedishCurrencyPipe) { }

  ngOnInit() {
    this.salariesReceived = this.salaryService.salariesReceived.subscribe(
      data => this.dataSource = this.convertSalariesToDataSource(data)
    )
    this.setChartWidth(window.innerWidth); 
  }

  resize(){
    this.setChartWidth(window.innerWidth); 
  }

  customizeTooltip = (args: any) => {
    return {
        html: "<div class='state-tooltip'><h4><b>Datum: </b>" +
        args.argument + "</br><b>Inkomst: </b>" +
        this.currencyPipe.transform(args.value) + "</h4>"+ "</div>" + "</div>" + "</div>"
    };
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

  private convertSalariesToDataSource(salaries: Salary[]){
    let dataSource = new Array();
    for(let i of salaries){
      dataSource.push(
        { 
          'date': i.date.toString().substring(0,10),
          'incomeMarie': i.incomeMarie,
          'incomeSamuel': i.incomeSamuel
        }
      )
    }
    return dataSource;
  }
}
