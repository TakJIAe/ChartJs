# Chart.js in Salesforce

###참고 사이트
1. 공식 문서 <https://www.chartjs.org/>
2. https://www.avideep.com/chartjs-in-salesforce-lwc/
3. https://medium.com/@ishaarora_49656/add-dynamic-data-to-chart-in-lwc-9d88e8b4516e

<br>

### Setting
Org에 **Static Resource **추가 (ver.2.7.3)
  * staticresource 코드 다운 후 추가하면 됨.. 파일 올려두었음 ! 
  * ver.2.8.0 은 동작 안되는 기능이 있었음 (차트 점에 마우스 올리면 숫자 표시되는 기능)
  * 버전마다 이슈가 있어서 사용 전 파악 필요

<br>
<br>


### 활용 예시
1. 서로 다른 레코드 비교 차트
   * Record 정보 가져와 차트 그리기
   * 차트 유형 변경

     ![활용 예시 1](https://github.com/TakJIAe/ChartJs/assets/58765875/bd20a4ca-5028-4094-bbdf-5aa54c6e0574)

<br>

2. 기본 동작 차트
   * 랜덤 데이터 생성/삭제
   * 차트 유형 변경
   
     ![활용 예시 2](https://github.com/TakJIAe/ChartJs/assets/58765875/d73737d2-5666-443f-86a5-00ed72b9f197)
