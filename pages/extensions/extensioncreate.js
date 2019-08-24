app.controller("extensionCreateCtrl", function ($rootScope, $scope, $location, $routeParams, apiServices) {

 if(!$routeParams.createId){
      $location.path('/extensions');  
  }

  $scope.errorMessage = '';
  $scope.hasError = false;
  $scope.newExtension = {};
  $scope.newExtension.id = $routeParams.createId;

 $scope.handleErrors = (errors) => {
      let message = 'Something went wrong';
      if (errors.data && !isEmpty(errors.data.error)) {
          message = errors.data.error;
      }
      $rootScope.loader = false;
      $scope.hasError = true;
      $scope.errorMessage = message;
  }

  apiServices.domainGet('registries/')
  .then((response) => {
      $scope.registrylist = response.registries;
  })
  .catch(function(errors){
      $scope.handleErrors(errors);      
  });
  
  const domainModifyModal = angular.element('#domainModifyModal');
  const domainModifiedCancelModal = angular.element('#domainModifiedCancelModal');  
  
  $scope.addExt = function(){
    $rootScope.loader = true;
    apiServices.domainPost('extensions/' + $scope.newExtension.id, { name : $scope.newExtension.name, registryId : parseInt($scope.newExtension.registryId) })
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

