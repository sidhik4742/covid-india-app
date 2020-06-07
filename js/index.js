$(document).ready(function(){

const url_covidStatus = 'https://api.rootnet.in/covid19-in/stats/latest';
const url_covidTest = 'https://api.rootnet.in/covid19-in/stats/testing/latest';
const url_covidMediCollage = 'https://api.rootnet.in/covid19-in/hospitals/medical-colleges';
const url_covidAvailableBed = 'https://api.rootnet.in/covid19-in/hospitals/beds';
const url_covidContact = 'https://api.rootnet.in/covid19-in/contacts';
const url_covidNotification = 'https://api.rootnet.in/covid19-in/notifications'

var data_covidStatus ={};
var data_covidTest ={};
var data_covidMediCollage ={};
var data_covidAvailableBed ={};
var data_covidContact ={};
var data_covidNotification ={};
var sateName =[];
var stateNameCases = [];
let medicalCollage =[];
var tableClearingFlag =false;
// var stateName_number;
// let state_totalCase;


// randomNum.forEach(function(item){
//     console.log(item+"\n");
// });
   

 getCovidData();
 

    //**********************stateWise information passes to app.html-card,chart,*********** */
    function stateWise_information(selectedState){
        let stateName_number = (sateName.indexOf(selectedState));
        let state_totalCase = data_covidStatus.data.regional[stateName_number].totalConfirmed;
        let state_discharged = data_covidStatus.data.regional[stateName_number].discharged;
        let state_deaths = data_covidStatus.data.regional[stateName_number].deaths;
        let state_activeCases = (state_totalCase-(state_discharged+state_deaths));
        let contact_information = (data_covidContact.data.contacts.regional);
        let medicalCollages_informations = (data_covidMediCollage.data.medicalColleges);
        
        let contact_number ={};
        contact_information.forEach(function(item, index, array){
            if(item.loc ===selectedState){
                contact_number = item;  
            }
        //    console.log(index+":"+item.loc);
        });
        // console.log("contact_number"+":"+contact_number.number);
        //********state name  Andaman and Nicobar Islands in medicalcollage is A & N Islands***************/
        if(selectedState ==="Andaman and Nicobar Islands"){
            selectedState = "A & N Islands";
        }
        medicalCollages_informations.forEach(function(item, index, array){
            if(item.state === selectedState){
                 medicalCollage.push({hospitalName:item.name,city:item.city,ownership:item.ownership});
            }
        });
        //  console.log(medicalCollage);
         
        //*******************************Add Table with covid information's***************** */
       
        var chartData_state =[];
        chartData_state.push(state_totalCase,state_activeCases,state_discharged,state_deaths);
        // console.log(chartData_state);
        

        document.getElementById("totalCases").innerHTML = state_totalCase;
        document.getElementById("activeCases").innerHTML = state_activeCases;
        document.getElementById("discharged").innerHTML = state_discharged;
        document.getElementById("deaths").innerHTML = state_deaths;
        
        addData_stateCases(myChart, chartData_state);
        chartData_state.length =0;

        //var additionalDetailsID = document.getElementById("additionalDetails");
        var additionalDetailsClass = document.getElementById("additionalDetails").querySelectorAll(".additionalDetails");
        console.log(additionalDetailsClass[0]);
        additionalDetailsClass[0].style.display = "contents"
       
        document.getElementById("stateName").innerHTML = "State :"+ selectedState;
        document.getElementById("contactNumber").innerHTML = "Contact Number :"+ contact_number.number;
        let table = document.getElementById("tableDetails");
        var row = table.insertRow(0);
        table.classList.add("bg-color");
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        cell0.innerHTML = "Medical Collages";
        cell1.innerHTML = "City";
        cell2.innerHTML = "OwnerShip";
        medicalCollage.forEach(function(item, index, array){
            // console.log(item);
             row = table.insertRow(index+1);
             cell0 = row.insertCell(0);
             cell1 = row.insertCell(1);
             cell2 = row.insertCell(2);
             cell0.innerHTML = item.hospitalName;
             cell1.innerHTML = item.city;
             cell2.innerHTML = item.ownership;
            //  console.log(index);
        });
        // console.log(table);
        medicalCollage.length =0;
        tableClearingFlag =true;
        // let thead = table.createTHead();
        // thead.setAttribute("id", "thead");
        // let row = thead.insertRow(0);
        // thead.appendChild(row);
        // let th = document.createElement("th");
        // row.appendChild(th);
        // let td = document.createElement("td");
        // th.appendChild(td);
        // var hospital = document.createTextNode("MedicalCollage");
        // td.appendChild(hospital);
        // document.getElementById("thead").appendChild(row);
        // console.log(table);  

        // console.log(contact_information);
    }
    //**********************Genarate random number array**************** */
    function randomNum_genaretor(){
        var randomNum =[];
        for(var counter =1;counter<=20;counter++){
            randomNum.push(Math.floor((Math.random() * 35) + 1));
        }
        return randomNum;
    }
    //**********************Genarate random rgba array****************// */
    function rgbColor(){  
        var  rgbaArray =[]; 
        for(var rgba_counter =0;rgba_counter<35;rgba_counter++){
            var o = Math.round, r = Math.random, s = 255;
            rgbaArray.push( 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')');
        }
        return rgbaArray;
    }
    /////************************Chart************************///// */
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Total Cases','Active','Discharged','Deaths'],
            datasets: [{
                label: 'StateWise Cases',
                data: [],
                backgroundColor: rgbColor(),
                borderColor: rgbColor(),
                borderWidth: 5,
                order: 2
               },{
                label: 'Total Cases',
                data:[],
                backgroundColor: rgbColor(),
                borderColor: rgbColor(),
                borderWidth: 5,
                type: 'line',
                order: 1
               }]
        },
        options: {
            responsive: true,
            maintainAspectRatio:false,
            title:{
                display: true,
                text: ' Covid-19 INDIA (Total Cases/StateWise Cases) '
            },
            legend:{
                display: true,
                position: 'top',
                align: 'end'
            },
            scales: {
                yAxes: [{
                    stacked:true,
                    gridLines:{
                        display: false
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes:[{
                    gridLines:{
                        display:false
                    }
                }]

            }
        }
    });
    function addData_stateCases(myChart, chartData_state,) {
        for(var i=0;i<chartData_state.length;i++){
            myChart.data.datasets[0].data[i] = chartData_state[i];
        }    
        myChart.update();
    }
    function addData_totalCases(myChart,chartData_india) {
        for(var i=0;i<chartData_india.length;i++){
            myChart.data.datasets[1].data[i] = chartData_india[i];
        }    
        myChart.update();
    }
    function clearingaTable(){
        let table = document.getElementById("tableDetails");
        let tableRows = document.getElementsByTagName("tr");
        var rowCount = tableRows.length;
        console.log(tableRows);
        while (table.firstChild){
            table.removeChild(table.firstChild);
        }
        console.log(table);
    }

 
async function getCovidData(){
    const data_covidStatustemp = await fetch(url_covidStatus);
    data_covidStatus  = await data_covidStatustemp.json();

    const data_covidTesttemp = await fetch(url_covidTest);
    data_covidTest  = await data_covidTesttemp.json();

    const data_covidMediCollagetemp = await fetch(url_covidMediCollage);
    data_covidMediCollage  = await data_covidMediCollagetemp.json();

    const data_covidAvailableBedtemp = await fetch(url_covidAvailableBed);
    data_covidAvailableBed  = await data_covidAvailableBedtemp.json();

    const data_covidContacttemp = await fetch(url_covidContact);
    data_covidContact  = await data_covidContacttemp.json();

    const data_covidNotificationtemp = await fetch(url_covidNotification);
    data_covidNotification = await data_covidNotificationtemp.json();

    let lastOriginUpdate = data_covidStatus.lastOriginUpdate;
    let totalCases = data_covidStatus.data.summary.total;
    let confirmedCasesForeign = data_covidStatus.data.summary.confirmedCasesForeign;
    let discharged = data_covidStatus.data.summary.discharged;
    let deaths = data_covidStatus.data.summary.deaths;
    var activeCases = totalCases-(discharged+deaths+confirmedCasesForeign);
    //  console.log(totalCases+ " "+ discharged+ " "+ deaths);
    // console.log(activeCases);
    var chartData_india =[];
     chartData_india.push(totalCases,activeCases,discharged,deaths);// array to contain all india cases(total,active,discharged,deaths)

    // **********************Total conformed cases state wide*****************//
    // console.log(data_covidStatus.data.regional.length)
    var state_name_totalCases = [];
    for(var dist_num=0;dist_num<(data_covidStatus.data.regional.length);dist_num++){
        // console.log(data_covidStatus.data.regional[dist_num].loc+":"+data_covidStatus.data.regional[dist_num].totalConfirmed);
        state_name_totalCases.push({state_name:data_covidStatus.data.regional[dist_num].loc,state_cases:data_covidStatus.data.regional[dist_num].totalConfirmed});
        sateName.push(state_name_totalCases[dist_num].state_name);
        stateNameCases.push(state_name_totalCases[dist_num].state_cases);
    }
    
    // state_name_totalCases.forEach(function(item,index,array) {
    //     console.log(item.state_name+":"+item.state_cases);
        
    // });
    //************************Content added drop-down list*******************//
    
    for(var state_name_counter =0;state_name_counter<data_covidStatus.data.regional.length;state_name_counter++){
        let state_name_id = document.getElementById("stateWise");
        let option = document.createElement("option");
        option.text = state_name_totalCases[state_name_counter].state_name;
        option.classList.add("dropdown-item");
        option.value = state_name_totalCases[state_name_counter].state_name;
        option.addEventListener('click',function(){
            //  console.log(option.value);
            if(tableClearingFlag ===true){
                clearingaTable();
                tableClearingFlag =false;
            }
            stateWise_information(option.value);
            
        });
        state_name_id.appendChild(option);
        // console.log(option);
    }
    //********************Random selected 20 Covid Notifications******************//
    // console.log(data_covidNotification.data.notifications[20]);
    let notification = [];
    var randomNum = randomNum_genaretor();
    // console.log(randomNum);
    for(var noti_count=0;noti_count<20;noti_count++){
        notification.push(data_covidNotification.data.notifications[randomNum[0]]);
    }
    // console.log(notification.length);
    // notification.forEach(function(item,index,array) {
    //     console.log(item);
    // });

    document.getElementById("updation").innerHTML = "Last update:" + lastOriginUpdate + "(GMT+5:30)";

    document.getElementById("notificationNum").innerHTML = notification.length;
    notification.forEach(function(item,index,array) {
        document.getElementById("notifications").innerHTML += item.title+"\n"+item.link; 
    });

    
    state_name_totalCases.forEach(function(item,index,array) {
        document.getElementById("state_name_totalCases").innerHTML += item.state_name+":"+item.state_cases+"\t|\t"; 
    });
    
        document.getElementById("totalCases").innerHTML = totalCases;
        document.getElementById("activeCases").innerHTML = activeCases;
        document.getElementById("discharged").innerHTML = discharged;
        document.getElementById("deaths").innerHTML = deaths;

        addData_totalCases(myChart,chartData_india);
        
        
}
    // console.log(sateName);
});
    
   
