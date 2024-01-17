/**
 * @description       :
 *
 * @author            : tak99
 * @group             :
 * @last modified on  : 2024-01-03
 * @last modified by  : tak99
 * Modifications Log
 * Ver     Date             Author               Modification
 * 1.0   2024-01-03   tak99   Initial Version
 */
public with sharing class radarChartController {
    @AuraEnabled(cacheable=true)
    public static List<ChartJs__c> getDataNameList(String recordId){
        return[
                SELECT  Id, Name
                FROM    ChartJs__c
                WHERE   Id != :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static ChartJs__c getData(String recordId){
        return
        [
                SELECT  Id, Name, ProductGrade1__c, ProductGrade2__c, ProductGrade3__c, ProductGrade4__c, ProductGrade5__c
                FROM    ChartJs__c
                WHERE   Id =: recordId
                LIMIT   1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static ChartJs__c getCompareData(String recordId){
        return
        [
                SELECT  Id, Name, ProductGrade1__c, ProductGrade2__c, ProductGrade3__c, ProductGrade4__c, ProductGrade5__c
                FROM    ChartJs__c
                WHERE   Id =: recordId
                LIMIT   1
        ];
    }

}
