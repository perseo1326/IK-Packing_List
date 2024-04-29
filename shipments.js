
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


const VERSION = "1.5.5";

const titleMain = "Generador Packing List - GALEX";
const titlePackingListData = "Packing List - Listado";
const titleReportData = "Reporte OR130 - Reducido";
const ITMS_LINK = "https://itm-vis.ikea.com/GC3/glog.webserver.report.ReportParameterServlet?ct=NDY3NDA4MzMwOTg1MjY3MjE0NQ%3D%3D&report_gid=I.IKEA_VISIB_DELIVERIES&DB=OLTP";
const FMS_AUTO_EXPORTER_OR130A = "https://exporter.fms-reporting.ingka.com/schedules/6182";
const RECEIVING_LINK = "https://mhs406.ikea.com/sgf/receiving";
const SHIPMENTS_INFO_BUTTON = "2. Información de Shipments";
const EXCEL_FILE_PEDIDOS_TOOL = "https://iweof.sharepoint.com/:x:/r/teams/o365g_sss_retes406/Shared%20Documents/EXTERNO/Rutinas/!HERRAMIENTA%20DE%20PEDIDOS%2023.11.xlsm?d=wabe1a4e6617544bd8a833e3134fbfe21&csf=1&web=1&e=6CswHv";
const EXCEL_FILE_CARGAS_INFLOW = "https://iweof.sharepoint.com/:x:/r/teams/o365g_sss_retes406/Shared%20Documents/EXTERNO/Rutinas/!HERRAMIENTA%20DE%20CARGAS%20INFLOW%2023.7.xlsm?d=w6d69e3a9ecb9404d96303b15f4c525ff&csf=1&web=1&e=WdwZ6I";
const SHAREPOINT_EXTERNO_RUTINAS = "https://iweof.sharepoint.com/:f:/r/teams/o365g_sss_retes406/Shared%20Documents/EXTERNO/Rutinas?csf=1&web=1&e=dGYx7N";

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
const ESTIMATE_ARRIVAL_DATE = { colName : "Estimated Arrival", columnNumber : "" };

const BUTTON_CODE_FIRST = "FIRST";
const BUTTON_CODE_SECOND = "SECOND";
const BUTTON_CODE_THIRD = "THIRD";
const shipmentsFirst = document.getElementById(BUTTON_CODE_FIRST);
const shipmentsSecond = document.getElementById(BUTTON_CODE_SECOND);
const shipmentsThird = document.getElementById(BUTTON_CODE_THIRD);


try {
    if(shipmentsFirst === null || shipmentsSecond === null || shipmentsThird === null ) {
        throw new Error("Error interno: El código de semana (1000, 2000, 3000) no es válido.");
    }
    
} catch (error) {
    console.log("ERROR:VARIABLES: shipmentsFirst, shipmentsSecond, shipmentsThird");
    alert(error.message);
}

const footerVersion = document.getElementById("version-footer");
const shipments = document.getElementById("shipments-data");

const loadingFrame = document.getElementById("loading-frame");
const loadFileLabel = document.getElementById("shipments-data-label");

const dataTable = document.getElementById("shipments");
const shipmentsClear = document.getElementById("shipments-clear");
const shipmentsRemove = document.getElementById("shipments-remove");
const esboOrder = document.getElementById("esbo-order");
const inflowLoad = document.getElementById("inflow-load");

const addManualShipping = document.getElementById("add-manual-shipping");
const addManualShippingFrame = document.getElementById("add-manual-shipping-frame");
const addManualShipCancelB = document.getElementById("add-manual-ship-cancel-b");
const addManualShipOkB = document.getElementById("add-manual-ship-ok-b");
const addShipmentId = document.getElementById("shipment-id");
const addShipmentDate = document.getElementById("shipment-date");
const addShipmentTime = document.getElementById("shipment-time");


let shipmentsData = new Map();
let shipmentsArrayMap = [];


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

    esboOrder.addEventListener('click', () => {
        console.log(esboOrder);
        esboOrder.parentElement.href = SHAREPOINT_EXTERNO_RUTINAS;
    });

    inflowLoad.addEventListener('click', () => {
        inflowLoad.parentElement.href = SHAREPOINT_EXTERNO_RUTINAS;
    });

    dataTable.addEventListener("click", copyShipment );

    addManualShipping.addEventListener('click', () => {
        addManualShippingFrame.classList.remove("no-visible");
        addShipmentId.focus();
    });

    addManualShipCancelB.addEventListener("click", () => {
        addShipmentId.value = "";
        addShipmentDate.value = "";
        addShipmentTime.value = "";
        addManualShippingFrame.classList.add("no-visible");
    });

    addManualShipOkB.addEventListener("click", addShipmentManual );

    // TODO: agregar margen inferior para mejora visual 
    // *********************************************************
    // *********************************************************
    // code to be executed loading page.
    initializePage();

    // *********************************************************
    // Function to initialize the original values
    function initializePage() {
        console.log("Inicializando valores originales...");
        document.getElementById("title").innerText = document.title = titleMain;
        loadFileLabel.innerText = SHIPMENTS_INFO_BUTTON;

        // Initialize url for ITMS button
        document.getElementById("ITMS-link").href = ITMS_LINK;
        // Initialize url for "Receiving web page" (Gestor de entregas)
        document.getElementById("receiving-link").href = RECEIVING_LINK;
        // Initialize url for FMS Auto Exporter report "OR130A"
        document.getElementById("FMS_OR130A_link").href = FMS_AUTO_EXPORTER_OR130A;
        
        footerVersion.innerHTML = "Versión " + VERSION + " - " + footerVersion.innerHTML;
        shipmentsData = new Map();
        // shipmentsArrayMap = new Map();
        shipmentsArrayMap = [];
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
            
            // console.log("FILA: ", row);
        
            for (const cell in row) {

                if (Object.hasOwnProperty.call( row, cell)) {
                    const element = row[cell];

                    if( element.includes( SHOP_CODE_LONG ) ) {
                        shopCode = element.includes( SHOP_CODE_ID ) ? true : false ;
                        // console.log("Receiver ID code :", element);
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
        
        for (let index = 0; index < grossDataArray.length; index++) {
            
            const row = grossDataArray[ index ];
            const rowPlusOne = grossDataArray[ index + 1 ];
            
            if( row[RECEIVER_COL.columnNumber] === SHOP_CODE_ID ){
                
                // Because the spreed sheet format is not correctly, I need to read the "Arrival Date" 
                // from the next row because in the actual row it is not present. Excel bug!
                const truckInfoRow = new TruckInfo( row[SHIPMENT_COL.columnNumber ], rowPlusOne[ESTIMATE_ARRIVAL_DATE.columnNumber]);
                arrayData.push( truckInfoRow );
            }
        }
        console.log("Cantidad de Shipments obtenidos: ", arrayData.length );
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
                console.log("WARNING:changeShipmentCode: Ningún caso válido seleccionado!");
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

        let isValid = true;
        const shipmentsArray = [];
        const shipment_1000 = new Map();
        const shipment_2000 = new Map();
        const shipment_3000 = new Map();

        shipmentsMap.forEach( (shipment, key ) => {
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
                    console.log("WARNING:validateSelectionShipments: Existen shipments sin asignar código.");
                    isValid = false;
    }
        });
        if(!isValid){
            return undefined;
        }
        shipmentsArray.push(shipment_1000);
        shipmentsArray.push(shipment_2000);
        shipmentsArray.push(shipment_3000);
        
        return shipmentsArray;
    }

    // *********************************************************
    function addShipmentManual () {

        const shipmentId = addShipmentId.value.trim();
        try {
            // Vaidate shipping not empty
            if(shipmentId === ""){
                addShipmentId.value = "";
                addShipmentId.focus();
                throw new Error("El Shipment ID NO puede ser vacio.");
            }

            // validate the shipping ID is not already present 
            // TODO: validar esto
            if(shipmentsData.has(shipmentId)){
                addShipmentId.value = "";
                throw new Error("El Shipment ID ya existe en el listado, pruebe removerlo y agregarlo.");
            }
            
            // validate date
            const shipmentDate = validateDate(addShipmentDate.value.trim());
            if( shipmentDate === undefined ){
                addShipmentDate.value = "";
                addShipmentDate.focus();
                throw new Error("Fecha no válida");
            }

            // validate date and time
            if( isNaN(addShipmentTime.valueAsNumber) ){
                addShipmentTime.value = "";
                addShipmentTime.focus();
                throw new Error("Hora no válida");
            }

            const dateTimeString = ( shipmentDate + " " + addShipmentTime.value.trim());

            const truckInfoRow = new TruckInfo( shipmentId, dateTimeString);
            
            shipmentsData.set( truckInfoRow.shipmentId, truckInfoRow );
            addManualShipCancelB.click();
            showShipmentsData(shipmentsData);

        } catch (error) {
                console.log("ERROR:addShipmentManual: " + error.message);
                alert(error.message);
        }
    }

    // *********************************************************
    // If return is "true" => date NOT valid!
    function validateDate( stringDate ){
        console.log("Validate Date: ", stringDate);
        if( isNaN(Date.parse(stringDate)) ) {
            return undefined;
        } 
        const date = new Date(stringDate);

        return ("FECHA: ", date.getDate() + '/' + (date.getMonth() + 1 ) + '/' + date.getFullYear() );
    }

    // *********************************************************
    function copyShipment( evento ){
        if(evento.target.nodeName === 'I' && evento.target.classList.contains("copy-ship") ){
            
            document.querySelectorAll('label.copy-shipment').forEach( elem => {
                elem.classList.remove("copy-shipment");
            });
            
            const element = evento.target;
            element.parentNode.classList.add("copy-shipment");

            copyElement( element.parentNode.parentNode.nextSibling.firstChild );
            // copyElement( element.parentNode.parentNode.nextSibling );

            /*
            setTimeout( () => {
                element.parentNode.classList.remove("copy-shipment");
            }, 1000 );
            */
        }
    }

    // *********************************************************
    // Function to 'copy' a DOM node into the clipboard. 
    function copyElement( element ){
        console.log("Copy ELEMENT: ", element);

        // element.innerText = element.innerText.trim();
        
        // clear all selection made before
        window.getSelection().removeAllRanges();

        let result = false;

        let range = document.createRange();
        range.selectNode( element );
        window.getSelection().addRange(range);
        
        try {
            result = document.execCommand('copy');
            console.log("Resultado de la copia: ", result );
            window.getSelection().removeAllRanges();
        } catch (error) {
            console.log("ERROR:copyElement: Problema al copiar el elemento.", result);
            alert("Problema al copiar el elemento.");
        }
    }

    // *********************************************************
    // *********************************************************
