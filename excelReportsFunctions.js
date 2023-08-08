
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

const EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const WORKING_SHEET = "Sheet1";


    // *********************************************************
    function validateMymeType(file){

        // check the file type
        if(file === undefined || (!file.name.toLowerCase().endsWith(".xlsx") && file.type !== EXCEL_MIME_TYPE) ) {
            console.log("ERROR:readReportsExcel: El archivo \"" + file.name + "\" NO es válido.");
            throw new Error("El archivo \"" + file.name + "\" NO es válido.");
        }
        console.log("Validado Myme type");
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







