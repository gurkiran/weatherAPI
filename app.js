//Creating angular module

var weatherApp = angular.module('weatherApp',['ngRoute','ngResource']);


//Configuring routes 

weatherApp.config(function($routeProvider){
   
    $routeProvider
    
    .when('/', {
        
        templateUrl:'pages/home.htm',
        controller:'homeController'
    })
     .when('/forecast', {
        
        templateUrl:'pages/forecast.htm',
        controller:'forecastController'
    })
    .when('/forecast/:days', {
        
        templateUrl:'pages/forecast.htm',
        controller:'forecastController'
    })
});

//Creating a service to accept a city name which is to be passed to ajax call after injecting it to the //controller

weatherApp.service('cityService', function(){
    
    // Setting a default city when the page loads
    this.city = "New York, NY";
   
})


//Creating the Controller for the home page  

weatherApp.controller('homeController',['$scope','cityService' ,function($scope,cityService){

    $scope.city = cityService.city;
    
    
    // Attaching $watch so that the city name persists when navigating between the pages
    
    $scope.$watch('city', function(){
        
       cityService.city=$scope.city; 
    });
    
}]);


// Creating the controller for the forecast page 

weatherApp.controller('forecastController',['$scope','$resource','$routeParams','cityService',
function($scope,$resource,$routeParams,citySevice){
    
    $scope.city = citySevice.city;
    
    // setting default state to 2 days everytime you first navigate to forecast page
    
    $scope.days = $routeParams.days || '2';
                                         
    // making an Ajax calling using $resource 
    
    $scope.weatherAPI = $resource("http://api.openweathermap.org/data/2.5/forecast/daily?APPID=fbb610483c3d585d1a34e96d64ef926b", { callback: "JSON_CALLBACK" }, { get: { method: "JSONP" }});
 
    $scope.weatherResult = $scope.weatherAPI.get({ q: $scope.city, cnt: $scope.days });
    
    
    // The API returned has temperature in Kelvin , let's convert it to Celcius 
    $scope.convertToCelcius= function(degK){
        return Math.round(degK - 273.15);
    }
    
    
    
    $scope.convertToDate= function(dt){
        return new Date(dt*1000);
    }
    
    console.log($scope.weatherResult);
    
    
}]);

// Directives 

weatherApp.directive('weatherReport',function(){
            
    return {
        
        restrict:'E',
        templateUrl:'directives/weatherReport.htm',
        replace:true,
        //Isolating the scope and passing functions/strings to the directive using = , @ and & symbols as one //way and two-way bindings
        scope:{
            weatherDay:'=',
            convertToStandard:'&',
            convertToDate:'&',
            dateFormat:'@'
        }
    }    
});