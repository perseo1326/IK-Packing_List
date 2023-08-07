
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
        // console.log("Creando Fechas: ", text, "NUEVA: ", this.estimatedArrivalDate.toLocaleString());
    }
}

const footerVersion = document.getElementById("version-footer");
const shipmentData = document.getElementById("shipment-data");

const loadingFrame = document.getElementById("loading-frame");
const loadFileLabel = document.getElementById("shipment-data-label");

const dataTable = document.getElementById("shipments");
const shipmentsTotal = document.getElementById("shipments-total");
const shipmentsClear = document.getElementById("shipments-clear");
const shipmentsRemove = document.getElementById("shipments-remove");



const VERSION = "1.0";

const SHOP_CODE_LONG = "Receiver ID ="; // Begins With 406-STO-1";
const SHOP_CODE_ID = "406-STO-1";

// Column name and "number of column"
const SHIPMENT_COL = { colName : "Shipment ID", columnNumber : "" } ;
const RECEIVER_COL = { colName : "Receiver", columnNumber : "" };
const ESTIMATE_ARRIVAL_DATE = { colName : "Estimated Arrival Date", columnNumber : "" };


let shipmentsData = new Map();




    // *********************************************************
    // Event Listeners

    shipmentData.addEventListener('change', openTrucksInfoFile );

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
            console.log( "ELEMENT: ", element );
        });

        showShipmentsData(shipmentsData);
    });


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
        
        let arrayDataTrucks = [];

        let file = evento.target.files[0];
        loadingFrame.classList.remove("no-visible");

        let fileStatus = new ExcelFileOpen(file);

        loadFileLabel.innerText = fileStatus.file.name;

        const promiseData = loadExcelFile(fileStatus);

        promiseData.then( (response) => {
            
            let contentData = validateFile( response );
            console.log("Carga \"" + fileStatus.file.name + "\" Finalizada!", contentData); 

            contentData = getInfoFromGrossData( contentData );

            contentData = sortTrucksInfo(contentData);
            // console.log("Array data Trucks: ", dataTrucksMap);

            document.getElementById("button-load-shipments").classList.add("no-visible");
            document.getElementById("shipments-container").classList.remove("no-visible");
            document.getElementById("shipments-commands").classList.remove("no-visible");

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
    function validateFile(grossExcelData) {

        let shipmentId = false;
        let receiver = false;
        let estimatedArrivalDate = false;
        let shopCode = false;
        let isfirstAppearance = false;

        for (const row of grossExcelData) {
            // console.log("FILA: ", row);
            
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
    function getInfoFromGrossData( grossDataArray ){

        const arrayData = [];

        for (const row of grossDataArray) {
            // console.log("FILA INFO: ", RECEIVER_COL, row[RECEIVER_COL.columnNumber], row[RECEIVER_COL.colName] );
            if( row[RECEIVER_COL.columnNumber] === SHOP_CODE_ID ){

                // console.log("VALORES ORIGINALES: ", row);
                // console.log("truckInfoRow = ", row[SHIPMENT_COL.columnNumber ], ESTIMATE_ARRIVAL_DATE, row[ESTIMATE_ARRIVAL_DATE.columnNumber]);

                const truckInfoRow = new TruckInfo( row[SHIPMENT_COL.columnNumber ], row[ESTIMATE_ARRIVAL_DATE.columnNumber]);
                // console.log("TruckInfo objeto: ", truckInfoRow );
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
    // *********************************************************




