import { Component, Input, OnInit } from '@angular/core';
import * as Chart from 'chart.js';
import { AdvertStatistics } from 'src/app/_models/advert';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() statistics: AdvertStatistics;
  @Input() refund: string;
  canvas:any; ctx:any;
  canvas2:any; ctx2:any;
  canvas3:any; ctx3:any;
  canvas4:any; ctx4:any;
  canvas5:any; ctx5:any;
  canvas6:any; ctx6:any;
  constructor() { }

  ngOnInit(): void {
    let chartColors = {
      red: 'rgb(255, 99, 132)',
      orange: 'rgb(255, 159, 64)',
      yellow: 'rgb(255, 205, 86)',
      green: 'rgb(75, 192, 192)',
      blue: 'rgb(54, 162, 235)',
      purple: 'rgb(153, 102, 255)',
      grey: 'rgb(201, 203, 207)'
    };
    this.canvas = document.getElementById('daily');
    this.canvas2 = document.getElementById('weekly');
    this.canvas3 = document.getElementById('monthly');
    this.canvas4 = document.getElementById('savings');
    this.canvas5 = document.getElementById('locationRequest');
    this.canvas6 = document.getElementById('deviceRequest');
    this.ctx = this.canvas.getContext('2d');
    this.ctx2 = this.canvas2.getContext('2d');
    this.ctx3 = this.canvas3.getContext('2d');
    this.ctx4 = this.canvas4.getContext('2d');
    this.ctx5 = this.canvas5.getContext('2d');
    this.ctx6 = this.canvas6.getContext('2d');
    
    var label = this.statistics.charts.dailyImpression.label
    var dataset = [
      {
        label: "Impressions",
        data: this.statistics.charts.dailyImpression.impression,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(164, 18, 89)',
        fill: false,
        borderColor: 'rgb(164, 18, 89)'
      },
      {
        label: "Website Visits",
        data: this.statistics.charts.dailyImpression.url,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(153, 102, 255)',
        fill: false,
        borderColor: 'rgb(153, 102, 255)'
      },
      {
        label: "Clicks",
        data: this.statistics.charts.dailyImpression.click,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(250, 166, 26)',
        fill: false,
        borderColor: 'rgb(250, 166, 26)'
      },
    ]
    const myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: label,
        datasets: dataset
      },
      options: {
        title: {
          display: true,
          text: 'Daily Impression Delivery'
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
          }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });
    myChart.canvas.parentNode.style.height = '400px';
    myChart.canvas.parentNode.style.width = '100%';

    var label2 = this.statistics.charts.weekImpression.label
    var dataset2 = [
      {
        label: "Impressions",
        data: this.statistics.charts.weekImpression.impression,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(164, 18, 89)',
        fill: false,
        borderColor: 'rgb(164, 18, 89)'
      },
      {
        label: "Website Visits",
        data: this.statistics.charts.weekImpression.url,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(153, 102, 255)',
        fill: false,
        borderColor: 'rgb(153, 102, 255)'
      },
      {
        label: "Clicks",
        data: this.statistics.charts.weekImpression.click,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(250, 166, 26)',
        fill: false,
        borderColor: 'rgb(250, 166, 26)'
      },
    ]
    const myChart2 = new Chart(this.ctx2, {    
      type: 'line',
      data: {
        labels: label2,
        datasets: dataset2
      },
      options: {
        title: {
          display: true,
          text: 'Weekly Impression Delivery'
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
          }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });
    myChart2.canvas.parentNode.style.height = '400px';
    myChart2.canvas.parentNode.style.width = '100%';
    
    var label3 = this.statistics.charts.monthlyImpression.label
    var dataset3 = [
      {
        label: "Impressions",
        data: this.statistics.charts.monthlyImpression.impression,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(164, 18, 89)',
        fill: false,
        borderColor: 'rgb(164, 18, 89)'
      },
      {
        label: "Website Visits",
        data: this.statistics.charts.monthlyImpression.url,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(153, 102, 255)',
        fill: false,
        borderColor: 'rgb(153, 102, 255)'
      },
      {
        label: "Clicks",
        data: this.statistics.charts.monthlyImpression.click,
        borderWidth: 1,
        pointBackgroundColor: 'rgb(250, 166, 26)',
        fill: false,
        borderColor: 'rgb(250, 166, 26)'
      },
    ]
    const myChart3 = new Chart(this.ctx3, {
      type: 'line',
      data: {
        labels: label3,
        datasets: dataset3
      },
      options: {
        title: {
          display: true,
          text: 'Monthly Impression Delivery'
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
            }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });
    myChart3.canvas.parentNode.style.height = '400px';
    myChart3.canvas.parentNode.style.width = '100%';

    const myChart4 = new Chart(this.ctx4, {
      
      type: 'line',
      data: {
        labels: this.statistics.charts.dailyGaiins.label,
        datasets: [{
          label: 'Savings',
          data: this.statistics.charts.dailyGaiins.data,
          backgroundColor: chartColors.blue,
          borderColor: chartColors.blue,
          fill:false,
          borderWidth: 1,
          lineTension: 1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Amount added to '+this.refund
        },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero:true,
        //       display: false
        //     }
        //   }]
        // }
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
              }
            }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });
    // myChart4.canvas.parentNode.style.height = '400px';
    // myChart4.canvas.parentNode.style.width = '100%';


    const myChart5 = new Chart(this.ctx5, {
      type: 'bar',
      data: {
        labels: this.statistics.charts.locationRequest.label,
        datasets: [{
          label: 'Users Per Location',
          data: this.statistics.charts.locationRequest.data,
          fill:false,
          borderWidth: 1,
          backgroundColor:this.statistics.charts.locationRequest.shade,
          lineTension:0.1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Percentage Users Per Location'
        },
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
            }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });

    const myChart6 = new Chart(this.ctx6, {
      type: 'bar',
      data: {
        labels: this.statistics.charts.deviceRequest.label,
        datasets: [{
          label: 'Available Devices',
          data: this.statistics.charts.deviceRequest.data,
          fill:false,
          borderWidth: 1,
          backgroundColor:this.statistics.charts.deviceRequest.shade,
          lineTension:0.1
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: 'Percentage of Available Devices'
        },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero:true,
        //       display: false
        //     }
        //   }]
        // }
        scales: {
          xAxes: [{
            ticks: {
              display: false
            }
            }]
        },
        maintainAspectRatio: false,
        legend: {
          display: true
        },
        display: true
      }
    });
  }

}
