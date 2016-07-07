angular.module('app.controllers', [])

.controller('homeCtrl', function($scope,$http,sharedCartService,sharedFilterService,showStores) {


	var cart = sharedCartService.cart;
	$scope.noMoreItemsAvailable = false; // lazy load list
  var listings = showStores.getAll()
  .then(stores => {
    console.log(stores)
    $scope.stores = stores.data
  })

  $scope.showStoreProducts = function(products) {
    //console.log(products)
    if (products.viewing) {products.viewing = false}
    else {products.viewing = true;}
  }

	 //show product page
	$scope.showProductInfo=function (id,desc,img,name,price) {
    console.log(id,desc,img,name,price)
		 sessionStorage.setItem('product_info_id', id);
		 sessionStorage.setItem('product_info_desc', desc);
		 sessionStorage.setItem('product_info_img', img);
		 sessionStorage.setItem('product_info_name', name);
		 sessionStorage.setItem('product_info_price', price);
		 window.location.href = "#/page13";
	 };

	 //add to cart function
	 $scope.addToCart=function(id,image,name,price){
		cart.add(id,image,name,price,1);
	 };
})

.controller('menuCtrl', function($scope,$http,sharedCartService,sharedFilterService,showListings) {


	var cart = sharedCartService.cart;
	$scope.noMoreItemsAvailable = false; // lazy load list
  var listings = showListings.getAll()
  .then(items => {
  //  console.log(items)
    $scope.menu_items = items.data
  })

	 //show product page
	$scope.showProductInfo=function (id,desc,img,name,price,quantity) {
  //  console.log(id,desc,img,name,price)
//	console.log($scope.quantity)
		 sessionStorage.setItem('product_info_id', id);
		 sessionStorage.setItem('product_info_desc', desc);
		 sessionStorage.setItem('product_info_img', img);
		 sessionStorage.setItem('product_info_name', name);
		 sessionStorage.setItem('product_info_price', price);
		 window.location.href = "#/page13";
	 };

	 //add to cart function
	 $scope.addToCart=function(id,image,name,price){
		 console.log($scope.quantity)
		cart.add(id,image,name,price,1);
	 };
})

.controller('cartCtrl', function($scope,sharedCartService,$ionicPopup,$state) {

		//onload event-- to set the values
		$scope.$on('$stateChangeSuccess', function () {
			$scope.cart=sharedCartService.cart;
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
		});

		//remove function
		$scope.removeFromCart=function(c_id){
			$scope.cart.drop(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;

		};

		$scope.inc=function(c_id){
			$scope.cart.increment(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
		};

		$scope.dec=function(c_id){
			$scope.cart.decrement(c_id);
			$scope.total_qty=sharedCartService.total_qty;
			$scope.total_amount=sharedCartService.total_amount;
		};

		$scope.checkout=function(){
			if($scope.total_amount>0){
				$state.go('checkOut');
			}
			else{
				var alertPopup = $ionicPopup.alert({
					title: 'No item in your Cart',
					template: 'Please add Some Items!'
				});
			}
		};

})

.controller('checkOutCtrl', function($scope) {
	$scope.loggedin=function(){
		if(sessionStorage.getItem('loggedin_id')==null){return 1;}
		else{
			$scope.loggedin_name= sessionStorage.getItem('loggedin_name');
			$scope.loggedin_id= sessionStorage.getItem('loggedin_id');
			$scope.loggedin_phone= sessionStorage.getItem('loggedin_phone');
			$scope.loggedin_address= sessionStorage.getItem('loggedin_address');
			$scope.loggedin_pincode= sessionStorage.getItem('loggedin_pincode');
			return 0;
		}
	};



})

.controller('indexCtrl', function($scope,sharedCartService) {
	//$scope.total = 10;
})

.controller('loginCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
		$scope.user = {};

		$scope.login = function(user) {
			console.log(user)
			str="http:/localhost:3000/api/users/login";
			//$http.get(str)
			$http.post('http://localhost:3000/api/users/login/', {email: user.email, password: user.password})
			.success(function (res){
				$http.get('http://localhost:3000/api/users/profile/'+res)
				.success(function (response) {

					console.log(response)
					$scope.user_details = response;
					sessionStorage.setItem('loggedin_name', $scope.user_details.name);
					sessionStorage.setItem('loggedin_id', $scope.user_details.email);
					sessionStorage.setItem('loggedin_phone', $scope.user_details.phone);
					sessionStorage.setItem('loggedin_address', $scope.user_details.address);

					$ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true
					});
					lastView = $ionicHistory.backView();
					console.log('Last View',lastView);
					if(lastView.stateId=="checkOut"){ $state.go('checkOut', {}, {location: "replace", reload: true}); }
					else{$state.go('profile', {}, {location: "replace", reload: true});}
				})

			}).error(function() {
					var alertPopup = $ionicPopup.alert({
						title: 'Login failed!',
						template: 'Please check your credentials!'
					});
			});
		};

})

.controller('signupCtrl', function($scope,$http,$ionicPopup,$state,$ionicHistory) {
var host2 = "localhost:3000";
	$scope.signup=function(data){
      console.log(data)
			var link =  'http://localhost:3000/api/users/register';
      //var link = 'https://thawing-brook-24148.herokuapp.com/api/users/register'
      var thisuser = {
      name: data.newName,
      email: data.newEmail,
      username: data.newUsername,
      password: data.pwd1,
      phone: data.newPhone,
      address: {
          city: data.newCity,
          state: data.newState,
          zip: data.newZip,
          address: data.newAddress
      }
  };
//  thisuser.joinDate = moment().format();
  thisuser.authType = 'user';
     console.log(thisuser);
  var user = {
      data: thisuser
  };
			$http.post(link, {user: user })
			.then(function (res){
				$scope.response = res.data;
        console.log(res.data)

				if($scope.response){
					$scope.title="Account Created!";
					$scope.template="Your account has been successfully created!";

					//no back option
					$ionicHistory.nextViewOptions({
						disableAnimate: true,
						disableBack: true
					});
					$state.go('login', {}, {location: "replace", reload: true});

				}else if($scope.response.exists=="1"){
					$scope.title="Email Already exists";
					$scope.template="Please click forgot password if necessary";

				}else{
					$scope.title="Failed";
					$scope.template="Contact Our Technical Team";
				}

				var alertPopup = $ionicPopup.alert({
						title: $scope.title,
						template: $scope.template
				});


			});

	}
})

.controller('filterByCtrl', function($scope,sharedFilterService) {

  $scope.Categories = [
    {id: 1, name: 'Burgers & Wraps'},
    {id: 2, name: 'Drinks'}
  ];

  $scope.getCategory = function(cat_list){
    categoryAdded = cat_list;
	var c_string=""; // will hold the category as string

	for(var i=0;i<categoryAdded.length;i++){ c_string+=(categoryAdded[i].id+"||"); }

	c_string = c_string.substr(0, c_string.length-2);
	sharedFilterService.category=c_string;
	window.location.href = "#/page1";
  };


})

.controller('sortByCtrl', function($scope,sharedFilterService) {
	$scope.sort=function(sort_by){
		sharedFilterService.sort=sort_by;
		console.log('sort',sort_by);
		window.location.href = "#/page1";
	};
})

.controller('paymentCtrl', function($scope) {

})

.controller('profileCtrl', function($scope,$rootScope,$ionicHistory,$state) {

		$scope.loggedin_name= sessionStorage.getItem('loggedin_name');
		$scope.loggedin_id= sessionStorage.getItem('loggedin_id');
		$scope.loggedin_phone= sessionStorage.getItem('loggedin_phone');
		$scope.loggedin_address= sessionStorage.getItem('loggedin_address');
		$scope.loggedin_pincode= sessionStorage.getItem('loggedin_pincode');


		$scope.logout=function(){
				delete sessionStorage.loggedin_name;
				delete sessionStorage.loggedin_id;
				delete sessionStorage.loggedin_phone;
				delete sessionStorage.loggedin_address;
				delete sessionStorage.loggedin_pincode;

				console.log('Logoutctrl',sessionStorage.getItem('loggedin_id'));

				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				$state.go('menu', {}, {location: "replace", reload: true});
		};
})

.controller('myOrdersCtrl', function($scope) {

})

.controller('editProfileCtrl', function($scope) {

})

.controller('favoratesCtrl', function($scope) {

})

.controller('productPageCtrl', function($scope, sharedCartService) {

	//onload event
  	var cart = sharedCartService.cart;
	angular.element(document).ready(function () {
		$scope.id= sessionStorage.getItem('product_info_id');
		$scope.desc= sessionStorage.getItem('product_info_desc');
		$scope.img= sessionStorage.getItem('product_info_img');
		$scope.name= sessionStorage.getItem('product_info_name');
		$scope.price= sessionStorage.getItem('product_info_price');
	});

  $scope.addToCart=function(quantity){
  //  console.log($scope.id,$scope.img,$scope.name,$scope.price)
		//console.log("quantity", quantity)
   cart.add($scope.id,$scope.img,$scope.name,$scope.price,quantity);
  };


})
