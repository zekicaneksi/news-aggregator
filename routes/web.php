<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

use App\Models\Source;
use App\Models\Author;
use App\Models\Keyword;
use App\Models\Category;
use App\Models\News;
use App\Models\NewsKeywords;

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

	// Extracts keywords from a text
	function extractKeywords($text) {
	    // Convert to lower-case
	    $text = strtolower($text);

	    // Clear punctuations
	    $text = preg_replace("/[^\p{L}\p{N}\s]/u", "", $text);

	    // Convert the text to array by spaces
	    $words = explode(" ", $text);

	    // Remove recurring words
	    $words = array_unique($words);

	    // Clear empty words
	    $words = array_filter($words);

	    // Return the first 5 words
	    return array_slice($words, 0, 5);
	}

	function prepareNewsApi() {
		$json_response = Storage::disk('local')->get('newsapi.json');
		$json_response = json_decode($json_response, true);
		
		foreach ($json_response['articles'] as $key => $value) {
		
			//Skip if the news exists in the database
			$doesNewsExist = News::where('external_link', '=', substr($value['url'],0,255))->first();
			if ($doesNewsExist !== null) {
			   continue;
			}
		
			$source = Source::firstOrCreate(
			    ['name' => $value['source']['name']]
			);
			
			$author = Author::firstOrCreate(
			    ['name' => $value['author']]
			);
			
			$leadParagraph = $value['description'];
			
			$keywords = array();
			$extracted_keywords = extractKeywords($leadParagraph);
			
			// Insert each keyword into database if not exists
			foreach ($extracted_keywords as $extracted_keyword){
				$keyword = Keyword::firstOrCreate(
				    ['name' => $extracted_keyword]
				);
				array_push($keywords, $keyword);
			}
			
			$category = Category::firstOrCreate(
			    ['name' => extractKeywords($value['title'])[0]]
			);
			
			// Create and save the news
			$news = new News;
			$news->headline = substr($value['title'],0,255);
			$news->multimedia_url = substr($value['urlToImage'],0,255);
			$news->lead_paragraph = substr($leadParagraph,0,255);
			$news->category_id = $category->id;
			$news->date = date('Y:m:d', strtotime($value['publishedAt']));
			$news->source_id = $source->id;
			$news->author_id = $author->id;
			$news->external_link = substr($value['url'],0,255);
			
			$news->save();
			
			// Insert news-keyword pairs
			foreach ($keywords as $keyword) {
				NewsKeywords::firstOrCreate([
					'news_id' => $news->id,
			    		'keyword_id' => $keyword->id
		    		]);
			}
		}
	}
	

	prepareNewsApi();
    
    return 'OK';
});
