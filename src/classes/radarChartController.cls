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
    // Name, Id => combobox 에서 label, value 로 가져오기 위함
    @AuraEnabled(cacheable=true)
    public static List<cosmax_example__c> getDataNameList(String recordId){
        return[
                SELECT  Id, Name
                FROM    cosmax_example__c
                WHERE   Id != :recordId
        ];
    }

    @AuraEnabled(cacheable=true)
    public static cosmax_example__c getData(String recordId){
        return
        [
                SELECT  Id, Name, ProductGrade1__c, ProductGrade2__c, ProductGrade3__c, ProductGrade4__c, ProductGrade5__c
                FROM    cosmax_example__c
                WHERE   Id =: recordId
                LIMIT   1
        ];
    }

    @AuraEnabled(cacheable=true)
    public static cosmax_example__c getCompareData(String recordId){
        return
        [
                SELECT  Id, Name, ProductGrade1__c, ProductGrade2__c, ProductGrade3__c, ProductGrade4__c, ProductGrade5__c
                FROM    cosmax_example__c
                WHERE   Id =: recordId
                LIMIT   1
        ];
    }


    @AuraEnabled(cacheable=true)
    public static Map<String, String> getFieldLabelValueMap() {
        Map<String, String> fieldLabelValueMap = new Map<String, String>();

        // Get the SObjectType for the custom object
        SObjectType cosmaxObjectType = cosmax_example__c.sObjectType;

        // Describe the fields of the object
        Map<String, SObjectField> fieldMap = cosmaxObjectType.getDescribe().fields.getMap();

        System.debug('fieldMap :: ' + fieldMap);

        for(String fieldName : fieldMap.keySet()){
            System.debug('fieldName ' + fieldName);
            if(fieldName.contains('productgrade')){
                DescribeFieldResult fieldDescribe = fieldMap.get(fieldName).getDescribe();
                String fieldLabel = fieldDescribe.getLabel();

                fieldLabelValueMap.put(fieldLabel, fieldName);
                System.debug('fieldLabelMap :: ' +fieldLabelValueMap);
            }
        }
        return fieldLabelValueMap;

    }
}
