<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;



class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    protected static function booted()
    {
        static::saving(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }
}
