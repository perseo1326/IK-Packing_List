
'use strict';

class TruckInfo {

    constructor (shipmentId, estimatedArrival ){
        this.shipmentId = shipmentId.trim();
        this.arrivalText(estimatedArrival.trim());
    }

    arrivalText ( text ){
        const data = text.split(" ");
        const splitDate = data[0].split('/');
        const splitTime = data[1].split(':');
        this.estimatedArrivalDate = new Date( splitDate[2], (splitDate[1] - 1), splitDate[0], splitTime[0], splitTime[1] );
        this.isPlants = (splitTime[0] == 10 ? true : false );
        this.code = 0;
    }
}


const footerVersion = document.getElementById("version-footer");
const shipments = document.getElementById("shipments-data");

const loadingFrame = document.getElementById("loading-frame");
const loadFileLabel = document.getElementById("shipments-data-label");

const dataTable = document.getElementById("shipments");
const shipmentsTotal = document.getElementById("shipments-total");
const shipmentsClear = document.getElementById("shipments-clear");
const shipmentsRemove = document.getElementById("shipments-remove");

const BUTTON_CODE_FIRST = "FIRST";
const BUTTON_CODE_SECOND = "SECOND";
const BUTTON_CODE_THIRD = "THIRD";

const shipmentsFirst = document.getElementById(BUTTON_CODE_FIRST);
const shipmentsSecond = document.getElementById(BUTTON_CODE_SECOND);
const shipmentsThird = document.getElementById(BUTTON_CODE_THIRD);

const VERSION = "1.0";

// Excel shipments file manipulation values
const SHIPMENTS_FILE_EXTENSION_ARRAY = [ "xlsx" ];
const SHIPMENTS_FILE_WORKBOOK_SHEET = "Sheet1";
const SHIPMENTS_FILE_MYME_TYPE_ARRAY = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];

const SHOP_CODE_LONG = "Receiver ID ="; // Begins With 406-STO-1";
const SHOP_CODE_ID = "406-STO-1";
const CODE_FIRST = 1000;
const CODE_SECOND = 2000;
const CODE_THIRD = 3000;


// Column name and "number of column"
const SHIPMENT_COL = { colName : "Shipment ID", columnNumber : "" } ;
const RECEIVER_COL = { colName : "Receiver", columnNumber : "" };
const ESTIMATE_ARRIVAL_DATE = { colName : "Estimated Arrival Date", columnNumber : "" };


let shipmentsData = new Map();




    // *********************************************************
    // Event Listeners

    shipments.addEventListener('change', openTrucksInfoFile );

    shipmentsClear.addEventListener('click', () => {
        const inputSelected = document.querySelectorAll('input[type=checkbox]:checked');

        inputSelected.forEach( element => {
            element.checked = false;
        });
    });

    shipmentsRemove.addEventListener('click', () => {
        const inputSelected = document.querySelectorAll('input[type=checkbox]:checked');

        inputSelected.forEach( ( element ) => {
            shipmentsData.delete( element.id );
        });

        showShipmentsData(shipmentsData);
    });

    shipmentsFirst.addEventListener('click', changeShipmentCode );
    shipmentsSecond.addEventListener('click', changeShipmentCode );
    shipmentsThird.addEventListener('click', changeShipmentCode );


    // *********************************************************
    // *********************************************************
    // code to be executed loading page.
    initializePage();

    // *********************************************************
    // Function to initialize the original values
    function initializePage() {
        console.log("Inicializando valores originales...");
        document.getElementById("title").innerText = document.title = "Generador Packing List - GALEX";
        loadFileLabel.innerText = "Información de Shipments";
        
        footerVersion.innerText = "Versión " + VERSION + footerVersion.innerText;
        shipmentsData = new Map();


    }

    // *********************************************************
    // Function to read a selected file
    function openTrucksInfoFile(evento) {

        const file = evento.target.files[0];
        loadingFrame.classList.remove("no-visible");

        const fileStatus = new ExcelFileOpen(file, SHIPMENTS_FILE_EXTENSION_ARRAY, SHIPMENTS_FILE_WORKBOOK_SHEET, SHIPMENTS_FILE_MYME_TYPE_ARRAY );

        loadFileLabel.innerText = fileStatus.file.name;

        const promiseData = loadExcelFile(fileStatus);

        promiseData.then( (response) => {
            
            let contentData = validateShipmentsFile( response );
            console.log("Carga \"" + fileStatus.file.name + "\" Finalizada!", contentData); 

            contentData = getShipmentsInfoFromGrossData( contentData );

            contentData = sortTrucksInfo(contentData);

            document.getElementById("button-load-shipments").classList.add("no-visible");
            document.getElementById("shipments-container").classList.remove("no-visible");
            document.getElementById("shipments-commands").classList.remove("no-visible");
            document.getElementById("box").classList.remove("box");

            shipmentsData = arrayToMap( contentData );

            showShipmentsData(shipmentsData);
        })
        .catch( (error) => {
            console.log("ERROR:openFile: ", error);
            alert(error.message);
            initializePage();
        })
        .finally( () => {
            loadingFrame.classList.add("no-visible");
        });
    }

    // *********************************************************
    function validateShipmentsFile(grossExcelData) {

        let shipmentId = false;
        let receiver = false;
        let estimatedArrivalDate = false;
        let shopCode = false;
        let isfirstAppearance = false;

        for (const row of grossExcelData) {
            
            for (const cell in row) {
                if (Object.hasOwnProperty.call( row, cell)) {
                    const element = row[cell];

                    // console.log("Celda : ", element, cell );
                    if( element.includes( SHOP_CODE_LONG ) ) {
                        shopCode = element.includes( SHOP_CODE_ID ) ? true : false ;
                        // console.log("RReceiver ID code :", element);
                    }

                    if( element === SHIPMENT_COL.colName ){
                        SHIPMENT_COL.columnNumber = cell;
                        // console.log("Encontrado primer encabezado: ", element, SHIPMENT_COL);
                        shipmentId = true;
                    }

                    if( element === RECEIVER_COL.colName ) {
                        RECEIVER_COL.columnNumber = cell;
                        // console.log("Encontrado SEGUNDO encabezado: ", element, RECEIVER_COL );
                        receiver = true;
                    }

                    if ( element === ESTIMATE_ARRIVAL_DATE.colName ) {
                        
                        if(isfirstAppearance){
                            ESTIMATE_ARRIVAL_DATE.columnNumber = cell;
                            // console.log("Encontrado TERCER encabezado: ", element, ESTIMATE_ARRIVAL_DATE);
                            estimatedArrivalDate = true;
                        }
                        isfirstAppearance = true;
                    }

                    if( shopCode && shipmentId && receiver && estimatedArrivalDate ) {
                        console.log("Columnas encontradas: ", SHIPMENT_COL, RECEIVER_COL, ESTIMATE_ARRIVAL_DATE );
                        return grossExcelData;
                    }
                }
            }
        }
        console.log("ERROR:validateFile: Estructura del archivo NO válida.")
        throw new Error("Estructura del archivo NO válida.");
    }

    // *********************************************************
    function getShipmentsInfoFromGrossData( grossDataArray ){

        const arrayData = [];

        for (const row of grossDataArray) {
            if( row[RECEIVER_COL.columnNumber] === SHOP_CODE_ID ){

                const truckInfoRow = new TruckInfo( row[SHIPMENT_COL.columnNumber ], row[ESTIMATE_ARRIVAL_DATE.columnNumber]);
                arrayData.push( truckInfoRow );
            }
        }
        console.log("Cantidad de filas obtenidas: ", arrayData.length );
        return arrayData;
    }
    
    // *********************************************************
    function sortTrucksInfo( arrayData ){

        arrayData.sort( ( a, b ) => {
            return ( a.estimatedArrivalDate.getTime() < b.estimatedArrivalDate.getTime() ? -1 : 1 );
        });
        return arrayData;
    }

    // *********************************************************
    function arrayToMap( arrayData ) {

        let dataMap = new Map();

        for (const row of arrayData ) {
            dataMap.set( row.shipmentId, row );    
        }
        return dataMap;
    }

    // *********************************************************
    function changeShipmentCode() {

        switch (this.id) {
            case BUTTON_CODE_FIRST:
                writeShipmentCode(CODE_FIRST);
                break;
            case BUTTON_CODE_SECOND:
                writeShipmentCode(CODE_SECOND);
                break;
            case BUTTON_CODE_THIRD:
                writeShipmentCode(CODE_THIRD);
                break;
            default:
                return;
        }
        showShipmentsData(shipmentsData);
    }

    // *********************************************************
    function writeShipmentCode( code ) {
        const inputSelected = document.querySelectorAll('input[type=checkbox]:checked');
        inputSelected.forEach( (element) => {
            shipmentsData.get(element.id).code = code;
        });
    }

    // *********************************************************
    function validateSelectionShipments( shipmentsMap ){

        const shipmentsArray = [];
        const shipment_1000 = new Map();
        const shipment_2000 = new Map();
        const shipment_3000 = new Map();

        shipmentsData.forEach( (shipment, key ) => {
            switch (shipment.code) {
                case 1000:
                    shipment_1000.set( key, shipment );
                    break;
                case 2000:
                    shipment_2000.set( key, shipment );
                    break;
                case 3000:
                    shipment_3000.set( key, shipment );
                    break;
                default:
                    console.log("ERROR:validateSelectionShipments: Por favor revise su selección de shipments y elimine los que no use.");
                    throw new Error("Por favor revise su selección de shipments y elimine los que no use.");
            }
        });
        shipmentsArray.push(shipment_1000);
        shipmentsArray.push(shipment_2000);
        shipmentsArray.push(shipment_3000);
        
        return shipmentsArray;
    }

    // *********************************************************
    // *********************************************************




