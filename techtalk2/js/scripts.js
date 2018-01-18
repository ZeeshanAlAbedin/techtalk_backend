var techtalk = angular.module('techtalk', []);

//API URL for the server
var APIURL = "api/EventTables";



// LEGACY CODE FOR REGISTERING EVENT USING JQUERY


//Register Event Code for ID present in Event_Add Page
/*function registerEvent() {

    var edate = document.getElementById("eventDate").value;
    var tempdate = new Date(edate);
    //Get todays date for comparision regarding Past and upcoming
    var todayDate = new Date();
    //Convert date format to YYYY/MM/DD
    var formattedDate = convertDateFormatToYYYYMMDD(tempdate);
    if (tempdate > todayDate) {
        console.log("Upcoming");
        //Function that will call the API
        var isPassed = false;
        apiPushForRegisterEvent(isPassed, formattedDate);
    } else {
        console.log("Passed");
        if (confirm("You are about to add an already passed event. Continue?") == true) {
            //Function that will call the API
            var isPassed = true;
            apiPushForRegisterEvent(isPassed, formattedDate);

        } else
            console.log("False");
    }

}

//Function to convert Date format
function convertDateFormatToYYYYMMDD(tempDate) {
    var dd = tempDate.getDate();
    var mn = tempDate.getMonth() + 1;
    var yr = tempDate.getFullYear();
    var formattedDate = yr + "/" + mn + "/" + dd;
    return formattedDate;
}

//Function to call api for data insertion
function DefunctapiPushForRegisterEvent(boolPassedValue, dateValue) {

    var eventObject = {
        Ename: $('#eventName').val(),
        Pname: $('#presenterName').val(),
        Edes: $('#eventDes').val(),
        Edate: dateValue,
        isPassed: boolPassedValue
    };
    $.ajax({
        url: APIURL + "/PostEventTable",
        cache: false,
        type: 'POST',
        dataType: 'json',
        data: eventObject,
        success: function () {
            alert("Addition Successful")
        },
        error: function () {
            alert("Oops! Something went wrong")
        }

    })
}

*/


// ANGULAR JS IMPLEMENTATION

//USER Page Controller
techtalk.controller('EventController', function ($scope, $http) {
    $scope.getRequest = function () {
        $scope.rows =
            console.log("I've been pressed!");
        $http.get("http://localhost:58492/api/EventTables/GetEventTables")
            .then(function successCallback(response) {
                $scope.rows = response.data;
                var dupRow = $scope.rows[0]

            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });
    };
});


//Admin Page Controller
techtalk.controller('AdminController', function ($scope, $http) {
    
    $scope.adminInit = function (){
        $scope.name = localStorage.getItem('auname');
        
        console.log($scope.name);
    }
    
    $scope.getUpcomingEvents = function () {
        $scope.rows =
            $http.get("http://localhost:58492/api/EventTables/GetEventTables")
            .then(function successCallback(response) {
                $scope.rows = response.data;
                $scope.lenUpcoming = Object.keys(response.data).length;
                
            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });
    };

    $scope.getPastEvents = function () {
        $scope.rows =
            $http.get("http://localhost:58492/api/EventTables/GetPastEvents")
            .then(function successCallback(response) {
                $scope.Pastrows = response.data;
                $scope.lenPast = Object.keys(response.data).length;
            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });
    };

});

//Add Event Page controller
techtalk.controller('AddEventController', function ($scope, $http) {
    //Register Event Code for ID present in Event_Add Page
    $scope.registerEvent = function () {

        var edate = document.getElementById("eventDate").value;
        var tempdate = new Date(edate);
        //Get todays date for comparision regarding Past and upcoming
        var todayDate = new Date();
        //Convert date format to YYYY/MM/DD
        var formattedDate = $scope.convertDateFormatToYYYYMMDD(tempdate);
        if (tempdate > todayDate) {
            console.log("Upcoming");
            //Function that will call the API
            var isPassed = false;
            $scope.apiPushForRegisterEvent(isPassed, formattedDate);
        } else {
            console.log("Passed");
            if (confirm("You are about to add an already passed event. Continue?") == true) {
                //Function that will call the API
                var isPassed = true;
                $scope.apiPushForRegisterEvent(isPassed, formattedDate);

            } else
                console.log("False");
        }

    }

    //Function to convert Date format
    $scope.convertDateFormatToYYYYMMDD = function (tempDate) {
        var dd = tempDate.getDate();
        var mn = tempDate.getMonth() + 1;
        var yr = tempDate.getFullYear();
        var formattedDate = yr + "/" + mn + "/" + dd;
        return formattedDate;
    }


    $scope.apiPushForRegisterEvent = function (boolPassedValue, dateValue) {

        var eventObject = {
            Ename: $('#eventName').val(),
            Pname: $('#presenterName').val(),
            Edes: $('#eventDes').val(),
            Edate: dateValue,
            isPassed: boolPassedValue
        };
        $http.post(APIURL + '/PostEventTable', eventObject)
            .then(function successCallback() {
                alert("Addition Successful!");
                console.log("Success");
            }, function errorCallback() {
                alert("Something Went Wrong");
                console.log("Failed");
            });
    };
});

//Administrator Login Controller

techtalk.controller("ALoginController", ['$scope','$window','$http', function ($scope, $window,$http) {
    
    $scope.username = '';
    $scope.password = '';
    $scope.responseMessage = '';
    $scope.isSubmitButtonDisabled = false;

    $scope.loginSubmit = function () {
        var userdata = {
            Username: $scope.name,
            Password: $scope.pass
        };
        var config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post('http://localhost:58492/api/Admin_Table/LoginCheck', userdata, config).then(function (successResponse) {
            console.log(successResponse);
        }, function (errorResponse) {
          
            //$scope.responseMessage = 'Email or Password is incorrect';
            alert('Email or Password is incorrect');
        });
    }
}]);

//Remove Event Page Controller
techtalk.controller('RemoveEventController', function ($scope, $http) {
    $scope.getAllEvents = function () {
        $http.get(APIURL + '/GetAllEvents')
            .then(function successCallback(response) {
                $scope.rows = response.data;
            }, function errorCallback(response) {
                console.log("Unable to perform get request");
            });
    };

    $scope.deleteEvent = function (eventID) {
        var idPara = $.param({
            id: eventID
        });
        console.log(idPara);
        $http.delete(APIURL + '/DeleteEventTable?' + idPara)
            .success(function () {
                $scope.getAllEvents();
                console.log("deleted");
            })
            .error(function () {
                alert("Something went wrong");
                console.log("An error occured!");
            });
    };
});

//Update Page Controller
techtalk.controller('UpdateEventController', function ($scope, $http) {
    $scope.updateEvent = function (eventID) {
        
        var parameteres = $.param({
            id: eventID,        
            Ename: $("#jqEname").val(),
            Pname: $("#jqPname").val(),
            Edate : $("#jqEdate").val()
        });
        console.log(parameteres);
        $http.post(APIURL + '/UpdateEventTable', parameteres)
        .success(function (){
            alert("Updation successful");
        })
        .error(function (){
            console.log("ERROR!!!");
        });
    };
 
    
});
