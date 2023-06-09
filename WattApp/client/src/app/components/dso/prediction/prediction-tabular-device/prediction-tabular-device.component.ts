import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExportToCsv } from 'export-to-csv';
import { Chart,registerables } from 'node_modules/chart.js'
import { WeekByDay } from 'src/app/models/devices.model';
import { Settlement } from 'src/app/models/users.model';
import { AuthService } from 'src/app/services/auth.service';
import { DevicesService } from 'src/app/services/devices.service';
import { HistoryPredictionService } from 'src/app/services/history-prediction.service';
@Component({
  selector: 'app-prediction-tabular-device',
  templateUrl: './prediction-tabular-device.component.html',
  styleUrls: ['./prediction-tabular-device.component.css']
})
export class PredictionTabularDeviceComponent {

  consumptionGraph:boolean = false;
  productionGraph:boolean = false;
  list1:WeekByDay[] = [];
  list2:WeekByDay[] = [];
  mergedList: { day: number, month: string, year: number, consumption: number, production: number }[] = [];
  datePipe: any;
  dateTime: any[] = [];

  constructor(private deviceService:HistoryPredictionService,private route:ActivatedRoute,private authService:AuthService) {
    
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.getDevice(id).subscribe(data=>{
      if(data.deviceCategory == "Electricity Consumer")
      {
        this.deviceService.predictionDevice(id).subscribe(consumption =>{
          this.list1 = consumption;
          this.dateTime = [];
              for (let i = 0; i < this.list1.length; i++) {
                const pad = (num: number): string => (num < 10 ? '0' + num : String(num));
                const formattedDay = `${pad(this.list1[i].day)}`;
                this.dateTime.push(formattedDay)
              }
          this.consumptionGraph = true;
        })
        
      }
      else{
        this.deviceService.predictionDevice(id).subscribe(production =>{
          this.list2 = production;
          this.dateTime = [];
              for (let i = 0; i < this.list2.length; i++) {
                const pad = (num: number): string => (num < 10 ? '0' + num : String(num));
                const formattedDay = `${pad(this.list2[i].day)}`;
                this.dateTime.push(formattedDay)
              }
          this.productionGraph = true;
        })
      }
    })
    
    
  }

  downloadCSV(): void {
    const deviceId = Number(this.route.snapshot.paramMap.get('id'));
    this.authService.getDevice(deviceId).subscribe(data=>{
      if(data.deviceCategory == "Electricity Consumer"){
          const options = {
          fieldSeparator: ',',
          filename: 'prediction-consumption-week',
          quoteStrings: '"',
          useBom : true,
          decimalSeparator: '.',
          showLabels: true,
          useTextFile: false,
          headers: ['Hour', 'Day', 'Month', 'Year', 'Consumption [kWh]', 'Production [kWh]']
        };
        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(this.list1);
      }
      else{
          const options = {
          fieldSeparator: ',',
          filename: 'prediction-production-week',
          quoteStrings: '"',
          useBom : true,
          decimalSeparator: '.',
          showLabels: true,
          useTextFile: false,
          headers: ['Hour', 'Month', 'Year', 'Consumption [kWh]', 'Production [kWh]']
        };
        const csvExporter = new ExportToCsv(options);
        const csvData = csvExporter.generateCsv(this.list2);
      }
    })
    } 
}
