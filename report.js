

// Excel shipments file manipulation values
const REPORT_EXTENSION_ARRAY = [ "xlsm" ];
const REPORT_WORKBOOK_SHEET = "Data";
const REPORT_MYME_TYPE_ARRAY = ["application/vnd.ms-excel.sheet.macroEnabled.12"];

const ARTICLE_NUMBER = "ARTNO";
const ARTICLE_NAME = "ARTNAME_UNICODE";
const FROM_LOCATION = "FROM_LOCATION";
const BACKFLOW = "BACKFLOW";
const SHIPMENT = "SHIPMENT_NO";

// Headers for OR130 Report sorted by Order of appearance
// const ARTICLE_NUMBER = 'ARTNO';
// const ARTICLE_NAME = 'ARTNAME_UNICODE';
const SALES_METHOD = 'SALESMETHOD';
const HFB = 'HFB';
const PRODUCT_AREA = 'PRODUCT_AREA';
const SLID_P = 'SLID_P';
const SLID_H = 'SLID_H';
const MSL = 'MSL';
const WORKAREA = 'WORKAREA';
const COMPLETE_CAP_INCL_FLEX = 'COMPLETE_CAP_INCL_FLEX';
const TOTAL_QTY_IN_SALES = 'TOTAL_QTY_IN_SALES';
const SGF_STOCK = 'SGF_STOCK';
// const FROM_LOCATION = 'FROM_LOCATION';
const TO_LOCATION = 'TO_LOCATION';
const MOVED_QTY = 'MOVED_QTY';
const FLOWTYPE = 'FLOWTYPE';
const FULL_PALLET = 'FULL_PALLET';
const SALES_STOP_MARK = 'SALES_STOP_MARK';
// const SHIPMENT = 'SHIPMENT_NO';
const OPEN_PICK_QTY = 'OPEN_PICK_QTY';
const NEW_LOC = 'NEW_LOC';
const NEW_CAP = 'NEW_CAP';
const MHS_ID = 'MHS_ID';


const FIELDS_TO_VALIDATE = [ ARTICLE_NUMBER, ARTICLE_NAME, FROM_LOCATION, SHIPMENT ];

const reportLoadButton = document.getElementById("report-load");
const closeReportFrame= document.getElementById("close-report-frame");
const reportFrame = document.getElementById("report-frame");

const cardPackingList = document.getElementById("card-packing-list");
const cardReport = document.getElementById("card-report");
const copyPackingListButton = document.getElementById("copy-packing-list-button");
const packingListPanel = document.getElementById("packing-list-panel");
const packingListData = document.getElementById("packing-list-data");
const copyReportButton = document.getElementById("copy-report-button");
const reportPanel = document.getElementById("report-panel");
const reportTableHeaders = document.getElementById("report-table-headers");
const reportData = document.getElementById("report-data");

let contentDataReport = [];
let packingListArray = [];


// *********************************************************
// Event Listeners

reportLoadButton.addEventListener('change', openReportFile );
closeReportFrame.addEventListener('click', () => {
    reportFrame.classList.add("no-visible");
    document.getElementById("cards-panel").classList.remove("no-visible");
    title.innerText = titleMain;
});

cardPackingList.addEventListener('click', packingListReport );

copyPackingListButton.addEventListener('click', () => {
    console.log("Click en Copy Packing List button: ", packingListData);
    copyElement( packingListData.parentNode );
});

cardReport.addEventListener('click', report_OR130 );

copyReportButton.addEventListener('click', () => {
    console.log("Click en Copy Report button: ");
    copyElement( document.getElementById("report-table-data") );
});


    // *********************************************************
    // *********************************************************
    // Function to read a selected file
    function openReportFile(evento) {
        try {
            // validate the user selection for the shipments
            shipmentsArrayMap = [];
            shipmentsArrayMap = validateSelectionShipments( shipmentsData );
            
            console.log("RESULTADO: ", shipmentsArrayMap);
            
            
            if(shipmentsArrayMap === undefined){
                console.log("ERROR:validateSelectionShipments: Por favor revise su selección de shipments y elimine los que no use.");
                // alert("Por favor revise su selección de shipments y elimine los que no use.");
                reportLoadButton.value = "";
                evento.stopPropagation();
                throw new Error("Por favor revise su selección de shipments y elimine los que no use.");
                return;
            }
            
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
        console.log("Reporte válidado correctamente.", dataArray);

        dataArray.forEach( row => {
            let referenceText = String (row[ARTICLE_NUMBER]);
            row[ARTICLE_NUMBER] = referenceText.padStart( 8, '0' );
        });

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

        const packListArray = [];
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
            packListArray[count] = packingList;
            count++;
        }
        return packListArray;
    }

    // *********************************************************
    function packingListReport () {

        // Create Packing List data structure
        packingListArray = createPackingListMap( shipmentsArrayMap, contentDataReport );

        console.log("Packing List: ", packingListArray);
        
        reportFrame.classList.remove("no-visible");
        copyPackingListButton.classList.remove("no-visible");
        packingListPanel.classList.remove("no-visible");

        reportPanel.classList.add("no-visible");
        copyReportButton.classList.add("no-visible");
        document.getElementById("cards-panel").classList.add("no-visible");

        showPackingListData(packingListArray);
    }

    // *********************************************************
    function createReport_OR130Array( shipmentsMap, dataArray ) {

        const reportArray = [];
        const ship_1000_Map = new Map();

        // filter only shipments with code '1000'
        shipmentsMap.forEach( (value, key) => {
            if( value.code === 1000 ){
                ship_1000_Map.set( key, value );
            }
        });

        for (const row of dataArray) {
            if(ship_1000_Map.has( row[SHIPMENT] )) {
                reportArray.push(row);
            }
        }
        return reportArray;
    } 

    // *********************************************************
    function report_OR130() {

        const reportData = createReport_OR130Array( shipmentsData, contentDataReport );
        console.log("Report OR130: ", reportData);

        reportFrame.classList.remove("no-visible");
        copyReportButton.classList.remove("no-visible");
        reportPanel.classList.remove("no-visible");

        packingListPanel.classList.add("no-visible");
        copyPackingListButton.classList.add("no-visible");
        document.getElementById("cards-panel").classList.add("no-visible");

        showReportData( reportData );
    }
    
    // *********************************************************

