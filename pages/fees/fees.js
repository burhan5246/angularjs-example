app.controller("feesListCtrl", function($scope, $location, $timeout, $rootScope, apiServices) {
    $scope.title = "Fees List";
    $scope.editablerow = {};
    $rootScope.loader = true;
    $scope.errorMessage = '';
  	$scope.hasError = false;
    $scope.successMessage = "";
    const feeAddModal = angular.element('#feeAddModal');
    const feeCancelModal = angular.element('#feeCancelModal');

    $scope.handleErrors = (errors) => {
      let message = 'Something went wrong';
      if (errors.data && !isEmpty(errors.data.error)) {
          message = errors.data.error;
      }
      $rootScope.loader = false;
      $scope.hasError = true;
      $scope.errorMessage = message;
    }

    $scope.getFees = function() {
        $rootScope.loader = true;
        apiServices.pricingGet('fees')
            .then((response) => {
                $scope.feeslist = response.fees;
                $rootScope.loader = false;
            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });
        // body...
    }

    $scope.getFees();


    $scope.loadTemplate = function(list) {
        if (!isEmpty($scope.editablerow.rate) && list.rate.id === $scope.editablerow.rate.id)
            return 'edit';
        else
            return 'view';
    }

    $scope.editFees = function(list) {
        //$scope.editIndex = index;
        $scope.editablerow = angular.copy(list);
    }

    $scope.saveFeesData = function() {
        $rootScope.loader = true;
        let data = {
            "rateName": $scope.editablerow.rate.name,
            "rateId": parseInt($scope.editablerow.rate.id),
            "ranges": $scope.editablerow.ranges
        }

        apiServices.pricingPut('fees/?rateId=' + $scope.editablerow.rate.id, data)
            .then((response) => {
                $rootScope.loader = false;
                $scope.successMessage = "The fee has been modified successfully";
                $scope.modalTitle = "Fee modified successfully";
                feeAddModal.modal('show');
                $scope.getFees();
                $scope.editablerow = {}; 

            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });

        
    };

    /*$scope.cancelEdit = function() {
        feeCancelModal.modal('show');
        $scope.editablerow = {};
    }*/

    $scope.cancel = () =>{
        feeCancelModal.modal('show');
    }

    $scope.cancelEdit = function() {
        
        $scope.editablerow = {};
    }

    $scope.showAddFees = () => {
        $scope.singleFee = {};
        $('.fees-add-form').slideToggle('slow');
    };

    $scope.addFees = function() {
        $rootScope.loader = true;
        let data = {
            "rateName": $scope.singleFee.name,
            "ranges": [{
                    "id": 0,
                    "fee": {
                        "value": $scope.singleFee.range0,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 1,
                    "fee": {
                        "value": $scope.singleFee.range1,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 2,
                    "fee": {
                        "value": $scope.singleFee.range2,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 3,
                    "fee": {
                        "value": $scope.singleFee.range3,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 4,
                    "fee": {
                        "value": $scope.singleFee.range4,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 5,
                    "fee": {
                        "value": $scope.singleFee.range5,
                        "type": "fixedAmount"
                    }
                },
                {
                    "id": 6,
                    "fee": {
                        "value": $scope.singleFee.range6,
                        "type": "fixedAmount"
                    }
                }
            ]
        }

        apiServices.pricingPost('fees', data)
            .then((response) => {
                $rootScope.loader = false;

                $scope.successMessage = "The Fee has been created successfully";
                $scope.modalTitle = "Fee created successfully";
                $scope.getFees();
                feeAddModal.modal('show');
                $('.fees-add-form').slideToggle('slow');
            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });

        
        //$scope.showFeesAdd = false;		
    };

    $scope.cancelForm = function() {

        $('.fees-add-form').slideToggle('slow');
    }

});