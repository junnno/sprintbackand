angular.module('sprint.services', [])



 /*****************API INTERCEPTOR SERVICE********************/  
    .service('APIInterceptor', function ($rootScope, $q) {
        var service = this;

        service.responseError = function (response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return $q.reject(response);
        };
    })
 /*****************END OF API INTERCEPTOR SERVICE********************/     
 
 
 
  /*****************LOGIN SERVICE********************/   
    .service('LoginService', function (Backand, $http) {
        var service = this;
      baseUrl = '/1/objects/',
            objectName = 'users/';
            
        service.signin = function (email, password, appName) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.socialSignIn = function (provider) {
            return Backand.socialSignIn(provider);
        };

        service.socialSignUp = function (provider) {
            return Backand.socialSignUp(provider);

        };

        service.signout = function () {
            return Backand.signout();
        };

        service.signup = function(firstName, lastName, email, password, confirmPassword, parameters){
         //how to add to custom user table??
           return  Backand.signup(firstName, lastName, email, password, confirmPassword, parameters);
    }
     
        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }
      service.get = function (id){
             return $http.get(getUrlForId(id));
      };
        service.update = function (id, object) {
            return $http.put(getUrlForId(id), object);
        };
    })
  /*****************END OF LOGIN SERVICE********************/
  
  
    /*****************AUTH SERVICE********************/      
    .service('AuthService', function($http, Backand){

    var self = this;
    var baseUrl = Backand.getApiUrl() + '/1/objects/';
    self.appName = 'sprintbackand';//CONSTS.appName || '';
    self.currentUser = {};
    
    self.getSocialProviders = function () {
        return Backand.getSocialProviders()
    };

    self.socialSignIn = function (provider) {
        return Backand.socialSignIn(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.socialSignUp = function (provider) {
        return Backand.socialSignUp(provider)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.setAppName = function (newAppName) {
        self.appName = newAppName;
    };

    self.signIn = function (username, password, appName) {
        return Backand.signin(username, password, appName)
            .then(function (response) {
                loadUserDetails();
                return response;
            });
    };

    self.signUp = function (firstName, lastName, username, password, parameters) {
        return Backand.signup(firstName, lastName, username, password, password, parameters)
            .then(function (signUpResponse) {

                if (signUpResponse.data.currentStatus === 1) {
                    return self.signIn(username, password)
                        .then(function () {
                        console.log(signUpResponse);
                            return signUpResponse;
                        });

                } else {
                    return signUpResponse;
                }
            });
    };

    self.changePassword = function (oldPassword, newPassword) {
        return Backand.changePassword(oldPassword, newPassword)
    };

    self.requestResetPassword = function (username) {
        return Backand.requestResetPassword(username, self.appName)
    };

    self.resetPassword = function (password, token) {
        return Backand.resetPassword(password, token)
    };

    self.logout = function () {
        Backand.signout().then(function () {
            angular.copy({}, self.currentUser);
        });
    };

    getUserDetails = function() {
        return $http({
            method: 'GET',
            url:  baseUrl + "shops/",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator:    "contains",
                    value: Backand.getUsername()
                }])
            }
        }).then(function (response) {
            if (response.data && response.data.data && response.data.data.length == 1){
                                                                   // console.log(response.data.data[0].id);      
                return response.data.data[0];
             }
             else{
                console.log(response);    
             }
        });
    }

    
return{
getUserDetails  : getUserDetails
}
})
    /*****************END OF AUTH SERVICE********************/   
    
    
    
      /*****************DASH/HOME SERVICE********************/   
 .service('DashService', function($http, Backand){
     
             getShopRequests = function(id){
				
                    return $http ({
                        method: 'GET',
                        url: Backand.getApiUrl() + '/1/query/data/getShopRequests',
                        params: {
                            parameters: {
                                shop_id: id
                            }
                        }
                    });
			 }			 
	 return{
             getShopRequests : getShopRequests
	 }
 })
    /*****************END OF DASH/HOME SERVICE********************/   
    
    
      /*****************COURSE SERVICE********************/   
.service('CourseService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var object1Name = 'shops/';
     var object2Name = 'courses/';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      getCourses = function (id){
           return $http ({
					  method: 'GET',
					  url: Backand.getApiUrl() + '/1/objects/courses',
					  params: {
						filter: [
						  {
							fieldName: 'shop',
							operator: 'in',
							value: id
						  }
						],
						sort: '[{fieldName:\'coursename\', order:\'asc\'}]'
					  }
					});
      };
      
      addCourse = function(course){
               return $http.post(Backand.getApiUrl() + baseUrl + object2Name, course);
      };
      
      deleteCourse = function(id){
              return $http.delete(Backand.getApiUrl() + baseUrl + object2Name + id);
      };
      
      editCourse = function(id, course){
               return $http.put(Backand.getApiUrl() + baseUrl + object2Name + id, course);
      };
      
      return{
          getCourses: getCourses,
          addCourse : addCourse,
          deleteCourse: deleteCourse,
          editCourse: editCourse
      }
})
  /*****************END OF COURSE  SERVICE********************/   



  /*****************SHOP SERVICE********************/   
.service('ShopService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var objectName = 'shops/';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + objectName;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
      
      getAllShops = function (){
             return $http.get(getUrl());
      };
      
     getShops = function (id){
             return $http.get(getUrlForId(id));
      };
      
      add = function(course){
               return $http.post(getUrl(), course);
      };
      
      remove = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      return{
          getShops: getShops,
          getAllShops: getAllShops,
          add : add,
          remove: remove
      }
})
  /*****************END OF SHOP SERVICE********************/   
  
  
  
    /*****************FILE SERVICE********************/   
.service('FileService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var object1Name = 'shops/';
      var object2Name = '/courses';
      var object3Name = '/files';
      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object2Name;
      }
      
      function getUrlForId(id){
            return Backand.getApiUrl() + baseUrl + object3Name + '/' + id;
      }
     
      getFiles = function (courseId){
             return $http.get(getUrl() + '/' + courseId + object3Name);
      };
      
      addFile = function(courseId, object){
               return $http.post(Backand.getApiUrl() + baseUrl + object3Name,object);
      };
      
      deleteFile = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      editFile = function(id,object){
      		return  $http.put(Backand.getApiUrl() + baseUrl + 'files/' + id, object);
      };
      return{
          getFiles: getFiles,
          addFile : addFile,
          deleteFile: deleteFile,
          editFile :editFile
      }
})
  /*****************END OF FILE SERVICE********************/   


  /*****************REQUEST SERVICE********************/   
.service('RequestService', function($http, Backand) {
      var baseUrl = '/1/objects/';
      var object1Name = 'requests/';
      var self = this;

    self.currentUser = {};
    

      
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      getRequests = function (){
             return $http.get(getUrl());
      };
      
      add = function(request){
               return $http.post(getUrl(), request);
      };
      
      remove = function(id){
              return $http.delete(getUrlForId(id));
      };
      
      update = function(id, object){     
              return $http.put(getUrlForId(id), object);
      };
      
      addToLog = function(object){
      		console.log(object);
      		 return $http.post(Backand.getApiUrl() + baseUrl + 'logs/', object);
      }

    getUserId = function() {
        return $http({
            method: 'GET',
            url:  Backand.getApiUrl() + baseUrl + "users/",
            params: {
                filter: JSON.stringify([{
                    fieldName: "email",
                    operator:    "contains",
                    value: Backand.getUsername()
                }])
            }
        }).then(function (response) {
            if (response.data && response.data.data && response.data.data.length == 1){
                                                                   // console.log(response.data.data[0].id);      
                return response.data.data[0];
             }
             else{
                console.log(response);    
             }
        });
    }
    
    
    
      return{
         getUserId: getUserId,
          getRequests: getRequests,
          add : add,
          remove: remove,
          update: update,
          addToLog : addToLog
      }
})
  /*****************END OF REQUEST SERVICE********************/   
  
   /*****************SETTING SERVICE********************/   
.service('SettingService', function($http, Backand) {
   var baseUrl = '/1/objects/';
      var object1Name = 'shops/';
   
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      update = function(id, object){
              return $http.put(getUrlForId(id), object);
      };

      return{
          update: update
      }
      
    
})
  /*****************END OF SETTING SERVICE********************/
  
   /*****************LOG SERVICE********************/   
.service('LogService', function($http, Backand) {
   var baseUrl = '/1/objects/';
      var object1Name = 'logs/';
   
      function getUrl() {
             return Backand.getApiUrl() + baseUrl + object1Name;
      }
      
      function getUrlForId(id){
            return getUrl() + id;
      }
     
      
        getLogs = function(id){
					  return $http ({
								  method: 'GET',
								  url: Backand.getApiUrl() + '/1/objects/logs',
								  params: {
											pageSize: 20,
											pageNumber: 1,
											filter: [{
														fieldName: 'shop_id',
														operator: 'equals',
														value: id
											  }],
											sort: ''
								  }
					});
		};

      return{
          getLogs:getLogs
      }
      
    
})
  /*****************END OF LOG SERVICE********************/
  
    /*****************CLOCK SERVICE********************/   
.service('ClockService', function() {
   
      
    //angular.element('#clock').fitText(1.3);

		function update() {
		  $('#clock').html(moment().format('H:mm:ss a'));
		}

		setInterval(update, 1000);
});
  /*****************END OF CLOCK SERVICE********************/

