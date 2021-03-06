 var app = angular.module('myApp', ['ngRoute']);
 app.config(['$routeProvider', function ($routeProvider) {
     $routeProvider
         .when('/details', {
             templateUrl: 'partials/details.html',
             controller: 'detailsController'
         })
         .when('/charges', {
             templateUrl: 'partials/charges.html',
             controller: 'chargesController'

         })
         .when('/earnings', {
             templateUrl: 'partials/earnings.html',
             controller: 'earningsController'
         })
         .otherwise({
             redirectTo: '/details'
         });
}]);

 app.service('mealDataService', function () {
     var meals = [];

     var cumulativeData = {
         mealCount: 0,
         tipTotal: 0,
         tipAvg: 0
     };
     return {
         addMeal: function (meal) {
             meals.push(meal);
             cumulativeData.mealCount++;
             cumulativeData.tipTotal += meal.tip;
             cumulativeData.tipAvg = (cumulativeData.tipTotal / cumulativeData.mealCount);
         },
         getMeals: function () {
             return meals;
         },
         getCumulativeData: function () {
             return cumulativeData;
         },
         resetAll: function () {
             meals.length = 0;
             cumulativeData = {
                 mealCount: 0,
                 tipTotal: 0,
                 tipAvg: 0
             };
         }
     };
 });

 app.controller('detailsController', function ($scope, mealDataService) {

     $scope.mealCount = 1;



     $scope.getMealCount = function () {
         var meals = mealDataService.getMeals();
         console.log(meals);
         if (typeof meals != "undefined" && meals !== null && meals.length > 0) {
             $scope.mealCount = meals.length + 1;
         }
     };

     $scope.getMealCount();

     $scope.cancel = function () {
         $scope.price = '';
         $scope.tax = '';
         $scope.tip = '';
     };
     $scope.addTransaction = function () {

         $scope.mealCount++;

         var price = parseFloat($scope.price);
         var tax = parseFloat($scope.tax);
         var tip = parseFloat($scope.tip);

         $scope.currentSubtotal = price + (price * (tax / 100));
         $scope.currentTip = $scope.currentSubtotal * (tip / 100);
         $scope.currentTotal = $scope.currentSubtotal + $scope.currentTip;

         var meal = {
             subtotal: $scope.currentSubtotal,
             tip: $scope.currentTip,
             total: $scope.currentTotal
         };
         mealDataService.addMeal(meal);

         $scope.cancel();
     };
 });

 app.controller('chargesController', function ($scope, mealDataService) {
     $scope.getMeals = function () {
         var meals = mealDataService.getMeals();
         $scope.meals = meals;
         console.log($scope.meals);
     };

     $scope.getMeals();

     $scope.mealCount = $scope.meals.length;

     $scope.avoidZero = function () {
         if ($scope.mealCount === 0) {
             $scope.mealCount = 1;
         }
     };

     $scope.avoidZero();
 });
 app.controller('earningsController', function ($scope, mealDataService) {

     $scope.tipTotal = mealDataService.getCumulativeData().tipTotal;
     $scope.mealCount = mealDataService.getCumulativeData().mealCount;
     $scope.tipAvg = mealDataService.getCumulativeData().tipAvg;

 });

 app.controller('resetCtrl', function ($scope, mealDataService) {
     $scope.resetAll = function () {
         mealDataService.resetAll();
     };
 });
 app.controller('navCtrl', function ($scope, $location) {
     $scope.isActive = function (viewLocation) {
         return viewLocation === $location.path();
     };

     $scope.classActive = function (viewLocation) {
         if ($scope.isActive(viewLocation)) {
             return 'active';
         } else {
             return 'inactive';
         }
     };
 });
