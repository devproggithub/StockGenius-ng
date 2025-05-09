import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router) {
      
     }

  ngOnInit(): void {
    localStorage.setItem("logged","false");
    $('body').css('background-image', 'url(../../assets/img/bg_login.jpg)');
    $('body').css('background-size', 'cover');
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    
  }

  login(){
    localStorage.setItem("logged","true");
  }
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe(
      response => {
        this.loading = false;
        console.log(response);
        localStorage.setItem("username",response.user.username)
        // Redirige vers la page d'accueil après connexion réussie
        // this.router.navigate(['/dashboard']);
        window.location.href="/dashboard";
      },
      error => {
        this.loading = false;
        if (error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Une erreur s\'est produite. Veuillez réessayer.';
        }
      }
    );
  }

}
