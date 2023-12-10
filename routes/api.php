<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Classes\News;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/fetch-news-local', function (Request $request) {

    	function getJsonFromStorage($fileName){
		$json_response = Storage::disk('local')->get('news_data/'.$fileName);
		$json_response = json_decode($json_response, true);
		
		return $json_response;
	}

	News::processNewsApi(getJsonFromStorage('newsapi.json'));
	News::processTimesApi(getJsonFromStorage('nytimes.json'));
	
	for ($i = 1; $i <= 6; $i++) {
		News::processGuardianApi(getJsonFromStorage('guardian'.$i.'.json'));
	} 
	
    
	return 'OK';
});

Route::get('/fetch-news-remote', function (Request $request) {

    	News::fetchDataFromRemote();
    	
	return 'OK';    	
});
