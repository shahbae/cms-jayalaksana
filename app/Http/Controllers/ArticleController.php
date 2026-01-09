<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
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
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'content'     => ['required', 'string'],
            'thumbnail'   => ['nullable', 'string', 'max:255'],
            'status'      => ['required', 'in:draft,published'],
            'category_id' => ['required', 'exists:categories,id'],
        ]);

        Article::create([
            'title'       => $validated['title'],
            'content'     => $validated['content'],
            'thumbnail'   => $validated['thumbnail'] ?? null,
            'status'      => $validated['status'],
            'category_id' => $validated['category_id'],
            'author_id'   => $request->user()->id,
        ]);

        return to_route('articles.index')
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
