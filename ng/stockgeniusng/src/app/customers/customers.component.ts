import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  added_at: string;
  added_by: number;
  customer_type:string;
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customerForm: FormGroup;
  submitted = false;
  errorMessage:any = '';

  customers: Customer[] = [];
  isLoading: boolean = false;
  error: string = '';
  
  // Pour DataTables
  dtOptions: any = {};
  private refreshSubscription: Subscription;
  
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private router: Router,
  ) { 
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      city: ['', Validators.required],
      address: ['', Validators.required],
      clientType: ['', Validators.required],
      added_date: [new Date().toISOString()]
    });
    // S'abonner aux notifications de rafraîchissement
    this.refreshSubscription = this.customerService.refreshList$
      .subscribe(refresh => {
        if (refresh) {
          this.loadCustomers();
        }
      });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // Getter pour accéder facilement aux champs du formulaire
  get f() { return this.customerForm.controls; }

  ngOnInit(): void {
    // this.initDataTable();
    this.loadCustomers();
    
  }

  addCustomer(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Si le formulaire est invalide, on s'arrête ici
    if (this.customerForm.invalid) {
      return;
    }

    // Préparer les données à envoyer à l'API
    const customerData = {
      name: this.f['name'].value,
      email: this.f['email'].value,
      phone: this.f['phone'].value,
      city: this.f['city'].value,
      address: this.f['address'].value,
      clientType:this.f['clientType'].value,
      added_date: this.f['added_date'].value
      // Le clientType n'est pas dans votre API, mais vous pouvez l'ajouter si nécessaire
    };

    this.customerService.createCustomer(customerData)
      .subscribe({
        next: (response) => {
          // Fermer la modal après succès
          // Réinitialiser le formulaire
          console.log(response);
          // Déclencher la mise à jour de la liste dans le composant parent
          this.customerService.triggerRefresh();
          this.customerForm.reset();
          this.submitted = false;
          // Émettre un événement ou appeler une méthode pour rafraîchir la liste des clients
          // Vous pouvez utiliser un EventEmitter si ce composant est un enfant
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Un client avec cet email existe déjà';
          } else if (error.status === 400) {
            this.errorMessage = 'Le nom et l\'email sont obligatoires';
          } else {
            this.errorMessage = 'Une erreur s\'est produite lors de la création du client';
          }
        }
      });
  }
  
  initDataTable(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      responsive: true,
      dom: 'Bfrtip',
      buttons: [
        'copy', 'csv', 'excel', 'pdf', 'print'
      ],
      language: {
        search: "Rechercher:",
        lengthMenu: "Afficher _MENU_ entrées",
        info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
        infoEmpty: "Affichage de 0 à 0 sur 0 entrées",
        infoFiltered: "(filtré à partir de _MAX_ entrées au total)",
        paginate: {
          first: "Premier",
          last: "Dernier",
          next: "Suivant",
          previous: "Précédent"
        }
      }
    };
  }

  loadCustomers(): void {
    this.isLoading = true;
    this.error = '';

    this.customerService.getCustomers().subscribe({
      next: (data: Customer[]) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des clients', err);
        this.error = 'Impossible de charger les clients. Veuillez réessayer plus tard.';
        this.isLoading = false;
        
        // Si l'erreur est 401, cela pourrait être un problème d'authentification
        if (err.status === 401) {
          this.error = 'Session expirée. Veuillez vous reconnecter.';
          // Rediriger vers la page de connexion si nécessaire
          // this.router.navigate(['/login']);
        }
      }
    });
  }

  // Formatage de la date pour l'affichage
  // formatDate(dateString: string): string {
  //   if (!dateString) return '-';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('fr-FR');
  // }
}
