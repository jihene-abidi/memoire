import { Component } from '@angular/core';
import { StatsSectionConstants } from '../accueil.constants';

@Component({
  selector: 'app-stats-section',
  standalone: true,
  imports: [],
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.css'],
})
export class StatsSectionComponent {
  statsSectionConstants = StatsSectionConstants;
  statItem1Value: number = 0;
  statItem2Value: number = 0;
  statItem3Value: number = 0;

  targetStatItem1Value = 100;
  targetStatItem2Value = 200;
  targetStatItem3Value = 300;

  incrementSpeed = 30;

  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    this.observeSectionVisibility();
  }

  observeSectionVisibility() {
    const sectionElement = document.querySelector('.stats');

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateStats();
          if (this.observer) {
            this.observer.disconnect();
          }
        }
      });
    }, {
      threshold: 0.5
    });

    if (sectionElement && this.observer) {
      this.observer.observe(sectionElement);
    }
  }

  animateStats() {
    const interval1 = setInterval(() => {
      if (this.statItem1Value < this.targetStatItem1Value) {
        this.statItem1Value++;
      } else {
        clearInterval(interval1);
      }
    }, this.incrementSpeed);

    const interval2 = setInterval(() => {
      if (this.statItem2Value < this.targetStatItem2Value) {
        this.statItem2Value++;
      } else {
        clearInterval(interval2);
      }
    }, this.incrementSpeed);

    const interval3 = setInterval(() => {
      if (this.statItem3Value < this.targetStatItem3Value) {
        this.statItem3Value++;
      } else {
        clearInterval(interval3);
      }
    }, this.incrementSpeed);
  }
}
