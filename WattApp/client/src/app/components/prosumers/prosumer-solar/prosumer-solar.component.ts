import { Component, NgModule } from '@angular/core';
import { first } from 'rxjs';
import { HistoryPredictionService } from 'src/app/services/history-prediction.service';
import { JwtToken } from 'src/app/utilities/jwt-token';
import { NgxGaugeModule } from 'ngx-gauge';

@Component({
  selector: 'app-prosumer-solar',
  templateUrl: './prosumer-solar.component.html',
  styleUrls: ['./prosumer-solar.component.css']

})

export class ProsumerSolarComponent {

  idProsumer?: number;
  
enableThresholds: boolean = false;
value: number = 0.00;
thick: number = 5;

type: any = "full";
cap: any = "round";
label: string = "solar power now";
prepend: any = '';
append: any = 'kWh';
min: number = 0;
max: number = 10000;
foregroundColor: string = '#8394FE';
backgroundColor: string = '#8394FE';

enableMarkers: boolean = false;


markerConfig = {
    "3000": { color: '#blue', size: 8, label: '30', type: 'line'},
    "7000": { color: '#yellow', size: 8, label: '60', type: 'line'},
    "10000": { color: '#red', size: 8, label: '100', type: 'line'},
}


showNewGauge = false;



constructor(private todayConsumption:HistoryPredictionService){

}
ngOnInit() {
  let token=new JwtToken();
  this.idProsumer=token.data.id as number;
  
  this.todayConsumption.getTotalConsumptionProductionProsumer(1,this.idProsumer).subscribe(result=>{
    this.value = result;
    if(this.value>999.99)
    {
      this.value=parseFloat((this.value*0.001).toFixed(2))
      this.append=" MWh"
      if(this.value>999.99)
      {
        this.value=parseFloat((this.value*0.001).toFixed(2))
        this.append=" GWh"
      }
    }
  })
}
}
