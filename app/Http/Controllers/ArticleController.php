<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ArticleController extends Controller
{
    /**
     * Display a listing of the articles.
     */
    public function index(Request $request)
    {
        $articles = Article::with(['category', 'author'])
            ->when(
                $request->search,
                fn ($q, $search) =>
                    $q->where('title', 'like', "%{$search}%")
            )
            ->when(
                $request->status,
                fn ($q, $status) =>
                    $q->where('status', $status)
            )
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('articles/index', [
            'articles' => [
                'data' => $articles->getCollection()->transform(fn ($item) => [
                    'id'           => $item->id,
                    'title'        => $item->title,
                    'slug'         => $item->slug,
                    'thumbnail'    => $item->thumbnail,
                    'status'       => $item->status,
                    'published_at' => $item->published_at,
                    'category' => [
                        'id'   => $item->category->id,
                        'name' => $item->category->name,
                    ],
                    'author' => [
                        'id'   => $item->author->id,
                        'name' => $item->author->name,
                    ],
                ]),
                'meta' => [
                    'current_page' => $articles->currentPage(),
                    'last_page'    => $articles->lastPage(),
                    'per_page'     => $articles->perPage(),
                    'total'        => $articles->total(),
                ],
            ],
            'filters' => [
                'search'   => $request->input('search'),
                'status'   => $request->input('status'),
                'per_page' => $request->integer('per_page', 10),
            ],
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function create()
    {
        return Inertia::render('articles/create/index', [
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created article in storage.
     */
    public function store(Request $request)
    {
        // 1. Validasi
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'thumbnail'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status'      => ['required', 'in:draft,published'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        // 2. Generate slug
        $slug = Str::slug($validated['title']);

        // Pastikan slug unik
        $originalSlug = $slug;
        $i = 1;
        while (Article::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $i++;
        }

        // 3. Handle thumbnail upload
        $thumbnailPath = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request
                ->file('thumbnail')
                ->store('articles/thumbnails', 'public');
        }

        // 4. Simpan artikel
        Article::create([
            'title'       => $validated['title'],
            'slug'        => $slug,
            'content'     => $validated['content'],
            'thumbnail'   => $thumbnailPath,
            'status'      => $validated['status'],
            'category_id' => $validated['category_id'],
            'author_id'   => $request->user()->id,
            'published_at' => $validated['status'] === 'published'
                ? now()
                : null,
        ]);

        // 5. Redirect
        return redirect()
            ->route('articles.index')
            ->with('success', 'Artikel berhasil dibuat');
    }



    /**
     * Show the form for editing the specified article.
     */
    public function edit(Article $article)
    {
        return Inertia::render('articles/edit', [
            'article' => [
                'id'          => $article->id,
                'title'       => $article->title,
                'content'     => $article->content,
                'thumbnail'   => $article->thumbnail,
                'status'      => $article->status,
                'category_id' => $article->category_id,
            ],
            'categories' => Category::select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified article in storage.
     */
    public function update(Request $request, Article $article)
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'thumbnail'   => ['nullable', 'string', 'max:255'],
            'status'      => ['required', 'in:draft,published'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        $article->update([
            'title'       => $validated['title'],
            'content'     => $validated['content'],
            'thumbnail'   => $validated['thumbnail'] ?? null,
            'status'      => $validated['status'],
            'category_id' => $validated['category_id'],
        ]);

        return back()->with('success', 'Artikel berhasil diperbarui');
    }

    /**
     * Remove the specified article from storage.
     */
    public function destroy(Article $article)
    {
        $article->delete();

        return back()->with('success', 'Artikel berhasil dihapus');
    }
}
