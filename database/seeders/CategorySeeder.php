<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $areas = [
            'Administrasi',
            'Kependudukan',
            'Keuangan',
            'Perencanaan Pembangunan',
            'Pelayanan Publik',
            'Pemerintahan',
            'Badan Permusyawaratan Desa (BPD)',
            'RT/RW',
            'Musyawarah Desa (Musdes)',
            'BUMDes',
            'Aset Desa',
            'Pengadaan Barang/Jasa',
            'Statistik Desa',
            'Digitalisasi Layanan',
            'Lingkungan Hidup',
            'Kesehatan',
            'Pendidikan',
            'Sosial & Kesejahteraan',
            'Ketertiban & Keamanan',
            'Pertanian & Ketahanan Pangan',
        ];

        $aspects = [
            'SOP',
            'Perencanaan',
            'Pelaksanaan',
            'Pelaporan',
            'Regulasi',
        ];

        foreach ($areas as $area) {
            foreach ($aspects as $aspect) {
                $name = "{$area} Desa - {$aspect}";

                Category::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'name' => $name,
                        'description' => "Kategori {$aspect} untuk bidang {$area} pada pemerintahan desa.",
                    ],
                );
            }
        }
    }
}
