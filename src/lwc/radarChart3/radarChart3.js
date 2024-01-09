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
//import chartjs from '@salesforce/resourceUrl/ChartJs'; // version 2.8.0
import chartjs from '@salesforce/resourceUrl/chartJS273'; // version 2.7.3
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

import getData from '@salesforce/apex/radarChartController.getData';
import getDataNameList from '@salesforce/apex/radarChartController.getDataNameList';
import getCompareData from '@salesforce/apex/radarChartController.getCompareData';

export default class RadarChart3 extends LightningElement {

    @track DataNameList = [];
    @track ChartOptions = [];
    selectedChartValue = 'radar';
    DataNameValue = '';
    @track chartValue;
    recordId;

    Target=false;
    compareTarget=false;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            this.recordId = currentPageReference.attributes.recordId;
        }
    }

    renderedCallback(){
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
            if(!this.chartValue) {
                // for init chartValue
                this.getChartOptions();
                this.getDataNameList();
                this.getData();

                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chartValue = new Chart(ctx, this.chartDataset()); //this.config
                this.chartValue.canvas.parentNode.style.height = 'auto';
                this.chartValue.canvas.parentNode.style.width = 'auto';

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

    getChartOptions(){
        let options = [];
        options.push({label:'line',value:'line'});
        options.push({label:'bar',value:'bar'});
        options.push({label:'radar',value:'radar'});
        options.push({label:'doughnut',value:'doughnut'});
        options.push({label:'pie',value:'pie'});
//        options.push({label:'bubble',value:'bubble'});
//        options.push({label:'scatter',value:'scatter'});
        this.ChartOptions = options;
    }

    handleChangeOptions(event){
        let changeOptions = event.detail.value;
        if(changeOptions != null && changeOptions != '' && changeOptions != undefined){
            this.selectedChartValue = changeOptions;

            if(this.chartValue){
                this.chartValue.destroy();
            }

            // create Chart
            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').innerHTML = ''; // add Clear the chart container(dom)
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            if(this.selectedChartValue != null && this.selectedChartValue != ''){
                this.chartValue = new Chart(ctx, {
                    type: this.selectedChartValue,
                    data: this.chartValue.data
                });
            }
            this.chartValue.update();
        }

    }

    getDataNameList(){
        getDataNameList({
            recordId : this.recordId
        }).then(data => {
            if(data){
                let options = [];
                options.push({label: '--None--', value: ''});

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
            }
        })
    }

    getData(){
        getData({
            recordId : this.recordId
        }).then(data =>{

            console.log('getData :: ' + this.selectedChartValue);
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
                this.Target = true;
            }
        }).catch((error) => {
            console.log('getTest error :: ' , error);
        });
    }


    handleChangeProduct(event){
        let DataNameValue = event.detail.value;

        if(this.DataNameValue != null && this.DataNameValue != '' && !(this.DataNameValue === DataNameValue)){
            this.DataNameValue = DataNameValue;
            if(this.chartValue){
                this.chartValue.data.datasets.pop();
                this.chartValue.update();
                this.getCompareData();
            }
        }
        else if(DataNameValue != null && DataNameValue != '' && DataNameValue != undefined && this.Target){
            this.DataNameValue = DataNameValue;
            this.getCompareData();
        }
        else if(this.compareTarget && this.Target){
            this.resetChartData();
            this.compareTarget = false;
        }
    }

    resetChartData(){
        if(this.chartValue){
            this.chartValue.data.datasets.pop();
            this.chartValue.update();
            this.compareTarget = false;
        }
    }

    getCompareData(){
        getCompareData({
            recordId : this.DataNameValue
        }).then(data=>{
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

                let newData = {
                    label: dataName,
                    backgroundColor: 'rgb(54, 162, 235, 0.8)',
                    borderColor: 'rgb(54, 162, 235, 0.8)',
                    fill: true,
                    data: listOfDataCount,
                }

                if(this.chartValue){
                    this.chartValue.data.datasets.push(newData);
                    this.chartValue.update();
                    this.compareTarget = true;
                }
            }

        }).catch((error) => {
            console.log('error :: ' , error);
        });
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

                    }]
                },
                options: {
                    title:{
                        display:true
                    },
                    responsive: true,
                    legend: { position: 'right'},
                    scale:{
                        ticks: {
                            beginAtZero: true,
                            min:1,
                            max:5,
                            stepSize: 0.5
                        }
                    }
                }
            }

        return config;
    }

}