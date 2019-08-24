var app = angular.module("myApp", ["ngRoute", "angularUtils.directives.dirPagination"]);

app.constant("APP_CONSTANT", {
  "API_DOMAINURL": "https://api-gateway.pre.cdmon.com/api-domains/1.0/",
  "API_PRICEURL": "https://api-gateway.pre.cdmon.com/api-pricing/1.0/"
});

const isEmpty = value => value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0) || (typeof value === 'string' && value.trim().length === 0);

app.config(function($routeProvider, $httpProvider) {
  /*delete $httpProvider.defaults.headers.common['X-Requested-With'];
  $httpProvider.defaults.withCredentials = false*/;

  //$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  $routeProvider
  .when("/", {
    templateUrl : "pages/dashboard/dashboard.html",
    controller : "dashboardCtrl"
  })
  .when("/extensions", {
    templateUrl : "pages/extensions/extensions.html",
    controller : "extensionListCtrl"
  })
  .when("/domains/add/:createId", {
    templateUrl : "pages/extensions/createdomain.html",
    controller : "extensionCreateCtrl"
  })
  .when("/domains/edit/:doaminid", {
    templateUrl : "pages/extensions/updatedomain.html",
    controller : "extensionUpdateCtrl"
  })
  .when("/prices/edit/:productId", {
    templateUrl : "pages/extensions/manageprice.html",
    controller : "managePriceCtrl"
  })
  .when("/fees", {
    templateUrl : "pages/fees/fees.html",
    controller : "feesListCtrl"
  })
  .when("/fees/manage", {
    templateUrl : "pages/fees/managefees.html",
    controller : "feesListCtrl"
  })
  .when("/currencies", {
    templateUrl : "pages/currencies/currency.html",
    controller : "currencyListCtrl"
  })
  .when("/currencies/manage", {
    templateUrl : "pages/currencies/managecurrency.html",
    controller : "currencyListCtrl"
  })  
  .otherwise({
    templateUrl : "pages/404.html"
  });
});

app.run(function($rootScope){
  $rootScope.loader = false;
})