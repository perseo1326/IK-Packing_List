
'use strict';

const footerVersion = document.getElementById("version-footer");
const shipmentData = document.getElementById("shipment-data");

const loadingFrame = document.getElementById("loading-frame");
const loadFileLabel = document.getElementById("shipment-data-label");

const dataTable = document.getElementById("data");



const VERSION = "1.0";

let contentData = [];




    // *********************************************************
    // Event Listeners

    shipmentData.addEventListener('change', openFile );


    // *********************************************************
    // *********************************************************
    // code to be executed loading page.
    initializePage();

    // *********************************************************
    // Function to initialize the original values
    function initializePage() {
        console.log("Inicializando valores originales...");
        document.getElementById("title").innerText = document.title = "Generador Packing List - GALEX";
        
        footerVersion.innerText = "Versión " + VERSION + footerVersion.innerText;
        contentData = [];


    }

    // *********************************************************
    // Function to read a selected file
    function openFile(evento) {
        
        dataTable.innerHTML = "";
        let html = "";

        let file = evento.target.files[0];
        loadingFrame.classList.remove("no-visible");

        let fileStatus = new ExcelFileOpen(file);

        loadFileLabel.innerText = fileStatus.file.name;

        const promiseData = loadExcelFile(fileStatus);

        promiseData.then( (response) => {
            contentData = response;

            contentData.forEach( ( row ) => {

                html += "<tr>";
                console.log("FILA: ", row);
                
                    for (const cell in row) {
                        if (Object.hasOwnProperty.call( row, cell)) {
                            const element = row[cell];
                            console.log("Celda : ", element);
                            html += "<td>";
                            html += element;
                            html += "</td>";
                        }
                    }
                    html += "</tr>";
                });
                dataTable.innerHTML = html;
            })
            .catch( (error) => {
                console.log("ERROR:openFile: ", error);
                alert(error.message);
                initializePage();
            })
            .finally( () => {
                loadingFrame.classList.add("no-visible");
                // process and clean info from the file
                // let arrayExcel = readReportsExcel(excelFile.file, contentFile);
                console.log("Carga \"" + fileStatus.file.name + "\" Finalizada!", contentData); 
            });
    }

    // *********************************************************


    
    // *********************************************************
    // *********************************************************




