if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
    $('.moreContent').addClass('moreContent_tab');
} else {
    $('.moreContent').addClass('moreContent_phone');
}
function aboutPJMInit(){
    var applicationPropsData = JSON.parse(localStorage.getItem("applicationPropsData"));
    var noOfmiles='';
    var noOfPeopleServed='';
    if(!jQuery.isEmptyObject(applicationPropsData) && applicationPropsData !=null){
        for (var index = 0; index < applicationPropsData.length; index++) {
            if(applicationPropsData[index].key == "NUMBER_OF_MILES_OF_TRANSMISSION_LINES"){
                noOfmiles = applicationPropsData[index].value;
            }else if(applicationPropsData[index].key == "NUMBER_OF_PEOPLE_SERVED"){
                noOfPeopleServed = applicationPropsData[index].value;
            }
        }
        document.getElementById("aboutPJMContentId").innerHTML="PJM Interconnection, founded in 1927, ensures the reliability of the high-voltage electric power system serving "+noOfPeopleServed+" million people in all or parts of Delaware," 
            +"Illinois, Indiana, Kentucky, Maryland, Michigan, New Jersey, North Carolina, Ohio, Pennsylvania, Tennessee, Virginia, West Virginia and the District of Columbia."
            +"<br>"
            +"<br> PJM coordinates and directs the operation of the region’s transmission grid, which includes "+noOfmiles+" miles of transmission lines;" 
            +"administers a competitive wholesale electricity market; and plans regional transmission expansion improvements to maintain grid reliability and relieve congestion.";
    }else if(applicationPropsData == null){
        servicesModel.getApplicationPropData("applicationProps");
    }
    //alert("aboutPJMInit noOfmiles: "+noOfmiles+ "  noOfPeopleServed: "+noOfPeopleServed);
}
function goToWebsite() {
    var ref = window.open(encodeURI('http://pjm.com'), '_blank', 'location=yes');
}

function backToMoreFromAboutPJM() {
    runningPageChange(6);
    if (isiPadPro(device.model) || kendo.support.mobileOS.tablet) {
        window.screen.unlockOrientation();
    }
}