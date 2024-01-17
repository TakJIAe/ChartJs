# Chart.js in Salesforce

### 참고 사이트
1. 공식 문서 <https://www.chartjs.org/>
2. https://www.avideep.com/chartjs-in-salesforce-lwc/
3. https://medium.com/@ishaarora_49656/add-dynamic-data-to-chart-in-lwc-9d88e8b4516e

<br>

### Setting
1. staticresource 코드 다운 (ver.2.7.3)
   * ver.2.8.0 은 동작 안되는 기능이 있었음 (차트 점에 마우스 올리면 숫자 표시되는 기능)
   * 버전마다 이슈가 있어서 사용 전 파악 필요
   * 링크 : <https://github.com/TakJIAe/ChartJs/blob/master/src/staticresource>
2. Org, Setup> StaticResource New 생성
   * File로 다운 받은 코드 선택
   * 설정된 Name으로 LWC에서 import됨

<br>
<br>


### 활용 예시
1. 서로 다른 레코드 비교 차트
   * Record 정보 가져와 차트 그리기
   * 차트 유형 변경
   * 링크 : <https://github.com/TakJIAe/ChartJs/tree/master/src/lwc/radarChart3>
     ![활용 예시 1](https://github.com/TakJIAe/ChartJs/assets/58765875/3b385be4-016d-403e-a940-3f2424cc728b)


<br>

2. 기본 동작 차트
   * 랜덤 데이터 생성/삭제
   * 차트 유형 변경
   * 링크 : <https://github.com/TakJIAe/ChartJs/tree/master/src/lwc/chartjs4>
     
     ![활용 예시 2](https://github.com/TakJIAe/ChartJs/assets/58765875/d73737d2-5666-443f-86a5-00ed72b9f197)
