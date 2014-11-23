angular.module('SampleApp', ['ShoppingCart']);

angular.module('SampleApp')
	.controller('SampleController', SampleController);

	SampleController.$injector = ['$scope', 'cart', 'cartItem'];
	function SampleController ($scope, cart, cartItem) {

		var products = [
			{			
				id:1,
				description: 'sample product A',
				name: 'product A',
				price: 100,
				imageUrl: 'http://www.stockfreeimages.com/Wine-bag-and-a-bottle-of-wine-thumb2170010.jpg'
			},
			{			
				id:2,
				description: 'sample product B',
				name: 'product B',
				price: 200,
				imageUrl: 'http://www.stockfreeimages.com/Wine-glass-and-bottle-of-wine-thumb3651336.jpg'
			},
			{			
				id:3,
				description: 'sample product C',
				name: 'product C',
				price: 300,
				imageUrl: 'http://www.stockfreeimages.com/Wine-thumb9932265.jpg'
			}
		]

		var vm = this;
		vm.products = products;
	}