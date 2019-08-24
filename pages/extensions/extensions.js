app.controller("extensionListCtrl", function ($rootScope, $scope, $location, $routeParams, apiServices) {
  $scope.title = "Extension List";
  $scope.extensionlist = [];
  $rootScope.loader = true;
  $scope.errorMessage = '';
  $scope.hasError = false;

  $scope.handleErrors = (errors) => {
      let message = 'Something went wrong';
      if (errors.data && !isEmpty(errors.data.error)) {
          message = errors.data.error;
      }
      $rootScope.loader = false;
      $scope.hasError = true;
      $scope.errorMessage = message;
  }

  apiServices.domainGet('extensions/')
  .then((response) => {
      $scope.extensionlist = response.extensions;
      $scope.maxId = Math.max.apply(Math, $scope.extensionlist.map(function(item) { return item.id; })) + 1;
      $rootScope.loader = false;
  })
  .catch(function(errors) {
      $scope.handleErrors(errors);    
  });

  $scope.operations = {};
  $scope.costs = {};
  $scope.getFeeCost = function(pid){
    $rootScope.loader = true;
    
    if(!isEmpty($scope.costs[pid])){
      $rootScope.loader = false;
      return;
    }

    $scope.costs[pid] = {}
    apiServices.pricingGet("prices/?productType=DOMAIN&productId="+pid+"&rangeId=0")
    .then((response) => {
        $scope.operations = response.prices[0].products[0].operations;
        
        for(i in $scope.operations){  
          switch($scope.operations[i].name){
            case "new":
              $scope.costs[pid].costNewValue = $scope.operations[i].ranges[0].price.cost.value;
              $scope.costs[pid].feeNewName = $scope.operations[i].ranges[0].price.rate.name;
              $scope.costs[pid].EurNewValue = $scope.operations[i].ranges[0].price.costEuro.value;
              $scope.costs[pid].pvpNewValue = $scope.operations[i].ranges[0].price.pvp.value;
              break;
            case "renew":
              $scope.costs[pid].costRenewValue = $scope.operations[i].ranges[0].price.cost.value;
              $scope.costs[pid].feeRenewName = $scope.operations[i].ranges[0].price.rate.name;
              $scope.costs[pid].EurRenewValue = $scope.operations[i].ranges[0].price.costEuro.value;
              $scope.costs[pid].pvpRenewValue = $scope.operations[i].ranges[0].price.pvp.value;
              break;
            case "transfer":
              $scope.costs[pid].costTransferValue = $scope.operations[i].ranges[0].price.cost.value;
              $scope.costs[pid].feeTransferName = $scope.operations[i].ranges[0].price.rate.name;
              $scope.costs[pid].EurTransferValue = $scope.operations[i].ranges[0].price.costEuro.value;
              $scope.costs[pid].pvpTransferValue = $scope.operations[i].ranges[0].price.pvp.value;
              break;
            case "redemption":
              $scope.costs[pid].costRedemptionValue = $scope.operations[i].ranges[0].price.cost.value;
              $scope.costs[pid].feeRedemptionName = $scope.operations[i].ranges[0].price.rate.name;
              $scope.costs[pid].EurRedemptionValue = $scope.operations[i].ranges[0].price.costEuro.value;
              $scope.costs[pid].pvpRedemptionValue = $scope.operations[i].ranges[0].price.pvp.value;
              break;
          }                 
        }
        $rootScope.loader = false;
    }).catch(function(errors){
        $scope.handleErrors(errors);      
    });
    
  }


  
});

