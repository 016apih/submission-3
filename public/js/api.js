var base_url = "https://api.football-data.org/v2/";
var myHeaders = new Headers({'X-Auth-Token':  "b72dec44856a494fa5cb0bc8039f73e6"});

// Blok kode yang akan di panggil jika fetch berhasil
const status = (response)=> {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        // Method reject() akan membuat blok catch terpanggil
        return Promise.reject(new Error(response.statusText));
    } else {
        // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
        return Promise.resolve(response);
    }
}

// Blok kode untuk memparsing json menjadi array JavaScript
const json = (response) => response.json();

// Blok kode untuk meng-handle kesalahan di blok catch
const error = (error) => console.log("Error : " + error)

// Blok kode untuk melakukan request data json
const getTeamsFootball = () => {
    if('caches' in window) {
        caches.match(`${base_url}teams`, {headers: myHeaders,})
            .then((res) => {
                if(res) {
                    res.json().then((data) => {
                        var teamsHTML = "";
                            data.teams.forEach((team) => {
                                let text = `${team.name} [${team.shortName}], is a professional association football club based in ${team.address}. `;
                                teamsHTML += `
                                    <div class="col s12 m4 l4" ">
                                        <div class="card medium valign-wrapper card-item center-align z-depth-3" style="border-radius: 10px; padding: 10px; margin-top: 10px;">
                                            <div class="row center-align">
                                                <div class="col s6 m12 l12 centered">
                                                    <a href="./teamDetail.html?id=${team.id}">
                                                        <div class="card-image waves-effect waves-block waves-light" style="max-height: 275px;">
                                                            <img src="${team.crestUrl}" class="responsive-img" style="max-height: 160px;" alt="img"/>
                                                        </div>
                                                    </a>
                                                </div>
                                                <div class="col s6 m12 l12 card-content centered" style="max-height: 275px;">
                                                    <h6 style="font-weight: bold;">${team.shortName}</h6>
                                                    <div class="divider"></div>
                                                    <p>${text}</p>
                                                    <a href="${team.website}" target="_blank" rel="noopener noreferrer"><b>Info lengkap</b></a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `;
                            });
                            // Sisipkan komponen card ke dalam elemen dengan id #teams
                            document.getElementById("teams").innerHTML = teamsHTML;
                            document.getElementById("preloader").style.display = 'none';
                    })
                }
            })
    }

    fetch(`${base_url}teams`, {headers: myHeaders,})
        .then(status)
        .then(json)
        .then((data) => {
            var teamsHTML = "";
            data.teams.forEach((team) => {
                let text = `${team.name} [${team.shortName}], is a professional association football club based in ${team.address}. `;
                teamsHTML += `
                    <div class="col s12 m4 l4" ">
                        <div class="card medium valign-wrapper card-item center-align z-depth-3" style="border-radius: 10px; padding: 10px; margin-top: 10px;">
                            <div class="row center-align">
                                <div class="col s6 m12 l12 centered">
                                    <a href="./teamDetail.html?id=${team.id}">
                                        <div class="card-image waves-effect waves-block waves-light" style="max-height: 275px;">
                                            <img src="${convertToHttps(team.crestUrl)}" class="responsive-img" style="max-height: 160px;" alt="img"/>
                                        </div>
                                    </a>
                                </div>
                                <div class="col s6 m12 l12 card-content centered" style="max-height: 275px;">
                                    <h6 style="font-weight: bold;">${team.shortName}</h6>
                                    <div class="divider"></div>
                                    <p>${text}</p>
                                    <a href="${team.website}" target="_blank" rel="noopener noreferrer"><b>Info lengkap</b></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
            });
            // Sisipkan komponen card ke dalam elemen dengan id #teams
            document.getElementById("teams").innerHTML = teamsHTML;
            document.getElementById("preloader").style.display = 'none';

        })
        .catch(error);
}

// Blok kode untuk melakukan request data detail
function getTeamById() {
    return new Promise((resolve, reject) => {
        var urlParams = new URLSearchParams(window.location.search);
        var idParam = urlParams.get("id");
        if ("caches" in window) {
            caches.match(`${base_url}teams/${idParam}`, {headers: myHeaders}).then((response) => {
                if (response) {
                    response.json().then((data) => {
                        var detailTeamHTML = `
                            <div class="card" style="border-radius: 10px;">
                                <div class="card-image waves-effect waves-block waves-light">
                                    <img src="${convertToHttps(data.crestUrl)}" style="max-height: 300px" alt="img" />
                                </div>
                                <div class="card-content" style="border-radius:10px">
                                    <table class="striped" >
                                        <thead>
                                        </thead>
                                        <tbody>
                                            <tr >
                                                <th style="width: 25%">Name</th>
                                                <td>: ${data.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Address</th>
                                                <td>: ${data.address}</td>
                                            </tr>
                                            <tr>
                                                <th>Phone</th>
                                                <td>: ${data.phone}</td>
                                            </tr>
                                            <tr>
                                                <th>Email</th>
                                                <td>${(data.email === null) ? "-" : data.email}</td>
                                            </tr>
                                            <tr>
                                                <th>Last Updated</th>
                                                <td>: ${data.lastUpdated}</td>
                                            </tr>
                                            <tr>
                                                <th>Club Colors</th>
                                                <td>: ${data.clubColors}</td>
                                            </tr>
                                            <tr>
                                                <th>Squad</th>
                                                <td>: ${data.squad.map((sq, i)=>sq.name)}</td>
                                            </tr>
            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `;
                        
                        document.getElementById("body-content").innerHTML = detailTeamHTML;
                        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
                        resolve(data);
                    });
                }
            });
        }
        fetch(`${base_url}teams/${idParam}`, {headers: myHeaders})
            .then(status)
            .then(json)
            .then((data) => {
                var detailTeamHTML = `
                    <div class="card" style="border-radius: 10px;">
                        <div class="card-image waves-effect waves-block waves-light">
                            <img src="${convertToHttps(data.crestUrl)}" style="max-height: 300px" alt="img"/>
                        </div>
                        <div class="card-content" style="border-radius:10px">
                            <table class="striped" >
                                <thead>
                                </thead>
                                <tbody>
                                    <tr >
                                        <th style="width: 25%">Name</th>
                                        <td>: ${data.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>: ${data.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Phone</th>
                                        <td>: ${data.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>${(data.email === null) ? "-" : data.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Updated</th>
                                        <td>: ${data.lastUpdated}</td>
                                    </tr>
                                    <tr>
                                        <th>Club Colors</th>
                                        <td>: ${data.clubColors}</td>
                                    </tr>
                                    <tr>
                                        <th>Squad</th>
                                        <td>: ${data.squad.map((sq, i)=>sq.name)}</td>
                                    </tr>
    
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;                
                document.getElementById("body-content").innerHTML = detailTeamHTML;
                document.getElementById("preloader").style.display = 'none';

                resolve(data);
            });
    });
}

// blok kode untuk menngambil data yang sudah di save
function getSavedTeams() {
    getAll().then((teams) => {
        var teamsHTML = "";
        teams.forEach((team) => {
            let text = `${team.name} [${team.shortName}], is a professional association football club based in ${team.address}. `;
                teamsHTML += `
                    <div class="col s12 m4 l4" ">
                        <div class="card medium valign-wrapper card-item center-align z-depth-3" style="border-radius: 10px; padding: 10px; margin-top: 10px;">
                            <div class="row center-align">
                                <div class="col s6 m12 l12 centered">
                                    <a href="./teamDetail.html?id=${team.id}&saved=true">
                                        <div class="card-image waves-effect waves-block waves-light" style="max-height: 275px;">
                                            <img src="${convertToHttps(team.crestUrl)}" class="responsive-img" style="max-height: 160px;" alt="img"/>
                                        </div>
                                    </a>
                                </div>
                                <a class="btn-floating halfway-fab waves-effect waves-light red" onclick={hapusTeam(${team.id})}><i class="material-icons">delete</i></a>
                                <div class="col s6 m12 l12 card-content centered" style="max-height: 275px;">
                                    <h6 style="font-weight: bold;">${team.shortName}</h6>
                                    <div class="divider"></div>
                                    <p>${text}</p>
                                    <a href="${team.website}" target="_blank" rel="noopener noreferrer"><b>Info lengkap</b></a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        });
        // Sisipkan komponen card ke dalam elemen dengan id #body-content
        document.getElementById("teams").innerHTML = teamsHTML;
        document.getElementById("preloader").style.display = 'none';

    });
}
// blok kode untuk mengambil data yang sudah di simpan berdasarkan id
function getSavedTeamById() {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    
    getTeamById(idParam).then((data) => {
        var detailTeamHTML = `
            <div class="card" style="border-radius: 10px;">
                <div class="card-image waves-effect waves-block waves-light">
                    <img src="${convertToHttps(data.crestUrl)}" style="max-height: 300px" alt="img" />
                </div>
                <div class="card-content" style="border-radius:10px">
                    <table class="striped" >
                        <thead>
                        </thead>
                        <tbody>
                            <tr >
                                <th style="width: 25%">Name</th>
                                <td>: ${data.name}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>: ${data.address}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>: ${data.phone}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>${(data.email === null) ? "-" : data.email}</td>
                            </tr>
                            <tr>
                                <th>Last Updated</th>
                                <td>: ${data.lastUpdated}</td>
                            </tr>
                            <tr>
                                <th>Club Colors</th>
                                <td>: ${data.clubColors}</td>
                            </tr>
                            <tr>
                                <th>Squad</th>
                                <td>: ${data.squad.map((sq, i)=>sq.name)}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        `;
    
        document.getElementById("body-content").innerHTML = detailTeamHTML;
        document.getElementById("preloader").style.display = 'none';

    });
}
// Blok untuk menghapus iid
function hapusTeam(id){
    deleteById(id);
    getSavedTeams();
}
// blok convert http
function convertToHttps(data){
    return data.replace(/^http:\/\//i, 'https://');
}