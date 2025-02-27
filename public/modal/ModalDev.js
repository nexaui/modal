/**
 * Inisialisasi NexaUI
 * Membuat instance baru dari NexaUI framework
 */
const nexaUi = new NexaUI();
/**
 * Inisialisasi Modal
 * Membuat dan menginisialisasi komponen modal
 */
const modal = nexaUi.Modal();
const Storage = nexaUi.Client();
modal.init();
/**
 * Konfigurasi tampilan data
 * @param {Object} data - Konfigurasi untuk menampilkan data
 * @param {string} data.elementById - ID elemen untuk menampilkan data
 * @param {string} data.sortOrder - Urutan pengurutan (DESC/ASC)
 * @param {string} data.search - ID elemen input pencarian
 * @param {boolean} data.virtualScroll - Mengaktifkan virtual scrolling
 * @param {number} data.chunkSize - Ukuran chunk untuk virtual scrolling
 * @param {Array} data.searchableFields - Field yang dapat dicari
 */
const container = {
  elementById: "item",
  search: "searchInput",
  virtualScroll: true,
  chunkSize: 1000,
  pagination: "pagination",
  order: 2,
  searchableFields: ["nama", "id"],
};
const domInstance = nexaUi.NexaDom(container);
/**
 * Konfigurasi dan Permintaan Data
 * Melakukan request ke server menggunakan Storage.Buckets
 * @param {Object} config - Konfigurasi untuk request
 * @param {string} config.type - Tipe request ('nexa')
 * @param {string} config.action - Aksi yang dilakukan ('signin')
 * @param {string} config.credensial - Kredensial autentikasi
 */

Storage.Buckets({
  type: "nexa",
  action: "data",
  credensial: "BC948-67AB6-EA185-1001B",
  data: true,
})
  .then((response) => {
    try {
      domInstance.setData(response);
      const pageInfo = domInstance.getCurrentData();
    } catch (error) {
      console.error("Error getting pagination info:", error);
    }
  })
  .catch((error) => {
    console.error("Error in Buckets request:", error);
  });

/**
 * Event handler untuk modal aktif
 */
modal.active((event) => {
  const { modalId, order } = event.detail;
  console.log("Modal ID:", modalId);
  // Cek apakah handler tersedia di modalHandlers
  if (typeof modalHandlers[modalId] === "function") {
    const key = order || modalId;
    modalHandlers[modalId](key);
  } else {
    console.warn(`Handler "${modalId}" tidak ditemukan`);
  }
});

/**
 * Object untuk menyimpan modal handler functions
 */
const modalHandlers = {
  formAdd: function (order) {
    nexaUi.createForm(
      {
        formid: "formAdd",
        submitid: "sendAdd",
        validasi: {
          nama: [3],
          attachment: [15], // Maximum 15MB
        },
      },
      (result) => {
        Storage.Buckets({
          type: "nexa",
          action: "formUploads",
          credensial: "BC948-67AB6-EA185-1001B",
          data: result.response,
        })
          .then((response) => {
            domInstance.Reload(response, {
              append: false,
              resetPage: true,
            });
            modal.close("formAdd");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    );
  },

  formDelet: function (order) {
    const foundItem = domInstance.getData(order);
    console.log(foundItem);
    if (foundItem) {
      nexaUi.NexaVars({
        data: foundItem.data,
        keyExtractor: "row",
      });

      // Add click handler for delete confirmation
      nexaUi.createForm(
        {
          formid: "formDelet",
          submitid: "sendDelete",
          value:{
            id: foundItem.data.id,
            file: foundItem.data.images,
          }
        },
        (result) => {
          console.log(result)
            Storage.Buckets({
              type: "nexa",
              action: "formRemove",
              credensial: "BC948-67AB6-EA185-1001B",
              data: foundItem.data,
            })
              .then((response) => {
                domInstance.Reload(response, {
                  append: false,
                  resetPage: true,
                });
                modal.close("formDelet");
              })
              .catch((error) => {
                console.error("Error:", error);
              });
        }
      );
    } else {
      console.log(`Item dengan ID tidak ditemukan`);
    }
  },

  formUpdate: function (order) {
    const foundItem = domInstance.getData(order);
    console.log(foundItem);

    nexaUi
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
        (result) => {
          Storage.Buckets({
            type: "nexa",
            action: "formUpdate",
            credensial: "BC948-67AB6-EA185-1001B",
            data: result.response,
          })
            .then((response) => {
              domInstance.Reload(response, {
                append: false,
                resetPage: true,
              });
              modal.close("formUpdate");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      )
      .then((form) => {
        form.setValues(foundItem.data);
      });
  },
};
