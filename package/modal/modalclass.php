<?php
namespace package\modal;
use app\Nexa;

/**
 * Class classForm
 * Class for managing CRUD form operations including file uploads
 * Provides functionality to save, update, and delete form data
 * and handle file uploads with validation
 */
class modalclass {
    /**
     * @var string Path to upload directory
     */
    private $uploadDir;

    /**
     * Constructor for initializing file upload configuration
     * Sets basic parameters for file uploads such as:
     * - Maximum file size limit (15MB)
     * - File storage directory
     * - Allowed file types (jpeg, png, pdf)
     * - Allowed file extensions
     */
    public function __construct() {
        // Konfigurasi upload file melalui Nexa
        Nexa::configureFileUpload([
            'maxSize' => 15 * 1024 * 1024, // 15MB
            'uploadDir' => true, // Akan menggunakan path dari Nexa.php
            'allowedTypes' => [
                'image/jpeg',
                'image/png',
                'application/pdf',
                'application/msword',                // .doc
                'application/vnd.ms-excel',          // .xls
                'application/vnd.ms-powerpoint',     // .ppt
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',    // .docx
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',          // .xlsx
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',   // .pptx
            ],
            'allowedExtensions' => [
                'jpg', 'jpeg', 'png', 'pdf',
                'doc', 'docx',
                'xls', 'xlsx',
                'ppt', 'pptx'
            ]
        ]);
    }

    /**
     * Fetch data from demo table
     * @param array $data Request parameters
     * @return array Query results or error message
     */
     public function data($data) {
          return $this->handleDataRequest($data);
    }

    /**
     * Handle database data requests
     * Fetches user data from demo table with id, nama, and images columns
     * 
     * @param array $data Request parameters
     * @return array User data or error message if an error occurs
     */
    private function handleDataRequest($data) {
        try {
            // Here you would typically validate credentials against a database
            // For now, we'll return a success response with user data
               Nexa::run(); 
                $user = Nexa::Brif('demo')
                    ->select(['id', 'nama', 'images'])
                    ->orderBy('id', 'DESC')
                    ->get();
            return $user;
        } catch (\Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Delete form data by ID
     * Removes record from demo table and fetches updated data
     * 
     * @param array $data Array containing ID of record to delete
     * @return array Updated data after deletion
     */
    public function formRemove($data) {
        try {
            Nexa::run(); 
            
            // Hapus record dari database
            Nexa::Brif('demo')
                ->where('id', $data['id'])
                ->delete();
            
            try {
                Nexa::deleFile($data['images']);
            } catch (\Exception $e) {
                throw $e;
            }
            
            return $this->handleDataRequest($data);
            
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Failed to remove form data: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Handle new file uploads and save form data
     * Process attachments and save data to database
     * 
     * @param array $data Form data and file to be uploaded
     * @return array Updated data after saving
     */
    public function formUploads($data) {
         $fileInfo = $this->handleAttachment($data['data']);
         $this->saveFile($data['data'],$fileInfo, 1);
        // Return the handleSignin result
         return $this->handleDataRequest($data);
    }


    /**
     * Update existing form data and files
     * Process new attachments and update database record
     * 
     * @param array $data Form data and file to be updated
     * @return array Updated data after update
     */
    public function formUpdate($data) {
         $fileInfo = $this->handleAttachment($data['data']);
         $this->saveFileUpdate($data['data'],$fileInfo, 1);
        // Return the handleSignin result
         return $this->handleDataRequest($data);
    }

    /**
     * Process file attachment uploads
     * Perform validation and upload files using Nexa
     * 
     * @param array $data Form data containing attachment information
     * @return array|null Information about uploaded file or null if no file
     * @throws \Exception If an error occurs during upload
     */
    protected function handleAttachment($data) {

        if (!empty($data['attachment']) && isset($data['attachment'][0]['content'])) {
            try {
                return Nexa::uploadFile($data['attachment'][0]);
            } catch (\Exception $e) {
                // Log error jika diperlukan
                throw $e;
            }
        }
        return null;
    }

    /**
     * Save new form data to database
     * Save uploaded file information and form data to demo table
     * 
     * @param array $data Form data to save (name)
     * @param array $path Information about uploaded file path
     */
    protected function saveFile($data,$path) {
        // $logFile = dirname(__DIR__, 2) . '/package/form/classForm.log';
        // $timestamp = date('Y-m-d H:i:s');
        // $body_data = json_encode($path['path'], true);
        // $logMessage = "[{$timestamp}] {$body_data}" . PHP_EOL;
        // file_put_contents($logFile, $logMessage, FILE_APPEND);

          Nexa::run(); 
          Nexa::Brif('demo')->insert([
              'userid' =>1,
              'images' =>$path['path'],
              'nama'   => $data['nama']
          ]);

    }

    /**
     * Update existing form data in database
     * Update file information and form data based on ID
     * 
     * @param array $data Form data to update (id, name)
     * @param array $path Information about newly uploaded file path
     */
    protected function saveFileUpdate($data,$path) {
                 Nexa::run(); 
               Nexa::Brif('demo')
                ->where('id', $data['id'])
                ->update([
                    'userid' =>1,
                    'images' =>$path['path'],
                    'nama'   => $data['nama']
                ]);
           try {
                Nexa::deleFile($data['file']);
            } catch (\Exception $e) {
                throw $e;
            }


    }

            

}
