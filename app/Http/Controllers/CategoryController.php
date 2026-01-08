<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $data = Category::query()
            ->when(
                $request->search,
                fn ($q, $search) =>
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('slug', 'like', "%{$search}%")
            )
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10))
            ->withQueryString();

        return Inertia::render('categories/index', [
            'categories' => [
                'data' => $data->getCollection()->transform(fn ($item) => [
                    'id'          => $item->id,
                    'name'        => $item->name,
                    'slug'        => $item->slug,
                    'description' => $item->description,
                ]),
                'meta' => [
                    'current_page' => $data->currentPage(),
                    'last_page'    => $data->lastPage(),
                    'per_page'     => $data->perPage(),
                    'total'        => $data->total(),
                ],
            ],
            'filters' => [
                'per_page' => $request->integer('per_page', 10),
                'search'   => $request->input('search'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:150', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
        ]);

        Category::create($validated);

        return back()->with('success', 'Kategori berhasil dibuat');
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'        => ['required', 'string', 'max:150', "unique:categories,name,{$category->id}"],
            'description' => ['nullable', 'string'],
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}

