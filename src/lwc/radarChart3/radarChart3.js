/**
 * @description       :
 *
 * @author            : tak99
 * @group             :
 * @last modified on  : 2024-01-05
 * @last modified by  : tak99
 * Modifications Log
 * Ver     Date             Author               Modification
 * 1.0   2024-01-05   tak99   Initial Version
 */
import { LightningElement, api, track, wire} from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';

import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getData from '@salesforce/apex/radarChartController.getData';
import getDataNameList from '@salesforce/apex/radarChartController.getDataNameList';
import getCompareData from '@salesforce/apex/radarChartController.getCompareData';

export default class RadarChart3 extends LightningElement {
    @api recordId;
    @track DataNameList =[];
    DataNameValue = '';
    @track chartValue;

    renderedCallback(){
        console.log('renderedCallback :: ');
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
            if(!this.chartValue) {
                // for init chartValue
                console.log('renderedCallback 1 ');
                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chartValue = new Chart(ctx, this.chartDataset()); //this.config
                this.chartValue.canvas.parentNode.style.height = 'auto';
                this.chartValue.canvas.parentNode.style.width = '500px';

            } else {
                console.log('renderedCallback 2 ');

//                this.chartValue.data = this.chartDataset().data();
//                this.chartValue.update();
            }

//              원래 코드
//            const canvas = document.createElement('canvas');
//            this.template.querySelector('div.chart').appendChild(canvas);
//            const ctx = canvas.getContext('2d');
//            this.chartValue = new Chart(ctx, this.chartDataset()); //this.config
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading Chart',
                    message: error.message,
                    variant: 'error',
                })
            );
        });
    }

    // Name List 가져오기
    @wire(getDataNameList, {recordId : '$recordId'})
    wiredDataNameList({error, data}){
        let options = [];
        options.push({label: '--None--', value: ''});
        if(data){
            this.error = undefined;
            for(let i = 0; i<data.length; i++){
                if(data[i].Name != null){
                    options.push({
                        label: data[i].Name,
                        value: data[i].Id,
                    });
                }
            }
            this.DataNameList = options;
        } else if (error){
            console.log(error);
            this.error = error;
        }
    }


    // 현재 recordId Data set
    @wire(getData, {recordId : '$recordId'})
    wiredGetData({error, data}){
        if(data){
            let listLabel = [];
            let listOfDataCount = [];
            let dataName = '';
            let mapData = new Map();

            dataName = data.Name;
            mapData.set('커버력', data.ProductGrade1__c);
            mapData.set('밀착력', data.ProductGrade2__c);
            mapData.set('다크닝', data.ProductGrade3__c);
            mapData.set('지속력', data.ProductGrade4__c);
            mapData.set('글로우', data.ProductGrade5__c);

            mapData.forEach(function (value, key, map) {
                listLabel.push(key); // data.labels
                listOfDataCount.push(mapData.get(key)); //data.datasets.data
            });

            if(listLabel.length > 0 && listOfDataCount.length > 0 && dataName != null){
                let config = this.chartDataset(listLabel, dataName, listOfDataCount);
                this.chartValue.data = config.data;
                this.chartValue.update();
            }
        } else if(error){
            console.log(' 3 error :: ' + JSON.stringify(error));
        }
    }

    handleChangeProduct(event){
        let DataNameValue = event.detail.value;
        console.log('DataNAmeVlaue : ' + DataNameValue);
        if(DataNameValue != null && DataNameValue != '' && DataNameValue != undefined){
            this.DataNameValue = DataNameValue;
            this.wiredCompareData;
        }
        else{
            console.log('None일때');
            this.resetChartData();
        }
    }

    resetChartData(){
        console.log('start');
        if(this.chartValue){
            console.log('this.chartValue :: ' + this.chartValue);
            this.chartValue.data.datasets.pop();
            this.chartValue.update();
        } else{
            console.log('else :: ');
        }
    }

    @wire(getCompareData, {recordId : '$DataNameValue'})
    wiredCompareData({error, data}){
        if(data){
//            console.log('3 wiredCompareData :: ' + JSON.stringify(data));
            let listLabel = [];
            let listOfDataCount = [];
            let dataName = '';
            let mapData = new Map();

            dataName = data.Name;
            mapData.set('커버력', data.ProductGrade1__c);
            mapData.set('밀착력', data.ProductGrade2__c);
            mapData.set('다크닝', data.ProductGrade3__c);
            mapData.set('지속력', data.ProductGrade4__c);
            mapData.set('글로우', data.ProductGrade5__c);

            mapData.forEach(function (value, key, map) {
                listLabel.push(key); // data.labels
                listOfDataCount.push(mapData.get(key)); //data.datasets.data
            });

            let newData = {
                label: dataName,
                backgroundColor: 'rgb(54, 162, 235, 0.8)',
                borderColor: 'rgb(54, 162, 235, 0.8)',
                fill: true,
                data: listOfDataCount,
            }

            if(this.chartValue){
                console.log('this.chartValue ');
                console.log('this chartValue :: ',this.chartValue);
                this.chartValue.data.datasets.push(newData);
                this.chartValue.update();
            }

        } else if(error){
            console.log('error :: ' + error);
        }
    }

    chartDataset(label, name, data){
        let config = {
            type: 'radar',
            data: {
                labels: label,
                datasets: [{
                    label: name,
                    data: data,
                    fill: true,
                    backgroundColor: 'rgb(255, 99, 132, 0.8)',
                    borderColor: 'rgb(255, 99, 132, 0.8)',
                    pointBackgroundColor: 'rgb(255, 99, 132)',
                    pointBorderColor: 'rgb(255, 99, 132)',
                    pointHoverBackgroundColor: 'rgb(255, 99, 132)',
                    pointHoverBorderColor: 'rgb(255, 99, 132)'
                }]
            }
//            ,options: {
//                responsive: true,
//                legend: {
//                position: 'right'
//                },
//                }
            }
        return config;
    }

}