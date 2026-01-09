<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'thumbnail',
        'status',
        'published_at',
        'category_id',
        'author_id',
    ];

    protected static function booted()
    {
        static::saving(function ($article) {
            // slug selalu sinkron dengan title
            $article->slug = Str::slug($article->title);

            // auto set publish time
            if ($article->status === 'published' && !$article->published_at) {
                $article->published_at = now();
            }

            // reset publish time jika kembali ke draft
            if ($article->status === 'draft') {
                $article->published_at = null;
            }
        });
    }

    /* =====================
     | Relationships
     ===================== */

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
