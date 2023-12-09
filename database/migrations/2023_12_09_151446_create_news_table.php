<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('source', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
            
        Schema::create('author', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('keyword', function (Blueprint $table) {
            $table->id();
            $table->string('name');
        });
        
        Schema::create('news', function (Blueprint $table) {
            $table->id();
            $table->string('headline');
            $table->string('multimedia_url');
            $table->string('lead_paragraph');
	    $table->foreignId('category_id')->constrained(
		table: 'category', indexName: 'news_category_id'
	    );
            $table->date('date');
	    $table->foreignId('source_id')->constrained(
		table: 'source', indexName: 'news_source_id'
	    );
	    $table->foreignId('author_id')->constrained(
		table: 'author', indexName: 'news_author_id'
	    );
            $table->string('external_link');
        });
        
        Schema::create('news_keyword', function (Blueprint $table) {
	    $table->foreignId('news_id')->constrained(
		table: 'news', indexName: 'news_keyword_news_id'
	    )->onUpdate('cascade')->onDelete('cascade');
	    $table->foreignId('keyword_id')->constrained(
		table: 'keyword', indexName: 'news_keyword_keyword_id'
	    )->onUpdate('cascade')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_keyword');
        Schema::dropIfExists('news');
        Schema::dropIfExists('keyword');
        Schema::dropIfExists('author');
        Schema::dropIfExists('source');
        Schema::dropIfExists('category');
    }
};
