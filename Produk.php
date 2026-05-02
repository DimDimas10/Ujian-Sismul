<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ProdukModel;

class Produk extends ResourceController
{
    protected $modelName = 'App\Models\ProdukModel';
    protected $format    = 'json';

    public function index()
    {
        $data = $this->model->findAll();
        foreach ($data as &$item) {
            $item['foto_url'] = base_url('uploads/produk/' . $item['foto']);
        }
        return $this->respond($data);
    }

    public function create()
    {
        $rules = [
            'nama'  => 'required',
            'harga' => 'required|numeric',
            'foto'  => 'uploaded[foto]|max_size[foto,2048]|is_image[foto]|mime_in[foto,image/jpg,image/jpeg,image/png]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $foto = $this->request->getFile('foto');
        if ($foto->isValid() && !$foto->hasMoved()) {
            $namaFoto = $foto->getRandomName();
            $foto->move(FCPATH . 'uploads/produk', $namaFoto);

            $data = [
                'nama'  => $this->request->getPost('nama'),
                'harga' => $this->request->getPost('harga'),
                'foto'  => $namaFoto
            ];

            if ($this->model->insert($data)) {
                return $this->respondCreated(['message' => 'Produk berhasil ditambahkan', 'data' => $data]);
            }
        }
        return $this->fail('Gagal menambahkan produk');
    }

    public function update($id = null)
    {
        $produk = $this->model->find($id);
        if (!$produk) return $this->failNotFound('Produk tidak ditemukan');

        $data = [
            'nama'  => $this->request->getVar('nama'),
            'harga' => $this->request->getVar('harga'),
        ];
        
        $foto = $this->request->getFile('foto');
        if ($foto && $foto->isValid() && !$foto->hasMoved()) {
             $namaFoto = $foto->getRandomName();
             $foto->move(FCPATH . 'uploads/produk', $namaFoto);
             if ($produk['foto']) {
                 $file1 = FCPATH . 'uploads/produk/' . $produk['foto'];
                 $file2 = ROOTPATH . 'uploads/produk/' . $produk['foto'];
                 if (file_exists($file1)) @unlink($file1);
                 if (file_exists($file2)) @unlink($file2);
             }
             $data['foto'] = $namaFoto;
        }

        if ($this->model->update($id, $data)) {
            return $this->respond(['message' => 'Produk berhasil diupdate']);
        }
        return $this->fail('Gagal mengupdate produk');
    }

    public function delete($id = null)
    {
        $produk = $this->model->find($id);
        if ($produk) {
            if ($produk['foto']) {
                $file1 = FCPATH . 'uploads/produk/' . $produk['foto'];
                $file2 = ROOTPATH . 'uploads/produk/' . $produk['foto'];
                if (file_exists($file1)) @unlink($file1);
                if (file_exists($file2)) @unlink($file2);
            }
            $this->model->delete($id);
            return $this->respondDeleted(['message' => 'Produk berhasil dihapus']);
        }
        return $this->failNotFound('Produk tidak ditemukan');
    }
}
