app.controller("currencyListCtrl", function($rootScope, $scope, $timeout, $filter, apiServices, $location) {
    $scope.title = "Currency List";
    $scope.editablerow = {};
    $scope.singleCurrency = {};

    $rootScope.loader = true;
    $scope.errorMessage = '';
    $scope.hasError = false;
    $scope.successMessage = "";
    const currencyAddModal = angular.element('#currencyAddModal');
    const currencyCancelModal = angular.element('#currencyCancelModal');

    $scope.handleErrors = (errors) => {
        let message = 'Something went wrong';
        if (errors.data && !isEmpty(errors.data.error)) {
          message = errors.data.error;
        }
        $rootScope.loader = false;
        $scope.hasError = true;
        $scope.errorMessage = message;
    }

    $scope.getCurrency = function() {
        $rootScope.loader = true;
        apiServices.pricingGet('currencies')
            .then((response) => {
                $scope.currencylist = response.exchangeRates;
                $rootScope.loader = false;
            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });
    }

    $scope.getCurrency();

    $scope.loadTemplate = function(currency) {
        if (!isEmpty($scope.editablerow) && $scope.editablerow.currency == currency.currency)
            return 'edit';
        else
            return 'view';
    }

    $scope.editCurrency = function(index) {
        $scope.editIndex = index;
        $scope.editablerow = angular.copy($scope.currencylist[index]);
    }

    $scope.saveCurrencyData = function() {
        $rootScope.loader = true;
        let data = {
            "description": $scope.editablerow.description,
            "equivalence": $scope.editablerow.equivalence
        }

        apiServices.pricingPut('currencies/' + $scope.editablerow.currency, data)
            .then((response) => {                
                $rootScope.loader = false;
                $scope.successMessage = "The Currency has been modified successfully";
                $scope.modalTitle = "Currency modified successfully";
                currencyAddModal.modal('show');
                $scope.editablerow.updateDate = new Date();
                $scope.currencylist[$scope.editIndex] = $scope.editablerow;
                $scope.editablerow = {};                
            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });
        
    };

    $scope.cancel = () =>{
        currencyCancelModal.modal('show');
    }

    $scope.cancelEdit = function() {
        
        $scope.editablerow = {};
    }

    $scope.showAddCurrency = () => {
        $scope.singleCurrency = {};
        $('.currency-add-form').slideToggle();
    };

    $scope.addCurrency = function() {
        $rootScope.loader = true;
        let data = {
            "description": $scope.singleCurrency.description,
            "equivalence": $scope.singleCurrency.equivalence
        }

        apiServices.pricingPost('currencies/' + $scope.singleCurrency.currency, data)
            .then((response) => {
                $rootScope.loader = false;
                $scope.getCurrency();
                $scope.successMessage = "The Currency has been created successfully";
                $scope.modalTitle = "Currency created successfully";
                currencyAddModal.modal('show');
                $('.currency-add-form').slideToggle()
            })
            .catch(function(errors) {
                $scope.handleErrors(errors);
            });
        
        //$('.currency-add-form').slideToggle()
    };

    $scope.cancelForm = function() {
        $('.currency-add-form').slideToggle()
    }

});