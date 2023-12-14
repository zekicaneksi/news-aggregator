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
            $table->string('name')->unique();
        });
        
        Schema::create('source', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });
            
        Schema::create('author', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });
        
        Schema::create('keyword', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
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
            $table->string('external_link')->unique();
        });
        
        Schema::create('news_keyword', function (Blueprint $table) {
	    $table->foreignId('news_id')->constrained(
		table: 'news', indexName: 'news_keyword_news_id'
	    )->onUpdate('cascade')->onDelete('cascade');
	    $table->foreignId('keyword_id')->constrained(
		table: 'keyword', indexName: 'news_keyword_keyword_id'
	    )->onUpdate('cascade')->onDelete('cascade');
        });
        
        Schema::create('preference', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
        });
        
        Schema::create('user_preference', function (Blueprint $table) {
            $table->id();
	    $table->foreignId('user_id')->constrained(
		table: 'users', indexName: 'user_preference_user_id'
	    )->onUpdate('cascade')->onDelete('cascade');
	    $table->foreignId('preference_type_id')->constrained(
		table: 'preference', indexName: 'user_preference_preference_id'
	    )->onUpdate('cascade')->onDelete('cascade');
            $table->unsignedBigInteger('preference_target_id');
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
