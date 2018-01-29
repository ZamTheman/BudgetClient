import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { CreateMonthComponent } from './create-month/create-month.component';
import { StatisticsComponent } from './statistics/statistics.component';

const appRoutes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'createMonth', component: CreateMonthComponent },
    { path: 'statistics', component: StatisticsComponent,
        children:[
            { path: '', component: StatisticsComponent },
            { path: 'expenses', component: StatisticsComponent },
            { path: 'salaries', component: StatisticsComponent },
        ] },
    { path: 'home', component: HomeComponent },
  ]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule{

}