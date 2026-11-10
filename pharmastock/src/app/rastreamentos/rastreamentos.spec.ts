import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Rastreamentos } from './rastreamentos';

describe('Rastreamentos', () => {
  let component: Rastreamentos;
  let fixture: ComponentFixture<Rastreamentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rastreamentos],
    }).compileComponents();

    fixture = TestBed.createComponent(Rastreamentos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
