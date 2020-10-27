document.addEventListener("DOMContentLoaded", () => {
    console.log("ini nAVVV")
    // Active sidebar nav
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
    loadNav();

    // Load Page content
    let page = window.location.hash.substr(1);
    if (page == "") page = "home";
    loadPage(page);

    // hapus class active jika brand logo di klik
    document.querySelector(".brand-logo").addEventListener("click", (event) => { 
        loadPage("home");  
        for (let item of document.querySelectorAll('.nav-mobile-item')) {
            item.classList.remove("active");
        }
    });
});

// blok yang di eksekusi pertama kali
function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status != 200) return;

            // Muat daftar menu
            document.querySelectorAll(".topnav, .sidenav").forEach((elm) => elm.innerHTML = xhttp.responseText);

            // Daftarkan event listener untuk setiap tautan menu
            document.querySelectorAll(".sidenav a, .topnav a").forEach((elm) => {
                elm.addEventListener("click", (event) => {
                    // Tutup sidenav
                    let sidenav = document.querySelector(".sidenav");                        
                    M.Sidenav.getInstance(sidenav).close();
                    
                    
                    // Muat konten halaman yang di panggil
                    page = event.target.getAttribute("href").substr(1);
                    // delete css active pada nav
                    for (let item of document.querySelectorAll('.nav-mobile-item')) {
                        item.classList.remove("active");
                    }
                    loadPage(page);
                    // tambah css active pada new page
                    document.getElementById(page).classList.add("active");
                    document.getElementById("preloader").style.display = 'block';

                })
            })
        }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
}

// Blok untuk menampilkan halaman
function loadPage(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            let content = document.querySelector("#body-content");
            
            document.getElementById("preloader").style.display = 'block';

            if (page === "home") {
                getTeamsFootball();
            } else if (page === "saved") {
                getSavedTeams();
            }

            if (this.status === 200) {
                content.innerHTML = xhttp.responseText;
            } else if (this.status == 404) {
                content.innerHTML = "<p>Halaman tidak di temukan.</p>"
            } else {
                content.innerHTML = "<p>Ups.. halaman tidak dapat di akses.</p>"
            }
        }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
}