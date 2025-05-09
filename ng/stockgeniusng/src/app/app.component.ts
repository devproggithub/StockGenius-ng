import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'stock-genius-ng';

  constructor() { }
  logged:any="false";
  username:any;
  ngOnInit(): void {
    
    this.logged = localStorage.getItem("auth_token");
    console.log(this.logged);
    this.username= localStorage.getItem("username");
  }
  logout(){
    localStorage.removeItem("auth_token");
  }
}
