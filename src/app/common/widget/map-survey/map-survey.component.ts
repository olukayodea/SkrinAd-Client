import { Component, Input, OnInit } from '@angular/core';
import { SurveyStatistics } from 'src/app/_models/surveys';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-map-survey',
  templateUrl: './map-survey.component.html',
  styleUrls: ['./map-survey.component.css']
})
export class MapSurveyComponent implements OnInit {
  @Input() statistics: SurveyStatistics;
  canvas:any; ctx:any;
  canvas2:any; ctx2:any;

  loadingImpression = true;
  loadingBudget = true;

  constructor() { }

  ngOnInit(): void {
    let chartColors = [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ];

    let random = Math.floor(Math.random() * chartColors.length);

    this.canvas = document.getElementById('impression');
    this.canvas2 = document.getElementById('budget');
    this.ctx = this.canvas.getContext('2d');
    this.ctx2 = this.canvas2.getContext('2d');

    let impDataSet = {
      label: ["Used", "Unused"],
      data: [this.statistics.impression.used, this.statistics.impression.unused],
      shade: [chartColors[Math.floor(Math.random() * chartColors.length)], chartColors[Math.floor(Math.random() * chartColors.length)]]
    }

    new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: impDataSet.label,
        datasets: [{
          data: impDataSet.data,
          fill:false,
          borderWidth: 1,
          backgroundColor: impDataSet.shade,
          lineTension:0.1
        }]
      },
      options: {
        responsive: true
      }
    });
    this.loadingImpression = false;
    
    let budDataSet = {
      label: ["Used", "Unused"],
      data: [this.statistics.budget.used.amount, this.statistics.budget.unused.amount],
      shade: [chartColors[Math.floor(Math.random() * chartColors.length)], chartColors[Math.floor(Math.random() * chartColors.length)]]
    }

    new Chart(this.ctx2, {
      type: 'pie',
      data: {
        labels: budDataSet.label,
        datasets: [{
          data: budDataSet.data,
          fill:false,
          borderWidth: 1,
          backgroundColor: budDataSet.shade,
          lineTension:0.1
        }]
      },
      options: {
        responsive: true
      }
    });
    this.loadingBudget = false;
  }

}
