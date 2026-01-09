<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ===============================
    // USER MANAGEMENT (ADMIN ONLY)
    // ===============================
    Route::middleware('role:Admin')->group(function () {
        Route::resource('users', UserController::class);
    });

    // ===============================
    // CATEGORY MANAGEMENT (ADMIN ONLY)
    // ===============================
    Route::middleware('role:Admin')->group(function () {
        Route::resource('categories', CategoryController::class);
    });

    // ===============================
    // ARTICLE MANAGEMENT (ADMIN ONLY)
    // ===============================
    Route::middleware('role:Admin')->group(function () {
        Route::resource('articles', ArticleController::class);

        Route::post('tiptap/image-upload', function (Request $request) {
            $validated = $request->validate([
                'file' => ['required', 'file', 'image', 'max:5120'],
            ]);

            $path = $validated['file']->storePublicly('tiptap', 'public');

            return response()->json([
                'url' => asset('storage/'.$path),
            ]);
        })->name('tiptap.image-upload');
    });
});

require __DIR__.'/settings.php';
