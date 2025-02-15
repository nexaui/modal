const nexaUi = new NexaUI();
// Inisialisasi modal
const modal=nexaUi.Modal()
// aktif modul modal 
modal.init();

// Cek status modal aktif 
modal.active((data) => {
  console.log(data);
//    OUTPUT:{
//     "clientId": "NEXA_67af0a4576ea9_1739524677",
//     "modalId": "formDelete",
//     "order": "1201",
//     "timestamp": "2025-02-15T14:47:10+07:00",
//     "page": "modal/7",
//     "key": "NEXA_67af0a4576ea9_1739524677_formDelete"
// }
});


