import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrelationGraphComponent } from './correlation-graph.component';

describe('CorrelationGraphComponent', () => {
  let component: CorrelationGraphComponent;
  let fixture: ComponentFixture<CorrelationGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorrelationGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrelationGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
