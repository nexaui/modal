<?php
namespace package\modal;
use app\Nexa;

/**
 * Class modalclass
 * Class untuk menangani operasi CRUD pada tabel user
 */
class modalclass {
    
    /**
     * Constructor class modalclass
     */
    public function __construct() {
       
    }

    /**
     * Mengambil data user berdasarkan ID untuk keperluan penghapusan
     * @param array $data Array berisi order ID yang akan dihapus
     * @return array Data user yang akan dihapus
     */
    public function formDelete($data) {
        Nexa::resetConnection(); 
        // Menggunakan Nexa untuk query
        $user = Nexa::Brif('user')
            ->select(['id', 'userid', 'nama', 'email', 'password'])
            ->where(
                'id', $data['order']
            )
            ->first();

        return $user;
    }

    /**
     * Mengambil data user berdasarkan ID untuk ditampilkan di modal
     * @param array $row Array berisi order ID yang akan ditampilkan
     * @return array Data user yang akan ditampilkan
     */
    public function formModal($row) {
        Nexa::resetConnection(); 
        // Menggunakan Nexa untuk query
        $user = Nexa::Brif('user')
            ->select(['id', 'userid', 'nama', 'email', 'password'])
            ->where(
                'id', $row['order']
            )
            ->first(); 

        return $user;
    }

    /**
     * Menyimpan data user baru ke database
     * @param array $data Array berisi data user yang akan disimpan
     * @return array Response hasil operasi penyimpanan
     */
    public function formSend($data) {
        try {
            Nexa::resetConnection(); 
            $insertResult = Nexa::Brif('user')
                ->insert([
                    'nama' => $data['username'],
                    'time' => date('H:i:s')
                ]);

            return [
                'type' => 'formResponse',
                'status' => 'success',
                'data' => $insertResult,
                'message' => 'Data berhasil disimpan'
            ];

        } catch (\Exception $e) {
            return [
                'type' => 'formResponse',
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Mengupdate data user yang sudah ada
     * @param array $data Array berisi data user yang akan diupdate
     * @param array|string $order Array atau string berisi ID user yang akan diupdate
     * @return array Response hasil operasi update
     */
    public function formUpdate($data, $order='') {
        try {
            Nexa::resetConnection(); 
            $insertResult = Nexa::Brif('user')
                ->where('id', $order['order'])
                ->update([
                    'nama' => $data['nama']
                ]);
        
            return [
                'type' => 'formResponse',
                'status' => 'success',
                'data' => $data,
                'message' => 'Data berhasil diupdate'
            ];

        } catch (\Exception $e) {
            return [
                'type' => 'formResponse',
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Menghapus data user dari database
     * @param array $data Array data tambahan (jika diperlukan)
     * @param array|string $order Array atau string berisi ID user yang akan dihapus
     * @return array Response hasil operasi penghapusan
     */
    public function sendDelete($data, $order='') {
        try {
            Nexa::resetConnection(); 
            $insertResult = Nexa::Brif('user')
                ->where('id', $order['order'])
                ->delete();
        
            return [
                'type' => 'formResponse',
                'status' => 'success',
                'data' => $data,
                'message' => 'Data berhasil dihapus'
            ];

        } catch (\Exception $e) {
            return [
                'type' => 'formResponse',
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }
}
// Contoh penggunaan
