<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// ROUTE UPLOAD UNTUK CKEDITOR (MENGEMBALIKAN RESIDENSI KURSOR LOKAL)
Route::post('/ckeditor-upload', function (Request $request) {
    if ($request->hasFile('upload')) {
        $file = $request->file('upload');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('articles/content-images', $filename, 'public');

        return response()->json([
            'url' => asset('storage/' . $path)
        ]);
    }

    return response()->json(['error' => 'Upload gagal'], 400);
})->name('ckeditor.upload');