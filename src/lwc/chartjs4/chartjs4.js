/**
 * @description       :
 *
 * @author            : tak99
 * @group             :
 * @last modified on  : 2024-01-09
 * @last modified by  : tak99
 * Modifications Log
 * Ver     Date             Author               Modification
 * 1.0   2024-01-09   tak99   Initial Version
 */
import { LightningElement, api, track, wire} from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJS273'; // version 2.7.3
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

export default class Chartjs4 extends LightningElement {
    @track  ChartOptions = [];
    @track  selectedChartValue = 'line';
    @track  clickedButtonLabel;
    @track  chartValue;

    dataCount=1;
    recordId;
    mapChartBackgroundColor = new Map();

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            this.recordId = currentPageReference.attributes.recordId;
        }
    }

    connectedCallback() {
        this.mapChartBackgroundColor.set(1, 'rgb(255, 99, 132, 0.8)');   //red
        this.mapChartBackgroundColor.set(2, 'rgb(235, 111, 54, 0.8)');   //orange
        this.mapChartBackgroundColor.set(3, 'rgb(255, 205, 86, 0.8)');   //yellow
        this.mapChartBackgroundColor.set(4, 'rgb(75, 192, 192, 0.8)');   //lightgreen
        this.mapChartBackgroundColor.set(5, 'rgb(3, 145, 15, 0.8)');     //green
        this.mapChartBackgroundColor.set(6, 'rgb(54, 162, 235, 0.8)');   //blue
        this.mapChartBackgroundColor.set(7, 'rgb(163, 75, 192, 0.8)');   //purple
    }

    renderedCallback(){
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
            if(!this.chartValue){
                this.getChartOptions();
                const canvas = document.createElement('canvas');
                this.template.querySelector('div.chart').appendChild(canvas);
                const ctx = canvas.getContext('2d');
                this.chartValue = new Chart(ctx, this.chartData()); //this.config
                this.chartValue.canvas.parentNode.style.height = 'auto';
                this.chartValue.canvas.parentNode.style.width = 'auto';
            }
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

            // delete before Chart
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

    handleClick(event){
        this.clickedButtonLabel = event.target.label;
        console.log('this.clickedButtonLabel :: ' + this.clickedButtonLabel);

        if(this.clickedButtonLabel === 'add Chart'){
            this.dataCount = this.dataCount + 1;

            let listOfDataCount = [];
            let labelName = 'test' + this.dataCount;
            let bgColor = this.mapChartBackgroundColor;

            for(var i=0; i<7; i++){
                listOfDataCount.push(Math.floor((Math.random() * 300) + 1));
            }

            let newData = {
                label: labelName,
                backgroundColor: bgColor.get(this.dataCount),
                borderColor: bgColor.get(this.dataCount),
                fill: false,
                data: listOfDataCount,
            }

            if(this.chartValue){
                this.chartValue.data.datasets.push(newData);
                this.chartValue.update();
            }

        }
        if(this.clickedButtonLabel === 'delete Chart'){
            if(this.chartValue){
                this.chartValue.data.datasets.pop();
                this.chartValue.update();
                this.dataCount = this.dataCount - 1;
            }
        }
    }

    chartData(){
        let bgColor = this.mapChartBackgroundColor;

        let config = {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'test' +this.dataCount,
                    backgroundColor: bgColor.get(this.dataCount),
                    borderColor: bgColor.get(this.dataCount),
                    fill: false,
                    data: [10, 20, 30, 40, 100, 50, 150 ],
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Test'
                },
                scales: {
                    xAxes: [{
                        display: true,
              scaleLabel: {
                display: true,
                labelString: 'Date'
              },

                }],
                    yAxes: [{
                        display: true,
                        //type: 'logarithmic',
              scaleLabel: {
                                display: true,
                                labelString: 'Index Returns'
                            },
                            ticks: {
                                min: 0,
                                max: 500,

                                // forces step size to be 5 units
                                stepSize: 100
                            }
                    }]
                }
            }
        };
        return config;
    }
}