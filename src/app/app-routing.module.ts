import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { HomeComponent } from './home/home.component';
import { CreateMonthComponent } from './create-month/create-month.component';

const appRoutes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'createMonth', component: CreateMonthComponent },
    { path: 'home', component: HomeComponent },
  ]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule{

}