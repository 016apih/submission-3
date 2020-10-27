var dbPromised = idb.open("subbmission-2", 1, (upgradeDb) => {
    var teamsObjectStore = upgradeDb.createObjectStore("teams", {
        keyPath: "id"
    });
    teamsObjectStore.createIndex("name", "name", { unique: false });
});

// Block data untuk menyimpan data ke database
function saveForLater(team) {
    dbPromised
        .then((db) => {
            var tx = db.transaction("teams", "readwrite");
            var store = tx.objectStore("teams");
            store.add(team);
            return tx.complete;
        })
        .then(() => alert("data Teams berhasil di simpan."));
}

// Block data untuk mengambil semua data yang tersimpan di database
function getAll() {
    return new Promise((resolve, reject) => {
        dbPromised
            .then((db) => {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.getAll();
            })
            .then((teams) => resolve(teams));
    });
}

// Block data untuk mengambil 1 data dari database
function getById(id) {
    return new Promise((resolve, reject) => {
        dbSubmission2
            .then((db) => {
                var tx = db.transaction("teams", "readonly");
                var store = tx.objectStore("teams");
                return store.get(id);
            })
            .then((team) => resolve(team));
    });
}

// Blok data untuk mendelete
function deleteById(id){
    return new Promise((resolve, reject) => {
        dbPromised
        .then((db) => {
            var tx = db.transaction("teams", 'readwrite');
            var store = tx.objectStore("teams");
            store.delete(id);
            tx.complete;
            return store.getAll();
        }).then((teams) => resolve(teams));
    });
}