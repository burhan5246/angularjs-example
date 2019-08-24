app.service('apiServices',
    function ($http, $q, APP_CONSTANT) {
        
        this.handleCatch = function(errors, deferred) {
            /*var message = '';
            if (errors.status == '404') {
                message = 'Invalid request URL'
            } else if (errors.data && errors.data.error) {
                message = errors.data.error;
            } else if (errors.data && errors.data.message) {
                message = errors.data.message;
            } else {                
                message = 'Something went wrong. Please try again';
            }*/
            if (deferred) {
                deferred.reject(errors);
            }            
        }

        this.domainGet = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: APP_CONSTANT.API_DOMAINURL + URL,
                headers: {
                    'Authorization': 'Bearer E5WGVtZGx7GnbKXOCWoCDj39wmkUlKec',
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }

        this.domainPost = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: APP_CONSTANT.API_DOMAINURL + URL,
                headers: {
                    'Authorization': 'Bearer E5WGVtZGx7GnbKXOCWoCDj39wmkUlKec',
                    "userId" : 1
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }

        this.domainPut = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "PUT",
                url: APP_CONSTANT.API_DOMAINURL + URL,
                headers: {
                    'Authorization': 'Bearer E5WGVtZGx7GnbKXOCWoCDj39wmkUlKec',
                    "userId" : 1
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }

        this.pricingGet = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "GET",
                url: APP_CONSTANT.API_PRICEURL + URL,
                headers: {
                    'Authorization': 'Bearer aILvLGJi6sCPqfZgbvpY8O9zyodsIS4a'
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }

        this.pricingPost = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "POST",
                url: APP_CONSTANT.API_PRICEURL + URL,
                headers: {
                    'Authorization': 'Bearer aILvLGJi6sCPqfZgbvpY8O9zyodsIS4a',
                    "userId" : 1
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }        
        
        this.pricingPut = function (URL, data) {
            var deferred = $q.defer();
            $http({
                method: "PUT",
                url: APP_CONSTANT.API_PRICEURL + URL,
                headers: {
                    'Authorization': 'Bearer aILvLGJi6sCPqfZgbvpY8O9zyodsIS4a',
                    "userId" : 1
                },
                data: data
            }).then((response) => {
                deferred.resolve(response.data);
            }).catch((errors) => {
                this.handleCatch(errors, deferred)
            })
            return deferred.promise;
        }    

        return this;
    }
);