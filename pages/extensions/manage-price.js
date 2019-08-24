app.controller("managePriceCtrl", function($scope, $location, $routeParams, apiServices, $http, $rootScope) {
    $rootScope.loader = true;
    $scope.hasError = false;
    $scope.errorMessage = "";
    const priceModifiedModal = angular.element('#priceModifiedModal');
    const priceModifiedCancelModal = angular.element('#priceModifiedCancelModal');

    $scope.cancelModal = () => {
        priceModifiedModal.modal('hide');
        priceModifiedCancelModal.modal('hide');
        $location.path('/extensions');
    }

    $scope.cancelForm = () => {
        priceModifiedCancelModal.modal('show');
    }

    $scope.handleErrors = (errors) => {
        let message = 'Something went wrong';
        if (errors.data && !isEmpty(errors.data.error)) {
            message = errors.data.error;
        }
        $rootScope.loader = false;
        $scope.hasError = true;
        $scope.errorMessage = message;
    }

    $scope.EditMode = false;
    $scope.hasError = false;

    /*-------------Currency Lisitng-------------------*/
    apiServices.pricingGet('currencies/').then((response) => {
        $scope.currencies = response.exchangeRates;
    }).catch((errors) => {
        $scope.handleErrors(errors); 
    })

    /*-------------Fees Lisitng-------------------*/
    apiServices.pricingGet('fees/').then((response) => {
        $scope.fees = response.fees;
    }).catch((errors) => {
       $scope.handleErrors(errors);
    })

    $scope.$watch('selectedfeeCreate', () => {
        $scope.calculatePrice();
    });

    $scope.$watch('selectedfeeRenew', () => {
        $scope.calculatePrice();
    });

    $scope.$watch('selectedfeeTransfer', () => {
        $scope.calculatePrice();
    });

    $scope.$watch('selectedfeeRestore', () => {
        $scope.calculatePrice();
    });

    apiServices.domainGet('prices?productId=' + $routeParams.productId)
        .then((response) => {
            $scope.singlePriceList = response.prices[0];
            $scope.selectedCostCurrency = $scope.singlePriceList.operations[0].price.currency;

            /*-------------Single Operation-------------------*/
            for (i in $scope.singlePriceList.operations) {
                switch ($scope.singlePriceList.operations[i].name) {
                    case "new":
                        $scope.costPrice = $scope.singlePriceList.operations[i].price.value;
                        break;
                    case "renew":
                        $scope.renewPrice = $scope.singlePriceList.operations[i].price.value;
                        break;
                    case "transfer":
                        $scope.transferPrice = $scope.singlePriceList.operations[i].price.value;
                        break;
                    case "redemption":
                        $scope.restorePrice = $scope.singlePriceList.operations[i].price.value;
                        break;
                }
            }

            /*-------------Add or Edit-------------------*/
            if ($scope.singlePriceList && $scope.singlePriceList.operations) {
                $scope.titleprice = "Modify Price";
                $scope.EditMode = true;
            } else {
                $scope.titleprice = "Create Price";
                $scope.EditMode = false;
            }
        })
        .catch(function(response) {
            $scope.titleprice = "Create Price";
            $scope.EditMode = false;
        })

    apiServices.pricingGet('prices?productType=DOMAIN&productId=' + $routeParams.productId)
        .then((response) => {
            $scope.price = response.prices;

            /*-------------Single Operation-------------------*/
            var singleObj = {};
            for (i in $scope.price[0].products[0].operations) {
                singleObj = $scope.price[0].products[0].operations[i];
                switch (singleObj.id) {
                    case 1:
                        $scope.selectedfeeCreate = "" + singleObj.ranges[0].price.rate.id;
                        break;
                    case 2:
                        $scope.selectedfeeRenew = "" + singleObj.ranges[0].price.rate.id;
                        break;
                    case 3:
                        $scope.selectedfeeTransfer = "" + singleObj.ranges[0].price.rate.id;
                        break;
                    case 4:
                        $scope.selectedfeeRestore = "" + singleObj.ranges[0].price.rate.id;
                        break;
                }
            }
            $rootScope.loader = false;
        })
        .catch((errors) => {
            $scope.handleErrors(errors);
        })


    /*-------------Save Price-------------------*/
    $scope.savePrice = function() {
        $rootScope.loader = true;
        var data = {
            "productId": parseInt($routeParams.productId),
            "prices": [{
                    "operationId": 1,
                    "price": {
                        "value": $scope.costPrice,
                        "currency": $scope.selectedCostCurrency
                    }
                },
                {
                    "operationId": 2,
                    "price": {
                        "value": $scope.renewPrice,
                        "currency": $scope.selectedCostCurrency
                    }
                },
                {
                    "operationId": 3,
                    "price": {
                        "value": $scope.transferPrice,
                        "currency": $scope.selectedCostCurrency
                    }
                },
                {
                    "operationId": 4,
                    "price": {
                        "value": $scope.restorePrice,
                        "currency": $scope.selectedCostCurrency
                    }
                }
            ]
        }
        var feesdata = {
            "productType": 'DOMAIN',
            "productId": parseInt($routeParams.productId),
            "markups": [{
                    "operationId": 1,
                    "rateId": parseInt($scope.selectedfeeCreate)
                },
                {
                    "operationId": 2,
                    "rateId": parseInt($scope.selectedfeeRenew)
                },
                {
                    "operationId": 3,
                    "rateId": parseInt($scope.selectedfeeTransfer)
                },
                {
                    "operationId": 4,
                    "rateId": parseInt($scope.selectedfeeRestore)
                }
            ]
        }

        var priceFunc = ($scope.EditMode ? apiServices.domainPut : apiServices.domainPost);

        priceFunc('prices/', data)
            .then((response) => {
                apiServices.pricingPut('markups/', feesdata)
                    .then((response) => {
                        $rootScope.loader = false;
                        priceModifiedModal.modal('show');
                    })
                    .catch((errors) => {
                        $scope.handleErrors(errors);  
                    })
            })
            .catch((errors) => {
                $scope.handleErrors(errors);
            })
    }

    /*-------------Calculate Price-------------------*/
    $scope.calculatePrice = function() {
        var singlepriceObj = {};
        for (i in $scope.fees) {
            singlepriceObj = $scope.fees[i].rate;
            if (singlepriceObj.id == parseInt($scope.selectedfeeCreate)) {
                $scope.rangeFeeCreate = $scope.fees[i];
            }
            if (singlepriceObj.id == parseInt($scope.selectedfeeRenew)) {
                $scope.rangeFeeRenew = $scope.fees[i];
            }
            if (singlepriceObj.id == parseInt($scope.selectedfeeTransfer)) {
                $scope.rangeFeeTransfer = $scope.fees[i];
            }
            if (singlepriceObj.id == parseInt($scope.selectedfeeRestore)) {
                $scope.rangeFeeRestore = $scope.fees[i];
            }
        }
    }

    $scope.commRate = function(price, commission) {
        if (isEmpty(commission)) return price;
        return price + (price * commission / 100);
    }

});