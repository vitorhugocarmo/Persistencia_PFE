// ==========================================
// PEGAR ELEMENTOS DO HTML
// ==========================================

const btnLocalizar =
    document.getElementById("btnLocalizar");

const latitude =
    document.getElementById("latitude");

const longitude =
    document.getElementById("longitude");

const status =
    document.getElementById("status");

const ultimaLocalizacao =
    document.getElementById("ultimaLocalizacao");

const mapa =
    document.getElementById("mapa");

const papel =
    document.getElementById("papel");

const lixeira =
    document.getElementById("lixeira");


// ==========================================
// LOCALIZAÇÃO DO USUÁRIO
// ==========================================

btnLocalizar.addEventListener(
    "click",

    function () {

        if (!navigator.geolocation) {

            status.textContent =
                "Seu navegador não suporta localização.";

            return;
        }

        status.textContent =
            "Localizando...";


        btnLocalizar.disabled = true;

        btnLocalizar.textContent =
            "Localizando...";


        navigator.geolocation.getCurrentPosition(

            // ==================================
            // SE A LOCALIZAÇÃO FOR ENCONTRADA
            // ==================================

            function (posicao) {

                const lat =
                    posicao.coords.latitude;

                const lon =
                    posicao.coords.longitude;

                const latFormatada =
                    lat.toFixed(6);

                const lonFormatada =
                    lon.toFixed(6);


                // ==================================
                // MOSTRAR AS COORDENADAS NO SITE
                // ==================================

                latitude.textContent =
                    latFormatada;

                longitude.textContent =
                    lonFormatada;


                // ==================================
                // SALVAR A LOCALIZAÇÃO NO NAVEGADOR
                // ==================================

        
                localStorage.setItem(
                    "latitude",
                    latFormatada
                );

                localStorage.setItem(
                    "longitude",
                    lonFormatada
                );


                mostrarUltimaLocalizacao();


                // ==================================
                // ATUALIZAR O MAPA
                // ==================================

                atualizarMapa(
                    lat,
                    lon
                );


                // Mostra uma mensagem de sucesso
                status.textContent =
                    "Localização encontrada!";


                // Libera o botão novamente
                btnLocalizar.disabled =
                    false;

                btnLocalizar.textContent =
                    "Atualizar localização";
            },


            // ==================================
            // SE A LOCALIZAÇÃO DER ERRO
            // ==================================

            function (erro) {


                console.log(erro);


                if (erro.code === 1) {

                    status.textContent =
                        "Você bloqueou a localização. Permita o acesso no navegador.";
                }

                else if (erro.code === 2) {

                    status.textContent =
                        "Não foi possível encontrar sua localização.";
                }

                else if (erro.code === 3) {

                    status.textContent =
                        "A localização demorou muito. Tente novamente.";
                }

                else {

                    status.textContent =
                        "Erro ao encontrar localização.";
                }


                // Libera o botão novamente
                btnLocalizar.disabled =
                    false;

                btnLocalizar.textContent =
                    "Encontrar minha localização";
            },


            // ==================================
            // CONFIGURAÇÕES DA LOCALIZAÇÃO
            // ==================================

            {
               
                enableHighAccuracy: true,

                
                timeout: 15000,


                maximumAge: 0
            }
        );
    }
);


// ==========================================
// ATUALIZAR O MAPA
// ==========================================


function atualizarMapa(lat, lon) {

    const margem = 0.01;

    const minLon =
        lon - margem;

    const minLat =
        lat - margem;

    const maxLon =
        lon + margem;

    const maxLat =
        lat + margem;

    const bbox =
        minLon + "," +
        minLat + "," +
        maxLon + "," +
        maxLat;

    const url =
        "https://www.openstreetmap.org/export/embed.html" +
        "?bbox=" + bbox +
        "&layer=mapnik" +
        "&marker=" + lat + "," + lon;


    mapa.src = url;
}


// ==========================================
// MOSTRAR A ÚLTIMA LOCALIZAÇÃO
// ==========================================

function mostrarUltimaLocalizacao() {

    /*
        Buscando latitude e longitude.
    */
    const lat =
        localStorage.getItem("latitude");

    const lon =
        localStorage.getItem("longitude");


    /*
        Verifica se os dois valores existem.
    */
    if (lat && lon) {

        ultimaLocalizacao.textContent =
            "Sua última localização salva foi: " +
            lat +
            " / " +
            lon;
    }

    else {

        ultimaLocalizacao.textContent =
            "Nenhuma localização salva ainda.";
    }
}


// ==========================================
// RECUPERAR LOCALIZAÇÃO AO ABRIR A PÁGINA
// ==========================================

window.addEventListener(
    "DOMContentLoaded",

    function () {

        /*
            Mostra a última localização salva
            assim que a página é aberta.
        */
        mostrarUltimaLocalizacao();


        /*
            Recupera novamente os valores
            armazenados no localStorage.
        */
        const lat =
            localStorage.getItem("latitude");

        const lon =
            localStorage.getItem("longitude");


        /*
            Se existir uma localização salva,
            ela será mostrada novamente no site.
        */
        if (lat && lon) {

            latitude.textContent =
                lat;

            longitude.textContent =
                lon;


            atualizarMapa(
                parseFloat(lat),
                parseFloat(lon)
            );


            status.textContent =
                "Última localização salva.";
        }
    }
);


// ==========================================
// COMEÇOU A ARRASTAR
// ==========================================

papel.addEventListener(
    "dragstart",

    function (evento) {

        /*
           
            "O objeto que está sendo arrastado é um papel."
        */
        evento.dataTransfer.setData(
            "text/plain",
            "papel"
        );


        /*
            Deixa o papel transparente enquanto
            ele está sendo arrastado.
        */
        papel.style.opacity =
            "0.5";
    }
);


// ==========================================
// TERMINOU DE ARRASTAR
// ==========================================

/*
    dragend acontece quando o usuário termina
    de arrastar o objeto.
*/
papel.addEventListener(
    "dragend",

    function () {

        papel.style.opacity =
            "1";
    }
);

// ==========================================
// PAPEL PASSOU SOBRE A LIXEIRA
// ==========================================

/*
    dragover acontece enquanto o objeto arrastado
    está passando por cima da lixeira.
*/
lixeira.addEventListener(
    "dragover",

    function (evento) {

        /*
        Permite que o elemento aceite o objeto que está
            sendo arrastado.
        */
        evento.preventDefault();

        lixeira.classList.add("ativa");
    }
);


// ==========================================
// PAPEL SAIU DA LIXEIRA
// ==========================================

/*
    dragleave acontece quando o papel deixa
    de passar por cima da lixeira.
*/
lixeira.addEventListener(
    "dragleave",

    function () {

        lixeira.classList.remove("ativa");
    }
);


// ==========================================
// PAPEL FOI SOLTO NA LIXEIRA
// ==========================================

/*
    drop acontece quando o usuário solta
    o objeto dentro da lixeira.
*/
lixeira.addEventListener(
    "drop",

    function (evento) {

        evento.preventDefault();

        lixeira.classList.remove(
            "ativa"
        );

        const objeto =
            evento.dataTransfer.getData(
                "text/plain"
            );


        /*
            Verifica se realmente esta recebendo
            o objeto "papel".

            Se não for o papel, o código para aqui.
        */
        if (objeto !== "papel") {
            return;
        }


        // ==================================
        // APAGAR DADOS DO LOCALSTORAGE
        // ==================================

        localStorage.removeItem(
            "latitude"
        );

        localStorage.removeItem(
            "longitude"
        );


        // ==================================
        // LIMPAR AS COORDENADAS DO GPS
        // ==================================

        latitude.textContent =
            "---";

        longitude.textContent =
            "---";


        // ==================================
        // LIMPAR A ÚLTIMA LOCALIZAÇÃO
        // ==================================

        ultimaLocalizacao.textContent =
            "Nenhuma localização salva ainda.";


        // ==================================
        // VOLTAR O MAPA PARA A VISÃO INICIAL
        // ==================================

        mapa.src =
            "https://www.openstreetmap.org/export/embed.html" +
            "?bbox=-53%2C-33%2C-44%2C-20" +
            "&layer=mapnik";


        // ==================================
        // ATUALIZAR MENSAGEM DO GPS
        // ==================================

        status.textContent =
            "Localização apagada.";

        alert(
            "Localização e dados apagados!"
        );
    }
);