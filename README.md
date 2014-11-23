ShoppingCart
============

Angular shopping cart

DEMO
=====
Please go here: [http://jamhsu.github.io/ShoppingCart/](https://jamhsu.github.io/ShoppingCart/sample/shoppingCart_sample.html)

Dependencies
===========
This module depend on [ngStorage](https://github.com/gsklee/ngStorage)

Usage
=====
##Directives
This module support three directives.

### cart-summary
    <div cart-summary></div>

###add-to-cart-button
    <div add-to-cart-button 
        id="{{id}}"
        name="{{name}}"
        price="{{price}}"
        image="{{imageUrl}}">
    </div>

### mini-cart
    <div mini-cart></div>
