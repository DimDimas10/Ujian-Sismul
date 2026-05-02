<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api', ['filter' => 'cors'], function($routes) {
    // Handle CORS preflight OPTIONS request
    $routes->options('(:any)', function() {
        return response()->setStatusCode(200);
    });
    
    // Rute resource otomatis menangani GET /produk, POST /produk, PUT /produk/:id, DELETE /produk/:id, dll.
    $routes->resource('produk');
    // Rute tambahan untuk update via POST dengan Form-Data
    $routes->post('produk/update/(:num)', 'Produk::update/$1');
});
