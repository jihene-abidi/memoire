import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';


// Déclaration d'un bloc de test pour le composant SignupComponent
describe('SignupComponent', () => {
  // Déclaration des variables pour le composant et son environnement de test
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  // Avant chaque test, on configure le module de test Angular
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupComponent]
    })
    .compileComponents(); //Compile les composants HTML et CSS
    
    // Création d'une instance du composant dans un environnement de test
    fixture = TestBed.createComponent(SignupComponent);
    // Récupère l'instance réelle du composant
    component = fixture.componentInstance;
    // Déclenche la détection des changements pour que le DOM soit mis à jour
    fixture.detectChanges();
  });

  // Premier test : vérifier que le composant a bien été créé
  it('should create', () => {
    // Vérifie que le composant existe (est "truthy")
    expect(component).toBeTruthy();
  });
});
