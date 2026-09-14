<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CkeditorUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'upload' => 'required|image|max:3072',
        ]);

        if ($request->hasFile('upload')) {
            $path = $request->file('upload')->store('articles/content-images', 'public');
            $url = asset('storage/' . $path);

            return response()->json([
                'url' => $url
            ]);
        }

        return response()->json(['error' => 'Gagal upload gambar'], 400);
    }
}