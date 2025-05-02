import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';


// Début du bloc de tests pour le LoginComponent
describe('LoginComponent', () => {
  let component: LoginComponent; // Instance du composant à tester
  let fixture: ComponentFixture<LoginComponent>; // Permet de manipuler le DOM et de créer le composant dans un environnement de test

  // Avant chaque test, configure le module de test
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent] // Utilise LoginComponent comme composant autonome
    })
    .compileComponents();
    // Création de l'instance du composant dans un environnement de test
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    // Déclenche le cycle de détection de changements Angular
    fixture.detectChanges();
  });

  // Test unitaire de base : vérifie que le composant est bien créé
  it('should create', () => {
    expect(component).toBeTruthy(); // Le composant doit exister (non null, défini)
  });
});
