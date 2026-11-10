import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Erp } from './erp';

describe('Erp', () => {
  let component: Erp;
  let fixture: ComponentFixture<Erp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Erp],
    }).compileComponents();

    fixture = TestBed.createComponent(Erp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
