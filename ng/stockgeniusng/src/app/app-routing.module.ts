import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { RfidReadingsComponent } from './rfid-readings/rfid-readings.component';

const routes: Routes = [
  {path:'', redirectTo:'signin', pathMatch:'full' },
  {
    path: 'signin' ,
    component: LoginComponent
  },
  {
    path: 'dashboard' ,
    component: DashboardComponent
  },{
    path: 'customers' ,
    component: CustomersComponent
  },{
    path: 'products' ,
    component: ProductsComponent
  },{
    path: 'orders' ,
    component: OrdersComponent
  },{
    path: 'predictions' ,
    component: PredictionsComponent
  },{
    path: 'rfid-readings' ,
    component: RfidReadingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
