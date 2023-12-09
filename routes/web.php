<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Models\TestModel;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/fetch-news', function () {
    error_log('Some message here.');

	foreach (TestModel::all() as $abc) {
    	echo $abc->name;
	}
	
	$testModel = new TestModel;

	$testModel->name = 'helloMyName';

	$testModel->save();
    
    return 'OK';
});
