
'use strict';

class ExcelFileOpen {

    constructor(pointerFile) {
        if(!pointerFile) {
            console.log("ERROR:ExcelFileOpen: No se ha seleccionado ningun archivo.");
            throw new Error("No se ha seleccionado ningun archivo.");
        }

        this.file = pointerFile;
        this.contentFile = "";
    }
}

// *********************************************************

const EXCEL_MIME_TYPES = [ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "application/vnd.ms-excel.sheet.macroEnabled.12" 
                        ];
const WORKING_SHEET = "Sheet1";
const EXTENSION_VALID_FILE = [ "xlsx", "xlsm", "xls" ];

    // *********************************************************
    function validateMymeType(file){

        debugger
        let isValidExtensionFile = false;
        let isValidMimeType = false;

        // check the file type
        if(file === undefined ) {
            console.log("ERROR:readReportsExcel: El archivo \"" + file.name + "\" NO es válido.");
            throw new Error("El archivo \"" + file.name + "\" NO es válido.");
        }

        // check IF the extension file is valid
        for (const extensionFile of EXTENSION_VALID_FILE ) {
            if((file.name.toLowerCase().endsWith( extensionFile ))){
                isValidExtensionFile = true;
                break;
            }
        }

        if(!isValidExtensionFile){
            console.log("ERROR:validateMymeType: La extensión del archivo no se reconoce como válida.");
            throw new Error("La extensión del archivo no se reconoce como válida.");
        }

        // check for MIME type valid
        for (const mimeType of EXCEL_MIME_TYPES ) {
            if((file.type === mimeType )){
                isValidMimeType = true;
                break;
            }
        }

        if(!isValidMimeType){
            console.log("ERROR:validateMymeType: El tipo de archivo MIME no se reconoce como válido.");
            throw new Error("El tipo de archivo MIME no se reconoce como válido.");
        }

        console.log("Validado Myme type y extensión del archivo.");
    }

    
    // *********************************************************
    function loadExcelFile(excelFile){
    
        return new Promise( (resolve, reject ) => {

            console.log("INFO:loadExcelFile: Iniciando lectura de archivo.");
            
            let fileReader = new FileReader();
            // Constants for minification
            const read = "read";
            const utils = "utils";
            const sheet_to_row_object_array = "sheet_to_row_object_array";
            const Sheets = "Sheets";
                
            validateMymeType(excelFile.file);
            
            fileReader.readAsArrayBuffer(excelFile.file);
            fileReader.onload = function(){
                
                try {
                    let buffer = this.result;
                    let workbook =  XLSX[read](buffer);
                    let contentExcelFile = XLSX[utils][sheet_to_row_object_array](workbook[Sheets][WORKING_SHEET]);
                    
                    resolve(contentExcelFile);
                    
                } catch (error) {
                    console.log("ERROR:loadExcelFile: ", error);
                    alert(error.message);
                    initializePage();
                    reject(error);
                }
            };
        });
    }







