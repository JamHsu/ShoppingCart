
angular
	.module('ShoppingCart',['ngStorage'])
	.run(		['cart', '$localStorage', 
		function (cart, $localStorage) {

        // $rootScope.$on('ngCart:change', function(){
        //     ngCart.$save();
        // });
        var cartInStorage;
        if($localStorage.cart) {
        	var json = angular.fromJson($localStorage.cart);
			cartInStorage = json;
        }
		
        if (angular.isObject(cartInStorage)) {
            cart.$restore(cartInStorage);
        } else {
            cart.initalize();
        }

    }])


angular
	.module('ShoppingCart')
	.service('cart', cart);

	cart.$injector = ['$log', 'cartItem', '$localStorage'];
	function cart($log, cartItem, $localStorage) {
		var vm = this;
		// function
		vm.initalize = initalize;
		vm.allItem = allItem;
		vm.addItem = addItem;
		vm.removeItem = removeItem;
		vm.calculateTotal = calculateTotal;
		vm.totalItemCount = totalItemCount;
		vm.getItemById = getItemById;
		vm.indexOfItem = indexOfItem;
		vm.getCart = getCart;
		vm.$restore = restore;
		vm.$saveToStorage = saveToStorage;

		function initalize() {
			vm.$cart = {
				items:[]
			};
		}

		function allItem() {
			return vm.$cart.items;
		}

		function addItem(id, name, price, imageUrl) {
			var item = new cartItem(id, name, price, imageUrl, 1);
			vm.$cart.items.push(item);
			vm.$saveToStorage();
		}

		function removeItem(index) {
			vm.$cart.items.splice(index,1);	
			vm.$saveToStorage();
		}

		function totalItemCount() {
			return vm.$cart.items.length;
		}

		function calculateTotal() {
			var total = 0;
	        angular.forEach(vm.$cart.items, function(item) {
	            total += item.quantity * item.price;
	        })

	        return total;
		}

		function getCart() {
			return vm.$cart;
		}

		function getItemById(id) {
			var items = vm.getCart().items;
			var result;
			angular.forEach(items, function(item) {
				if(id === item.id) {
					result = item;
				}
			});
			return result;
		}

		function indexOfItem(findItem) {
			var items = vm.getCart().items;
			var result;
			angular.forEach(items, function(item, index) {
				if(findItem.id === item.id) {
					result = index;
				}
			});
			return result;
		}

		function restore(cart) {
			vm.initalize();
			angular.forEach(cart.items, function (item) {
                vm.$cart.items.push(new cartItem(item.id,  item.name, item.price, item.imageUrl, item.quantity));
            });
            vm.$saveToStorage();
		}

		function saveToStorage() {
            $localStorage.cart = JSON.stringify(vm.getCart());
        }

	}

angular
	.module('ShoppingCart')
	.factory('cartItem', cartItem);

	cartItem.$injector = ['$log']
	function cartItem($log) {
		// object template
		// {
		// 	 id:1,
		// 	 name:,'item',
		// 	 price:100,
		// 	 description:'abc',
		// 	 quantity:1,
		// 	 imageUrl:'url'
		// }
		var item = function(id, name, price, imageUrl, quantity) {
			this.setId(id);
			this.setName(name);
			this.setPrice(price);
			this.setImageUrl(imageUrl)
			this.setQuantity(quantity);
		}

		item.prototype.setId = function(id) {
			this.id = id;
		}

		item.prototype.getId = function() {
			return this.id;
		}

		item.prototype.setName = function(name) {
			this.name = name;
		}

		item.prototype.getName = function() {
			return this.name;
		}

		item.prototype.setPrice = function(price) {
			if(isNaN(price)) {
				$log.warn('Price only support number, value:' + price);
				this.price = 0;
			} else {
				this.price = price;
			}
			
		}

		item.prototype.getPrice = function() {
			return this.price;
		}

		// item.prototype.setDescription = function(description) {
		// 	this.description = description;
		// }

		// item.prototype.getDescription = function() {
		// 	return this.description;
		// }

		item.prototype.setQuantity = function(quantity) {
			if(isNaN(quantity)) {
				$log.warn('Quantity only support number, value:' + quantity);
				this.quantity = 0;
			} else {
				this.quantity = quantity;
			}
		}

		item.prototype.getQuantity = function() {
			return this.quantity;
		}

		item.prototype.setImageUrl = function(url) {
			this.imageUrl = url;
		}

		item.prototype.getImageUrl = function() {
			return this.imageUrl;
		}

		return item;
 	}

// directive
angular
	.module('ShoppingCart')
	.directive('cartSummary', ShoppingCartSummary);

	ShoppingCartSummary.$injector = ['cart'];
	function ShoppingCartSummary(cart) {
		var directive = {
			restrict: 'EA',
			replace: true,
			templateUrl: 'template/shopping-cart-summary.html',
			link: link
			
		};
		return directive;

		function link(scope, element, attrs) {
			scope.items = cart.allItem();
			scope.removeItem = cart.removeItem;
			scope.calculateTotal = cart.calculateTotal;
		}
	}

// directive
angular
	.module('ShoppingCart')
	.directive('addToCartButton', AddToCartButton);

	AddToCartButton.$injector = ['cart', '$log']
	function AddToCartButton(cart, $log) {
		var directive = {
			restrict: 'EA',
			scope: {
				// item:'=addToCartButton'	
				id: '@',
				name: '@',
				price: '@',
				image: '@'
			},
			// template: '<a href ng-click="addCartItem(id, name, price, image)" class="btn btn-default">add item</a>',
			templateUrl: 'template/add-to-cart-button.html',
			link: link
		};
		return directive;

		function link(scope, element, attrs) {
			scope.addCartItem = cart.addItem; 
			scope.isItemInCart = isInCart;
			scope.removeItem = removeItem;


			if(scope.id === undefined
				|| scope.name === undefined
				|| scope.price === undefined
				|| scope.image === undefined) {
				$log.warn('please check all attribute is configure on add-to-cart-button');
			}
		}

		function isInCart(id) {
			if(id === undefined) {
				$log.warn('isItemInCart not configure argument')
			}

			var item = cart.getItemById(id);
			if(item) {
				return true;
			} else {
				return false;
			}
		}

		function removeItem(id) {
			var item = cart.getItemById(id);
			if(item) {
				var index = cart.indexOfItem(item);
				cart.removeItem(index);
			}
		}
	}

angular
	.module('ShoppingCart')
	.directive('miniCart', MiniCart);

	MiniCart.$injector = ['cart']
	function MiniCart(cart)	{
		var directive = {
			restrict: 'EA',
			template: '<a>Total Item: {{cart.totalItemCount()}}</a><br><a>Total Cost:{{cart.calculateTotal()}}</a>',
			link: link
		};
		return directive;

		function link(scope, element, attrs) {
			scope.cart = cart;
		}
	}

