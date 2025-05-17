import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Subscription } from 'rxjs';
//import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  //@ViewChild(DataTableDirective, { static: false })
  //dtElement: DataTableDirective;
  //dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  products: any[] = [];
  categories: any[] = [];
  zones: any[] = [];
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Pour le formulaire
  productForm: FormGroup;
  submitted = false;
  isEditMode = false;
  currentProductId: number | null = null;
  
  // Pour les modals
  productToDelete: any = null;
  selectedProduct: any = null;
  
  // Pour les souscriptions
  private refreshSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      designation: ['', Validators.required],
      description: [''],
      category_id: ['', Validators.required],
      min_threshold: ['', [Validators.required, Validators.min(0)]],
      max_threshold: ['', [Validators.required, Validators.min(0)]],
      rfid_tag: [''],
      zone_id: ['', Validators.required],
      initial_quantity: ['', [Validators.required, Validators.min(0)]]
    });
    // S'abonner aux mises à jour
    this.refreshSubscription = this.productService.refreshList$.subscribe(refresh => {
      if (refresh) {
        this.loadProducts();
      }
    });
   }

  ngOnInit(): void {
    this.loadCategories();
    this.loadZones();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    this.dtTrigger.unsubscribe();
  }


  // Chargement des données
  loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (data:any) => {
        this.categories = data;
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des catégories', err);
      }
    });
  }

  loadZones(): void {
    this.productService.getAllZones().subscribe({
      next: (data:any) => {
        this.zones = data;
      },
      error: (err:any) => {
        console.error('Erreur lors du chargement des zones', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des produits', err);
        this.errorMessage = 'Impossible de charger les produits. Veuillez réessayer plus tard.';
        this.isLoading = false;
      }
    });
  }

  // Getter pour accéder facilement aux contrôles du formulaire
  get f() { return this.productForm.controls; }

  // Gestion des produits (CRUD)
  addOrUpdateProduct(): void {
    this.submitted = true;
    this.errorMessage = '';
    
    if (this.productForm.invalid) {
      return;
    }
    
    const productData = this.productForm.value;
    
    if (this.isEditMode && this.currentProductId) {
      // Mode édition
      this.productService.updateProduct(this.currentProductId, productData).subscribe({
        next: (response) => {
          this.successMessage = 'Produit mis à jour avec succès';
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
          this.closeModal('modal-right');
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du produit', err);
          this.errorMessage = 'Erreur lors de la mise à jour du produit.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 7000);
        }
      });
    } else {
      // Mode ajout
      this.productService.createProduct(productData).subscribe({
        next: (response) => {
          this.successMessage = 'Produit ajouté avec succès';
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
          this.closeModal('modal-right');
          this.resetForm();
        },
        error: (err) => {
          console.error('Erreur lors de l\'ajout du produit', err);
          this.errorMessage = 'Erreur lors de l\'ajout du produit.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 7000);
        }
      });
    }
  }

  editProduct(product: any): void {
    this.isEditMode = true;
    this.currentProductId = product.id;
    
    // Remplir le formulaire avec les données du produit
    this.productForm.patchValue({
      designation: product.designation,
      description: product.description || '',
      category_id: product.category_id,
      min_threshold: product.min_threshold,
      max_threshold: product.max_threshold,
      rfid_tag: product.rfid_tag || '',
      zone_id: product.zone_id || '',
      initial_quantity: product.current_quantity || 0
    });
    
    // Ouvrir le modal
    this.openModal('modal-right');
  }

  viewProduct(product: any): void {
    this.selectedProduct = product;
    this.openModal('modal-view');
  }

  confirmDelete(product: any): void {
    this.productToDelete = product;
    this.openModal('modal-delete');
  }

  deleteProduct(): void {
    console.log(this.productToDelete);
    
    if (this.productToDelete && this.productToDelete.id) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Produit supprimé avec succès';
          setTimeout(() => {
            this.successMessage = '';
          }, 5000);
          this.closeModal('modal-delete');
          this.productToDelete = null;
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du produit', err);
          this.errorMessage = 'Erreur lors de la suppression du produit.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 7000);
        }
      });
    }
  }

  // Méthodes utilitaires
  resetForm(): void {
    this.submitted = false;
    this.isEditMode = false;
    this.currentProductId = null;
    this.productForm.reset();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Inconnu';
  }

  getZoneName(zoneId: number): string {
    const zone = this.zones.find(z => z.id === zoneId);
    return zone ? zone.name : 'Inconnue';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  // Méthodes de gestion des modals
  openModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');
    }
  }

  closeModal(id: string): void {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }

    // Réinitialiser le formulaire si on ferme le modal d'ajout/édition
    if (id === 'modal-right') {
      this.resetForm();
    }
  }
}