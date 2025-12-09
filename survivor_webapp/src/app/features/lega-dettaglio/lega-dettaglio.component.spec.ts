import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegaDettaglioComponent } from './lega-dettaglio.component';

describe('LegaDettaglioComponent', () => {
  let component: LegaDettaglioComponent;
  let fixture: ComponentFixture<LegaDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegaDettaglioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegaDettaglioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
