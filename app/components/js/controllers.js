'use strict';

angular.module('sprint.controllers', [])

/******************************LOGIN CONTROLLER************************************************/
// Controller definition for this module
.controller('LoginController', function(Backand, $scope,$http,$timeout,$location,LoginService, $rootScope) {
		
		// Just a housekeeping.
		// In the init method we are declaring all the
		// neccesarry settings and assignments to be run once
		// controller is invoked
		init();
		var login = this;
		
		function init(){
			 	
				console.log("Login Controller mga beh.");
				angular.element('.parallax').parallax();
		}

        $scope.signin =  function() {

		        LoginService.signin(login.email, login.password)
		            .then(function () {
		               if(Backand.getUserRole() == 'Owner'){
		               		 onLogin(Backand.getUsername());
		               }
		               else{
		               console.log("Access Denied");
		               $scope.error_message = 'Access Denied';
		               }
		            }, function (error) {
		                console.log(error)
		                $scope.error_message = error.error_description;
		            })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }
        
        $scope.signUp = function(){
           console.log("reg");
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            console.log("G");
            $location.path('/home');
         }

        function signout() {
            LoginService.signout()
                .then(function () {
                    $rootScope.$broadcast('logout');
                    console.log("Bye.");
                    //$state.go('login', {}, {reload: true});
                    window.location = "index.html";  //reload, clear cache

        	})
		}
})
/******************************END OF LOGIN CONTROLLER************************************************/





/******************************SIGN UP CONTROLLER************************************************/
.controller('SignUpController',function($scope,$location,$rootScope, LoginService, Backand) {
 	var vm = this;

     vm.signup = signup;
	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments to be run once
	// controller is invoked
	init();

	function init(){
	 $scope.username = Backand.getUsername();
	      		console.log("SignUpController mga beh.");
	};
	
	$scope.back = function(){
		vm.firstName = '';
		vm.lastName = '';
		$location.path('/login');
	};
	
	function signup(){
		vm.firstName = '';
		vm.lastName = '';
		var parameters = {address: vm.address, description: vm.description, shopname:vm.shopname, role:'Owner'};
            LoginService.signup(vm.firstName, vm.lastName, vm.email, vm.password, vm.again, parameters)
                .then(function (response) {
                    // success
         
                    onLogin();
                }, function (reason) {
                    if(reason.data.error_description !== undefined){
                      $scope.error_message = reason.data.error_description;
                    }
                    else{
                      $scope.error_message = reason.data.error_description;
                    }
                });
	}

        function onLogin() {
		        $rootScope.$broadcast('authorized');
		        $rootScope.username = vm.email;
		        $location.path('/home');
		        
        }
	this.message = "Hello Home!";

})
/******************************END OF SIGN UP CONTROLLER************************************************/






/******************************HOME/REQUEST CONTROLLER************************************************/
.controller('HomeController',function($timeout, $scope,$location,$rootScope,Backand, AuthService, DashService, RequestService, ClockService) {

	// Just a housekeeping.
	// In the init method we are declaring all the
	// neccesarry settings and assignments to be run once
	// controller is invoked
	init();
	
	function init(){

	      		console.log("Home Controller initialized.");
	      		 angular.element('.button-collapse').sideNav();
                 angular.element('#tabletab1').DataTable().destroy();
                 angular.element('.parallax').parallax();      
	      		 if(Backand.getUsername() == null){
	      		 		$location.path('/login');
	      		 }
	      		 else{
	      		 		$scope.username = Backand.getUsername();
	      		 }
	      		 $scope.status = '';

                         
                AuthService.getUserDetails().then(function(data){
                      $scope.userData = data;
                      $scope.all = [];

                     DashService.getShopRequests(data.id).then(function(result){
                            /*request object*/
                        $scope.all = result.data;
                        //Initialize datatable
                        $timeout(function(){
                            	var table = angular.element('#tabletab1').DataTable({"order": [[ 0, "desc" ]]});
                         }, 0, false);
                   
                      });
                      
                    
                });

	};
	
	$scope.refresh = function(){
		console.log("Reloading table..");
		init();
			
	}
	
		Backand.on('items_updated', function (data) {
	 			 //Get the 'items' object that have changed
	 			 console.log("requests updated!!");
	  			console.log(data);
	  			 Materialize.toast('You have new requests', 4000)
	  			init();
		});
        
		$scope.edit = function(object){
				$scope.status = '';
				$scope.object = [];
				$scope.object = object;			
				 angular.element('#modal1').openModal();
		}
        
	$scope.update = function(request_id){
		console.log(request_id);
		var newObject = {
	   		"status" : $scope.status
	   	};
		RequestService.update(request_id, newObject).then(function(response){
		        console.log(response);       
		        var logEntry = $scope.object;
		        logEntry.shop_id = $scope.userData.id;
		        logEntry.status = $scope.status;
		        logEntry.activity = "Status changed to " + logEntry.status;
		
		        RequestService.addToLog(logEntry).then(function(response){
		        		 		//Refresh pending requests
								 $scope.refresh();
		        });
		  });
	}
              
	$scope.logout = function(){
		Backand.signout();
		$location.path('/login');
	}

	this.message = "Hello Home!";
        

})
/******************************END OF HOME/REQUEST CONTROLLER************************************************/



/******************************COURSE CONTROLLER************************************************/
.controller('CoursesController',function($scope,$location,$rootScope, $timeout, AuthService, CourseService, Backand, ClockService) {

	init();

	function init(){
				$scope.vm = {};
	      		console.log("Courses Controller Initialized.");
				 if(Backand.getUsername() == null){
	      		 		$location.path('/login');
	      		 }
	      		 else{
	      		 		$scope.username = Backand.getUsername();
	      		 }
				  angular.element('.button-collapse').sideNav();
				 angular.element('#tabletab2').DataTable().destroy();

				 				 AuthService.getUserDetails().then(function(data){
								     console.log(data.id);
								      $scope.shopData = data;

								     CourseService.getCourses(data.id).then(function(result){
								        /*request object*/
								        $scope.courses = result.data.data;	
								        //Initialize datatable
								        $timeout(function(){
								         	 	var table = angular.element('#tabletab2').DataTable({"order": [[ 1, "asc" ]]});
								         }, 0, false);
								   
								      });
								      								    
								});

	};
	
	$scope.open = function(id){
			$location.path('/courses/'+id);
	};
	
	$scope.add = function(){
				 angular.element('#modal1').openModal();
	};
	$scope.addCourse = function(){
			$scope.vm.shop = $scope.shopData.id;
			console.log($scope.vm);
					CourseService.addCourse($scope.vm).then(function(response){
								console.log(response);
								 init();
					});
			 angular.element('#modal1').closeModal();
			
	};
	
	$scope.deleteCourse = function(id){
			var answer = confirm("Delete course? (The action will delete this entry including all its files)");
			if (answer){
				  CourseService.deleteCourse(id).then(function(response){
								console.log(response);
								init();
					});
			}
			else{
					//some code
			}
			
	}
	
	
	$scope.edit = function(data){
		$scope.vm = {};
	    $scope.vm = data;
	    console.log($scope.vm)
		angular.element('#modal2').openModal();
		
	}
	$scope.editCourse = function(){
			var id = $scope.vm.id;
			var object = {};
			object = $scope.vm;
			
			CourseService.editCourse(id, object).then(function(response){
								console.log(response);
								init();
					});
			angular.element('#modal2').closeModal();
	}
	
	$scope.logout = function(){
		Backand.signout();
		$location.path('/login');
	}
	
})
/******************************END OF COURSE CONTROLLER************************************************/


/******************************FILE CONTROLLER***********************************************************/
.controller('FileController',function($scope,$location,$rootScope, LoginService, FileService, Backand, $routeParams, $timeout, AuthService, ClockService) {

	init();

	function init(){
				$scope.vm = {};
	      		console.log("File Controller mga beh.");
	      		
				if(Backand.getUsername() == null){
	      		 		$location.path('/login');
	      		 }
	      		 else{
	      		 			 AuthService.getUserDetails().then(function(data){
								      $scope.shopData = data;
							});

	      		 }
	      		 
				angular.element('.button-collapse').sideNav();
				angular.element('#tabletab2').DataTable().destroy();
				$scope.courseId = $routeParams.courseId;

				 FileService.getFiles($scope.courseId).then(function(result){
								         /*request object*/
								        $scope.files = result.data.data;
										
								        //Initialize datatable
								        $timeout(function(){
								         	 			var table = angular.element('#tabletab2').DataTable({"order": [[ 1, "asc" ]]});
								         }, 0, false);
								   
								      });
								
	};
	$scope.back = function(){
			$location.path('/courses');
	};
		$scope.open = function(id){
			$location.path('/courses/'+id);
	};
	
	$scope.add = function(){
	console.log("add");
				 angular.element('#modal1').openModal();
	};
	$scope.addFile = function(){
			//Create date uploaded element
			var date = new Date();
		   date =  ("00" + (date.getMonth() + 1)).slice(-2) + "/" + 
						("00" + date.getDate()).slice(-2) + "/" + 
						date.getFullYear() + " " + 
						("00" + date.getHours()).slice(-2) + ":" + 
						("00" + date.getMinutes()).slice(-2) + ":" + 
						("00" + date.getSeconds()).slice(-2)
						
			$scope.vm.date_uploaded = date;
			$scope.vm.course = $scope.courseId;
			console.log($scope.vm);
					FileService.addFile($scope.courseId,$scope.vm).then(function(response){
								console.log(response);
								 init();
					});
			 angular.element('#modal1').closeModal();
			
	};
	
	$scope.deleteFile = function(id){

			var answer = confirm("Are you sure you want to delete this file? ");
			if (answer){
				 	FileService.deleteFile(id).then(function(response){
								console.log(response);
								init();
					});		
			}
			else{
					//some code
			}
			
	}
	$scope.edit = function(data){
		$scope.vm = {};
	    $scope.vm = data;
	    console.log($scope.vm)
		angular.element('#modal2').openModal();
		
	}
	$scope.editFile = function(){
			var id = $scope.vm.id;
			var object = {};
			object = $scope.vm;
			
			FileService.editFile(id, object).then(function(response){
								console.log(response);
								init();
			});
			angular.element('#modal2').closeModal();
	}
	
	$scope.logout = function(){
		Backand.signout();
		$location.path('/login');
	}
	
})
/******************************END OF FILE CONTROLLER************************************************/


/******************************SETTINGS CONTROLLER************************************************/
.controller('SettingsController',function($scope,$location,$rootScope, LoginService, Backand, AuthService, ClockService, SettingService) {

	init();

	function init(){
				if(Backand.getUsername() == null){
	      		 		$location.path('/login');
	      		 }
	      		 else{
	      		 		$scope.username = Backand.getUsername();
	      		 }
				$scope.vm = {};
			   	angular.element('.button-collapse').sideNav();
	      		console.log("Settings Controller.");	
	      		AuthService.getUserDetails().then(function(data){
                      $scope.vm = data;
	      		 });
			   
	};
	
	$scope.editSettings = function(){
			SettingService.update($scope.vm.id, $scope.vm).then(function(){
						init();
			});
	}
	
	$scope.logout = function(){
		Backand.signout();
		$location.path('/login');
	}
	
})
/******************************END OF SETTINGS CONTROLLER************************************************/



/******************************LOGS CONTROLLER************************************************/
.controller('LogsController',function($scope,$location,$rootScope, LoginService, Backand, ClockService,AuthService, LogService, $timeout) {

	init();

	function init(){
			  angular.element('.button-collapse').sideNav();
			  angular.element('#tabletab1').DataTable().destroy();	
	      		console.log("AboutController mga beh.");
				if(Backand.getUsername() == null){
	      		 		$location.path('/login');
	      		 }
	      		 else{
	      		 		$scope.username = Backand.getUsername();
	      		 		AuthService.getUserDetails().then(function(data){
	      		 				$scope.shopData = data;
	      		 				LogService.getLogs($scope.shopData.id).then(function(result){
	      		 						$scope.all = result.data.data;
	      		 						
	      		 						$timeout(function(){
                            					var table = angular.element('#tabletab1').DataTable({"order": [[ 0, "desc" ]]});
                       			 		 }, 0, false);
	      		 				});			
	      		 				 
                         
	      		 		});
	      		 		
	      		 		
	      		 }      		 
	};
	
	$scope.logout = function(){
		Backand.signout();
		$location.path('/login');
	}

});
/******************************END OF LOGS CONTROLLER************************************************/


/***END OF CONTROLLER.JS***/
