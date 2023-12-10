<?php

use Illuminate\Support\Facades\Route;

use App\Classes\News as NewsClass;

use Illuminate\Support\Facades\Http;

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

Route::get('/fetch-news-local', function () {

	function getJsonFromStorage($fileName){
		$json_response = Storage::disk('local')->get('news_data/'.$fileName);
		$json_response = json_decode($json_response, true);
		
		return $json_response;
	}

	NewsClass::processNewsApi(getJsonFromStorage('newsapi.json'));
	NewsClass::processTimesApi(getJsonFromStorage('nytimes.json'));
	
	for ($i = 1; $i <= 6; $i++) {
		NewsClass::processGuardianApi(getJsonFromStorage('guardian'.$i.'.json'));
	} 
	
    
	return 'OK';
});

Route::get('/fetch-news-remote', function () {
    
	return 'OK';
});

