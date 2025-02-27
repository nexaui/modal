/**
 * Class untuk mengelola fungsionalitas modal dan interaksi form
 * @class ModalHandler
 */
class ModalHandler {
  /**
   * Membuat instance ModalHandler dan menginisialisasi komponen yang diperlukan
   * @constructor
   */
  constructor() {
    this.nexaUi = new NexaUI();
    this.modal = this.nexaUi.Modal();
    this.Storage = this.nexaUi.Client();
    this.modal.init();
    // Inisialisasi DOM
    this.domInstance = this.initializeDom();
    // Setup event listeners
    this.setupModalListeners();
    // Load initial data
    this.loadData();
  }

  /**
   * Menginisialisasi konfigurasi DOM untuk menampilkan data
   * @returns {Object} Instance NexaDom yang telah dikonfigurasi
   */
  initializeDom() {
    const container = {
      elementById: "item",
      search: "searchInput",
      virtualScroll: true,
      chunkSize: 1000,
      pagination: "pagination",
      order: 2,
      searchableFields: ["nama", "id"],
    };
    return this.nexaUi.NexaDom(container);
  }

  /**
   * Memuat data awal dari server
   * @returns {Promise} Promise yang menangani loading data
   */
  loadData() {
    this.Storage.Buckets({
      type: "nexa",
      action: "data",
      credensial: "B8512-7A66D-9149B-A5927",
      data: true,
    })
      .then((response) => {
        try {
          this.domInstance.setData(response);
          const pageInfo = this.domInstance.getCurrentData();
        } catch (error) {
          console.error("Error getting pagination info:", error);
        }
      })
      .catch((error) => {
        console.error("Error in Buckets request:", error);
      });
  }

  /**
   * Mengatur event listener untuk modal
   * Menangani aktivasi modal dan memanggil handler yang sesuai
   */
  setupModalListeners() {
    this.modal.active((event) => {
      const { modalId, order } = event.detail;
      console.log("Modal ID:", modalId);

      if (this[modalId]) {
        const key = order || modalId;
        this[modalId](key);
      } else {
        console.warn(`Handler "${modalId}" tidak ditemukan`);
      }
    });
  }

  /**
   * Handler untuk form penambahan data
   * Membuat form dan menangani submit untuk menambah data baru
   */
  formAdd() {
    this.nexaUi.createForm(
      {
        formid: "formAdd",
        submitid: "sendAdd",
        validasi: {
          nama: [3],
          attachment: [15], // Maximum 15MB
        },
      },
      (result) =>
        this.handleFormSubmit("formUploads", result.response, "formAdd")
    );
  }

  /**
   * Handler untuk form penghapusan data
   * @param {string|number} order - ID atau order dari item yang akan dihapus
   */
  formDelet(order) {
    const foundItem = this.domInstance.getData(order);
    if (!foundItem) {
      console.log(`Item dengan ID tidak ditemukan`);
      return;
    }

    this.nexaUi.NexaVars({
      data: foundItem.data,
      keyExtractor: "row",
    });

    this.nexaUi.createForm(
      {
        formid: "formDelet",
        submitid: "sendDelete",
        value: {
          id: foundItem.data.id,
          file: foundItem.data.images,
        },
      },
      (result) =>
        this.handleFormSubmit("formRemove", foundItem.data, "formDelet")
    );
  }

  /**
   * Handler untuk form update data
   * @param {string|number} order - ID atau order dari item yang akan diupdate
   */
  formUpdate(order) {
    const foundItem = this.domInstance.getData(order);
    console.log(foundItem);
    this.nexaUi
      .createForm(
        {
          formid: "formUpdate",
          submitid: "sendUpdate",
          validasi: {
            name: [3],
            attachment: [15], // Maximum 15MB
          },
          value: {
            id: foundItem.data.id,
            file: foundItem.data.images,
          },
        },
        (result) =>
          this.handleFormSubmit("formUpdate", result.response, "formUpdate")
      )
      .then((form) => {
        form.setValues(foundItem.data);
      });
  }

  /**
   * Menangani submit form dan mengirim data ke server
   * @param {string} action - Tipe aksi yang akan dilakukan (formUploads/formRemove/formUpdate)
   * @param {Object} data - Data yang akan dikirim ke server
   * @param {string} modalId - ID modal yang akan ditutup setelah submit berhasil
   */
  handleFormSubmit(action, data, modalId) {
    this.Storage.Buckets({
      type: "nexa",
      action: action,
      credensial: "B8512-7A66D-9149B-A5927",
      data: data,
    })
      .then((response) => {
        this.domInstance.Reload(response, {
          append: false,
          resetPage: true,
        });
        this.modal.close(modalId);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

// Inisialisasi ModalHandler
const modalInstance = new ModalHandler();
