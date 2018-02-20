console.log("navigationService.js ");
var navigationService = {
    navigateTo : function (pageName){
        if(pageName ==  "alertDetail"){
             app.navigate("components/more/alerts/latestAlerts/alertDetail/alertDetail.html", "slide:left");
        }else if(pageName == "more"){
            app.navigate("components/more/more.html", "slide:left");
        }else if(pageName ==  "tieflow"){
        
        }else if(pageName == "zoneLMPMap"){
            app.navigate("components/zoneLMPMap/zoneLMPMap.html", "slide:right");
        } 
    },
    navigateToPageInDirection : function (pageName,direction){
        if(pageName=="tieflow"){
            if(direction=="left"){
                app.navigate("components/tieflows/tieFlows.html", "slide:left");
            }else if(direction=="right"){
                app.navigate("components/tieflows/tieFlows.html", "slide:right");
            }
        }else if(pageName=="demand"){
            if(direction=="left"){
                app.navigate("components/demand/demand.html", "slide:left");
            }else if(direction=="right"){
                app.navigate("components/demand/demand.html", "slide:right");
            }
        }else if(pageName=="zoneLMPMap"){
            if(direction=="left"){
                app.navigate("components/zoneLMPMap/zoneLMPMap.html", "slide:left");
            }else if(direction=="right"){
                app.navigate("components/zoneLMPMap/zoneLMPMap.html", "slide:right");
            }   
        }else if(pageName == "more"){
            if(direction=="left"){
                app.navigate("components/more/more.html", "slide:left");
            }else if(direction=="right"){
                app.navigate("components/more/more.html", "slide:right");
            }  
        }
    } 
}