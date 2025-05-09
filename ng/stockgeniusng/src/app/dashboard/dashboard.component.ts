import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    image = $('#changingImage');
    images = [
      '../../assets/img/porte_rfid_detect.png',
      '../../assets/img/porte_rfid.png'
    ];
    minInterval = 2000; // 2 seconds
    maxInterval = 8000; // 8 seconds
    
    currentIndex: number = 0;
    timer: any;
  constructor() { }

  ngOnInit(): void {
    if(localStorage.getItem("logged")=="true"){
      $('body').css('background-image', 'url(../../assets/img/bg_login.jpg)');
      $('body').css('background-size', 'cover');
      $('#content-wrapper').css('background-color', 'rgb(236 239 243 / 0%) !important;');
    }
    this.changeImage();
    document.addEventListener('DOMContentLoaded', function() {
      const counter:any = document.getElementById('counter');
      const numFormat = new Intl.NumberFormat('fr-FR');
      let animationId:any;
      
      // Fonction d'animation optimisée
      function animateCounter(target:any, duration:any) {
          // Annuler l'animation précédente si elle existe
          cancelAnimationFrame(animationId);
          
          const start = parseInt(counter.value.replace(/\s/g, '')) || 0;
          const diff = target - start;
          const startTime = performance.now();
          
          function updateCounter(currentTime:any) {
              const elapsedTime = currentTime - startTime;
              
              if (elapsedTime < duration) {
                  const progress = elapsedTime / duration;
                  const currentVal = Math.floor(start + diff * progress);
                  counter.value = numFormat.format(currentVal);
                  animationId = requestAnimationFrame(updateCounter);
              } else {
                  counter.value = numFormat.format(target);
              }
          }
          
          animationId = requestAnimationFrame(updateCounter);
      }
      
      // Délégation d'événements pour tous les boutons avec attributs data
      document.querySelectorAll('button[data-value]').forEach(btn => {
          btn.addEventListener('click', function() {
              const val = 10;
              const dur = 500;
              animateCounter(val, dur);
          });
      });
      
      // Gestionnaire pour le bouton personnalisé
      (<any>document.getElementById('custom')).addEventListener('click', function() {
          const val = prompt("Valeur cible:", "50000") as any;
          if(val !== null && !isNaN(val)) {
              animateCounter(parseInt(val), 2000);
          }
      });
  });
  }
  changeImage() {
    // Annuler le timer précédent si existant
    if (this.timer) {
      clearTimeout(this.timer);
    }
    
    // Définir un délai fixe de 10 secondes
    const delay = 10000; // 10 secondes en millisecondes
    if(this.images[this.currentIndex].indexOf("detect")>-1){
      this.updateWarningElement();
      setTimeout(() => {
        this.updateDangerElement();
      }, 2000);
    }
    // Mettre en place le nouveau timer
    this.timer = setTimeout(() => {
      // Passer à l'image suivante (avec boucle)
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
      
      // En Angular, il est préférable d'utiliser des approches déclaratives
      // plutôt que de manipuler directement le DOM comme avec jQuery
      
      // La source d'image sera mise à jour automatiquement dans le template
      // via la liaison de données
      
      // Programmer le prochain changement
      this.changeImage();
      
    }, delay);
  }

  updateWarningElement() {
      // Sélectionner le premier élément avec la classe bg-warning-light
      const targetElement: HTMLElement | null = document.querySelector('.bg-warning-light');
      
      if (!targetElement) {
        console.log('Aucun élément avec la classe bg-warning-light n\'a été trouvé');
        return;
      }

      console.log('Début du clignotement...');
      setTimeout(() => {
        targetElement.classList.remove('bg-warning-light');
      }, 2000);
      // Ajouter la classe d'animation
      targetElement.classList.add('warning-blink-animation');
      
      // Après la fin de l'animation (20 * 0.5s = 10s)
      setTimeout(() => {
        // Retirer la classe d'animation
        targetElement.classList.remove('warning-blink-animation');
        
        // Appliquer la transformation finale
        targetElement.classList.remove('bg-warning-light');
        targetElement.classList.add('bg-warning');
        targetElement.classList.add('hover-effect');
        // targetElement.classList.add('warning-final-state');
        
        console.log('Clignotement terminé. Classes bg-warning et hover-effect appliquées.');
      }, 10000); // 20 cycles * 0.5s par cycle = 10s
  }


  updateDangerElement() {
    // Sélectionner tous les éléments avec la classe bg-warning
    const elements: NodeListOf<HTMLElement> = document.querySelectorAll('.bg-warning');
    
    // Vérifier si des éléments ont été trouvés
    if (elements.length === 0) {
      console.log('Aucun élément avec la classe bg-warning n\'a été trouvé');
      return;
    }
    console.log(elements);
    
    // Sélectionner le dernier élément dans la liste
    const targetElement: HTMLElement = elements[elements.length - 4];
    
    console.log('Début du clignotement rouge...');
    setTimeout(() => {
      targetElement.classList.remove('bg-warning');
    }, 2000);
    
    // Ajouter la classe d'animation de clignotement rouge
    targetElement.classList.add('danger-blink-animation');
    
    // Après la fin de l'animation (20 * 0.5s = 10s)
    setTimeout(() => {
      // Retirer la classe d'animation
      targetElement.classList.remove('danger-blink-animation');
      
      // Appliquer la transformation finale
      targetElement.classList.remove('bg-warning');
      targetElement.classList.remove('hover-effect'); // Supprimer hover-effect si présent
      targetElement.classList.add('bg-warning-light');
      
      console.log('Clignotement terminé. Classe bg-warning-light appliquée (élément marqué comme vide).');
    }, 10000); // 20 cycles * 0.5s par cycle = 10s
  }
}
