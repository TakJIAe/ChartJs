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

export default class ScatterChart5 extends LightningElement {
    @track  chartValue;
    recordId;

    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if(currentPageReference){
            this.recordId = currentPageReference.attributes.recordId;
        }
    }

    renderedCallback(){
        Promise.all([loadScript(this, chartjs)])
        .then(() => {
            if(!this.chartValue){
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


    chartData(){
        let config = {
            type: 'scatter',
            data: {
                data:[{x:10,y:20},{x:15, y:10}]
            },
            options: {
                scales: {
                    xaxes:{
                        type: 'linear',
                        position: 'bottom'
                    }
                }
            }
        };
        return config;
    }
}