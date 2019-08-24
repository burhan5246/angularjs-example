app.controller("extensionUpdateCtrl", function ($rootScope, $scope, $location, $routeParams, apiServices) {
  if(!$routeParams.doaminid){
      $location.path('/extensions');  
  }
  $scope.errorMessage = '';
  $scope.hasError = false;
  $rootScope.loader = true;

  $scope.handleErrors = (errors) => {
      let message = 'Something went wrong';
      if (errors.data && !isEmpty(errors.data.error)) {
          message = errors.data.error;
      }
      $rootScope.loader = false;
      $scope.hasError = true;
      $scope.errorMessage = message;
  }
  
  apiServices.domainGet('extensions/'+ $routeParams.doaminid)
  .then((response) => {
      $scope.singleExtensionList = response.extensions[0];
      $scope.singleExtensionList.registry.id = String($scope.singleExtensionList.registry.id);
      $rootScope.loader = false;         
  })
  .catch(function(errors){
      $scope.handleErrors(errors); 
  });

  apiServices.domainGet('registries/')
  .then((response) => {
      $scope.registrylist = response.registries;
  })
  .catch(function(errors){
      $scope.handleErrors(errors); 
  });
  
  const domainModifyModal = angular.element('#domainModifyModal');
  const domainModifiedCancelModal = angular.element('#domainModifiedCancelModal');

  $scope.updateError = false;  
  $scope.updateExt = function(){
    $rootScope.loader = true;
    apiServices.domainPut('extensions/'+ $scope.singleExtensionList.id, { registryId : parseInt($scope.singleExtensionList.registry.id) })
    .then((response) => {
      $rootScope.loader = false;
      $scope.hasError = false;
      domainModifyModal.modal('show');
    })
    .catch(function(errors){
        $scope.handleErrors(errors); 
    });    
  }

  $scope.cancel = () =>{
    domainModifyModal.modal('hide');
    domainModifiedCancelModal.modal('hide');          
    $location.path('/extensions');
  }

  $scope.cancelForm = () =>{    
    domainModifiedCancelModal.modal('show');
  }  

});

