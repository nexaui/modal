class ModalHandler {
  /**
   * Constructor untuk inisialisasi ModalHandler
   * Membuat instance NexaUI dan mengatur properti awal
   */
  constructor() {
    this.nexaUi = new NexaUI();
    this.modal = this.nexaUi.Modal();
    this.currentModalId = null;
    this.modalData = null;
    this.initialize("Modal.js");
  }

  /**
   * Menginisialisasi ModalHandler dengan mendapatkan script key
   * @param {string} add - Nama file untuk mendapatkan script key
   */
  async initialize(add) {
    try {
      this.scriptKey = await this.nexaUi.ScriptKey(add);
      this.init();
    } catch (error) {
      console.error("Error getting script key:", error);
    }
  }

  /**
   * Menginisialisasi modal dan mengatur event listener
   */
  init() {
    // aktif modul modal
    this.modal.init();
    this.setupModalListeners();
  }

  /**
   * Mengatur event listener untuk modal
   * Menangani callback ketika modal diaktifkan
   */
  setupModalListeners() {
    this.modal.active((data) => {
      if (typeof this[data.modalId] === "function") {
        this.currentModalId = data.modalId;
        this[data.modalId](data);
      }
    });
  }

  /**
   * Menangani form modal
   * Membuat form dengan konfigurasi tertentu dan menangani response
   * @param {Object} argument - Data yang diperlukan untuk form modal
   */
  formAdd(argument) {
    this.nexaUi.createForm(
      {
        formid: "formidAdd",
        submitid: "sendaAdd",
        credensial: "B8512-7A66D-9149B-A5927",
        method: "formSend",
        validasi: {
          username: [3],
        },
      },
      (result) => {
        if (result.response.status === "success") {
          console.log(result.response);
          this.modal.close(this.currentModalId);
          this.nexaUi.Reload();
        }
      }
    );

    console.log("update", argument);
  }
  /**
   * Menangani form modal
   * Membuat form dengan konfigurasi tertentu dan menangani response
   * @param {Object} argument - Data yang diperlukan untuk form modal
   */
  formModal(argument) {
        console.log("update", argument);
        this.nexaUi.createForm({
            formid: "formid",
            submitid: "send",
            argument: argument,
            credensial: "B8512-7A66D-9149B-A5927",
            method: "formUpdate",
            validasi: {
                nama: [3],
            },
          },
          (result) => {
            if (result.response.status === "success") {
            // Akan dipanggil setiap kali ada response baru
            console.log(result.response);
            this.modal.close(this.currentModalId);
            this.nexaUi.Reload();
            }
          }
        );
  }

  /**
   * Menangani penghapusan form
   * @param {Object} argument - Data yang diperlukan untuk penghapusan
   */
  formDelete(argument) {
    console.log("delete", argument);
        this.nexaUi.createForm({
            formid: "setDelete",
            submitid: "sendDelete",
            argument: argument,
            credensial: "B8512-7A66D-9149B-A5927",
            method: "sendDelete",
            validasi:false,
          },
          (result) => {
            if (result.response.status === "success") {
            // Akan dipanggil setiap kali ada response baru
            console.log(result.response);
            this.modal.close(this.currentModalId);
            this.nexaUi.Reload();
            }
          }
        );
  }
}

// Inisialisasi
const modalHandler = new ModalHandler();

// Contoh penggunaan di Javascript

