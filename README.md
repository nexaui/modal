# @nexaui/modal

Modal components library untuk NexaUI framework.

## Instalasi

```bash
 nexa i pckg@nexaui/modal
```

## Components

### Modal
Component modal dialog dengan berbagai fitur.

#### Props
- `id` - ID unik untuk modal (wajib)
- `title` - Judul modal
- `form` - ID form jika modal berisi form
- `size` - Ukuran modal (sm, md, lg, xl)
- `closeOnEsc` - Tutup modal dengan tombol ESC (boolean)
- `closeOnOverlay` - Tutup modal ketika klik overlay (boolean)
- `centered` - Posisi modal di tengah layar (boolean)

### TextInput
Component input text dengan berbagai fitur.

#### Props
- `label` - Label untuk input field
- `type` - Tipe input (text, email, password, dll)
- `name` - Nama field (wajib)
- `placeholder` - Placeholder text
- `required` - Field wajib diisi (boolean)
- `value` - Nilai default input
- `onChange` - Handler untuk perubahan nilai
- `disabled` - Menonaktifkan input (boolean)

### FileInput 
Component upload file dengan preview dan drag & drop.

#### Props
- `label` - Label untuk input file
- `dragDrop` - Mengaktifkan fitur drag & drop (boolean)
- `multiple` - Mengizinkan upload multiple file (boolean)
- `preview` - Menampilkan preview file (boolean)
- `name` - Nama field (wajib)
- `accept` - Tipe file yang diizinkan (contoh: "image/*,application/pdf")
- `maxSize` - Ukuran maksimal file dalam MB
- `onChange` - Handler ketika file dipilih

## Penggunaan

```jsx
// Modal Basic
<button
  title="Buka Modal"
  class="nx-btn-dark"
  modal="modalBasic"
/>

<Modal
  id="modalBasic"
  title="Modal Basic">
  <div>
    Ini adalah konten modal
  </div>
  <footer>
    <button title="Tutup" class="nx-btn-secondary" close="modalBasic" />
  </footer>
</Modal>

// Modal dengan Form
<button
  title="Tambah Data"
  class="nx-btn-dark"
  modal="formAdd"
/>

<Modal
  title="Form Modal"
  form="formAdd"
  id="formAdd">
  <TextInput 
    label="Username"
    name="username"
    iconLeft="fas fa-user"
    placeholder="Masukkan username"
  />
  <footer>
    <button title="Batalkan" class="nx-btn-secondary" close="formAdd" />
    <button title="Simpan" class="nx-btn-primary" id="formAdd-submit" />
  </footer>
</Modal>
```

## Styling
Component menggunakan class styling default NexaUI:

- `.nx-modal` - Style dasar untuk modal
- `.nx-modal-header` - Style untuk header modal
- `.nx-modal-body` - Style untuk body modal
- `.nx-modal-footer` - Style untuk footer modal
- `.nx-modal-overlay` - Style untuk overlay modal

## Event Handling

```jsx
const nexaUi = new NexaUI();
// Inisialisasi modal
const modal = nexaUi.Modal()
// Aktifkan modul modal 
modal.init();

// Event listener untuk modal aktif
modal.active((data) => {
  console.log(data);
});

// Event listener untuk form di dalam modal
nexaUi.ScriptKey("Modal.js").then((key) => {
  nexaUi.createForm({
    formid: "formAdd",
    submitid: "formAdd-submit",
    credensial: "BC948-67AB6-EA185-1001B",
    argument: key.uid,
    method: "formSend",
    validasi: {
      username: [3],
    },
  },
  (result) => {
    // Handler response
    console.log(result.response);
  });
});
```

## Dokumentasi
Dokumentasi lengkap dapat dilihat di [https://tatiye.net/docs/modal](https://tatiye.net/docs/modal)

## Lisensi
MIT License - Copyright (c) 2024 NexaUI
