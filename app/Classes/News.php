<?php

namespace App\Classes;

use Illuminate\Support\Facades\DB;

use App\Models\Source;
use App\Models\Author;
use App\Models\Keyword;
use App\Models\Category;
use App\Models\News as NewsModel;
use App\Models\NewsKeywords;

class News
{

	static function fetchDataFromRemote(){
		return 'OK';
	}
	
   	// Extracts keywords from a text
	static function extractKeywords($text) {
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
	    
	    // Remove numeric and less than 3 character words
	    $words = array_filter($words, function($var) {
		  if(strlen($var) < 3 || is_numeric($var)){
		  	return false;
		  }
		  return true;	    
	    });

	    // Return the first 5 words
	    return array_slice($words, 0, 5);
	}
	
	static function doesNewsExist($external_link){
		$news = NewsModel::where('external_link', '=', substr($external_link,0,255))->first();
		if ($news !== null) {
		   	return $news;
		}
		else {
			return false;
		}
	}
	
	static function prepareAndSaveNews($headline, $multimedia_url, $lead_paragraph, $category, $date, $source, $author, $external_link, $keywords){

			$category = Category::firstOrCreate(
			    ['name' => $category]
			);
			
			$source = Source::firstOrCreate(
			    ['name' => $source]
			);
			
			$author = Author::firstOrCreate(
			    ['name' => $author]
			);
			
			$db_keywords = array();
			
			// Insert each keyword into database if not exists
			foreach ($keywords as $val_keyword){
				$keyword = Keyword::firstOrCreate(
				    ['name' => $val_keyword]
				);
				array_push($db_keywords, $keyword);
			}

			$news = new NewsModel;
			$news->headline = substr($headline,0,255);
			$news->multimedia_url = substr($multimedia_url,0,255);
			$news->lead_paragraph = substr($lead_paragraph,0,255);
			$news->category_id = $category->id;
			$news->date = date('Y:m:d', strtotime($date));
			$news->source_id = $source->id;
			$news->author_id = $author->id;
			$news->external_link = substr($external_link,0,255);
			
			$news->save();
			
			// Insert news-keyword pairs
			foreach ($db_keywords as $keyword) {
				NewsKeywords::firstOrCreate([
					'news_id' => $news->id,
			    		'keyword_id' => $keyword->id
		    		]);
			}
			
			return $news;
	}

	static function processNewsApi($json_response) {
		
		foreach ($json_response['articles'] as $key => $value) {
		
			$external_link = $value['url'];
			
			if (News::doesNewsExist($external_link) !== false) {
				continue;
			}
			
			$leadParagraph = $value['description'];

			$extracted_keywords = News::extractKeywords($leadParagraph);
			
			$inserted_news = News::prepareAndSaveNews(
				$value['title'],
				$value['urlToImage'],
				$value['description'],
				News::extractKeywords($value['title'])[0],
				$value['publishedAt'],
				$value['source']['name'],
				$value['author'],
				$external_link,
				$extracted_keywords
			);
		}
	}
	
	static function processGuardianApi($json_response){
		
		foreach ($json_response['response']['results'] as $key => $value) {
		
			$external_link = $value['webUrl'];
			
			if (News::doesNewsExist($external_link) !== false) {
				continue;
			}
			
			$inserted_news = News::prepareAndSaveNews(
				$value['webTitle'],
				$value['fields']['thumbnail'],
				$value['fields']['bodyText'],
				$value['pillarName'],
				$value['webPublicationDate'],
				$value['fields']['publication'],
				$value['fields']['byline'],
				$external_link,
				News::extractKeywords($value['fields']['headline'])
			);
		}
	}
	
	static function processTimesApi($json_response){
		
		foreach ($json_response['response']['docs'] as $key => $value) {
		
			// TimesApi returns very big responses, skip after 100
			if($key === 100) {
				break;
			}
		
			if (count($value['multimedia']) === 0) {
				continue;
			}
		
			$external_link = $value['web_url'];
			
			if (News::doesNewsExist($external_link) !== false) {
				continue;
			}
			
			$keywords = array();
			
			foreach ($value['keywords'] as $keyword) {
				array_push($keywords, $keyword['value']);
			}
			
			$inserted_news = News::prepareAndSaveNews(
				$value['headline']['main'],
				"https://www.nytimes.com/".$value['multimedia'][0]['url'],
				$value['abstract'],
				$value['section_name'],
				$value['pub_date'],
				$value['source'],
				$value['byline']['original'],
				$external_link,
				$keywords,
			);
		}
	}
}

