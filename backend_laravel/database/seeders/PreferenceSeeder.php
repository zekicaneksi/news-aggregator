<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PreferenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('preference')->insert([
            'name' => 'category',
        ]);
        
        DB::table('preference')->insert([
            'name' => 'source',
        ]);
        
        DB::table('preference')->insert([
            'name' => 'author',
        ]);
    }
}
