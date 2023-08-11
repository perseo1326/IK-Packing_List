

// Excel shipments file manipulation values
const REPORT_EXTENSION_ARRAY = [ "xlsm" ];
const REPORT_WORKBOOK_SHEET = "Data";
const REPORT_MYME_TYPE_ARRAY = ["application/vnd.ms-excel.sheet.macroEnabled.12"];

const ARTICLE_NUMBER = "ARTNO";
const ARTICLE_NAME = "ARTNAME_UNICODE";
const FROM_LOCATION = "FROM_LOCATION";
const BACKFLOW = "BACKFLOW";
const SHIPMENT = "SHIPMENT_NO";

const FIELDS_TO_VALIDATE = [ ARTICLE_NUMBER, ARTICLE_NAME, FROM_LOCATION, SHIPMENT ];

const reportLoadButton = document.getElementById("report-load");
const closeReportFrame= document.getElementById("close-report-frame");
const reportFrame = document.getElementById("report-frame");

const cardPackingList = document.getElementById("card-packing-list");
const cardReport = document.getElementById("card-report");
const copyPackingListButton = document.getElementById("copy-packing-list-button");
const packingListPanel = document.getElementById("packing-list-panel");
const packingListData = document.getElementById("packing-list-data");

let contentDataReport = [];
let packingListArray = [];


// *********************************************************
// Event Listeners

reportLoadButton.addEventListener('change', openReportFile );
closeReportFrame.addEventListener('click', () => {
    reportFrame.classList.add("no-visible");
    document.getElementById("cards-panel").classList.remove("no-visible");
});

cardPackingList.addEventListener('click', packingListReport );

copyPackingListButton.addEventListener('click', () => {
    console.log("Click en Copy Packing List button: ");
    packingListPanel.select();
});

packingListPanel.addEventListener('select', (evento) => {
    console.log("Evento seleccionar: ", evento );
})


// *********************************************************
// *********************************************************




    // *********************************************************
    // Function to read a selected file
    function openReportFile(evento) {
        try {
            
            // validate the user selection for the shipments
            shipmentsArrayMap = validateSelectionShipments( shipmentsData );

            const file = evento.target.files[0];
            loadingFrame.classList.remove("no-visible");

            const excelFile = new ExcelFileOpen(file, REPORT_EXTENSION_ARRAY, REPORT_WORKBOOK_SHEET, REPORT_MYME_TYPE_ARRAY );

            const promiseData = loadExcelFile(excelFile);

            promiseData.then( (response) => {
                
                let contentData = validateReportFile( response, FIELDS_TO_VALIDATE );
                console.log("Carga \"" + excelFile.file.name + "\" Finalizada!", contentData); 

                contentDataReport = removeBackflowRows( contentData );





                document.getElementById("box").classList.add("box");
                document.getElementById("shipments-content").classList.add("no-visible");
                document.getElementById("report-content").classList.remove("no-visible");
            })
            .catch( (error) => {
                console.log("ERROR:openFile-Promise: ", error);
                alert(error.message);
                // initializePage();
            })
            .finally( () => {
                loadingFrame.classList.add("no-visible");
            });
        } catch (error) {
            console.log("ERROR:openFile: ", error);
            alert(error.message);        
        }
    }

    // *********************************************************
    function validateReportFile( dataArray, properties ) {

        const row = dataArray[0];

        for (const columnName of properties ) {
            if (!Object.hasOwn( row, columnName )) {
                console.log("ERROR:validateReportFile: El reporte NO tiene estructura válida.")
                throw new Error("El reporte NO tiene estructura válida.");
            }
        }
        console.log("Reporte válidado correctamente.");
        return dataArray;
    }

    // *********************************************************
    function removeBackflowRows( dataArray ){
        return dataArray.filter( row => {
            return (row[FROM_LOCATION] !== BACKFLOW );
        });
    }

    // *********************************************************
    function createPackingListMap( shipmentsArray, dataArrayReport){

        // console.log("Shipments: ", shipmentsArray, " Data array report: ", dataArrayReport);
        const packingListArray = [];
        let count = 0;
        
        for (const shipmentsMap of shipmentsArray) {
            
            const packingList = new Map();
            
            dataArrayReport.forEach( row => {
                const shipmentId = row[SHIPMENT];
                const refKey = row[ARTICLE_NUMBER];

                if( shipmentsMap.has(shipmentId) ) {
                    if(!packingList.has( refKey ) ) {
                        packingList.set( refKey, { reference : refKey, code : shipmentsMap.get(shipmentId).code } );
                    }
                    packingList.get( refKey ).code++;
                }
            });
            packingListArray[count] = packingList;
            count++;
        }
        return packingListArray;
    }

    // *********************************************************
    function packingListReport () {

        // Create Packing List data structure
        packingListArray = createPackingListMap( shipmentsArrayMap, contentDataReport );

        console.log("Packing List: ", packingListArray);
        
        reportFrame.classList.remove("no-visible");
        copyPackingListButton.classList.remove("no-visible");
        packingListPanel.classList.remove("no-visible");
        document.getElementById("cards-panel").classList.add("no-visible");

        showPackingListData(packingListArray);
    }

    // *********************************************************

    const copyPaste = document.getElementById("copy-paste");
    copyPaste.addEventListener('click', () => {

        copyClipBoard();
        // copyToClipboard("una cadena de texto a copiar!!");
    });


    const copyToClipboard = str => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str);
        return Promise.reject("The Clipboard API is not available.");
        };


    function copyClipBoard() {

        console.log("Copy paste function: ", navigator );
        // navigator.clipboard.readText()
        // .then(text => {
        //     console.log('Texto del portapapeles:', text)
        // })
        // .catch(err => {
        //     console.error('Error al leer del portapapeles:', err)
        // })
    

    
    }

    // *********************************************************
    // *********************************************************
    // *********************************************************
    // *********************************************************



