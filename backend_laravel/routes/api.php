<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Classes\News;
use App\Models\Category;
use App\Models\Source;
use App\Models\Keyword;
use App\Models\News as NewsModel;

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

Route::get('/get-categories', function (Request $request) {
    $categories = Category::all();
	return json_encode($categories);
});

Route::get('/get-sources', function (Request $request) {
    $sources = Source::all();
	return json_encode($sources);
});

Route::get('/get-keywords', function (Request $request) {
    $search=$request->get('search');
    $keywords = Keyword::where('name', 'LIKE', '%'.$search.'%')->limit(20)->get();

    return json_encode($keywords);
});

Route::get('/get-news', function (Request $request) {

    $query = DB::table('news');

    if($request->has('keyword_id') ) {
        $query->join('news_keyword', 'news.id', '=', 'news_keyword.news_id')
              ->where('news_keyword.keyword_id', '=', $request->query('keyword_id'));
    }

    if($request->has('category_id') ) {
        $query->where('news.category_id', '=', $request->query('category_id'));
    }

    if($request->has('source_id') ) {
        $query->where('news.source_id', '=', $request->query('source_id'));
    }

    if($request->has('date_from') ) {
        $query->where('news.date', '<', $request->query('date_from'));
    }

    if($request->has('date_to') ) {
        $query->where('news.date', '>', $request->query('date_to'));
    }


    $query->join('author', 'author.id' , '=', 'news.id');
    $query->join('category', 'category.id' , '=', 'news.id');
    $query->join('source', 'source.id' , '=', 'news.id');

    $query->select('author.name as author_name', 'source.name as source_name', 'headline', 'lead_paragraph', 'news.id', 'multimedia_url', 'category.name as category_name', 'external_link', 'date');

    $result = $query->skip($request->query('page')*10)->take(10)->get();

    return json_encode($result);
});
