
'use strict';


const footerVersion = document.getElementById("version-footer");


const VERSION = "1.0";






    // *********************************************************
    // *********************************************************
    // code to be executed loading page.
    initializePage();

    // *********************************************************
    // Function to initialize the original values
    function initializePage() {
        console.log("Inicializando valores originales...");
        document.title = "Generador Packing List - GALEX";
        
        footerVersion.innerText = "Versión " + VERSION + footerVersion.innerText;

    }




    
    // *********************************************************
    // *********************************************************




