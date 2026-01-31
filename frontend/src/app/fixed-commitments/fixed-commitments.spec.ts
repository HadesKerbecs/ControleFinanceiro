import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedCommitments } from './fixed-commitments';

describe('FixedCommitments', () => {
  let component: FixedCommitments;
  let fixture: ComponentFixture<FixedCommitments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedCommitments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedCommitments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
