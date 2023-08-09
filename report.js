



const reportLoadButton = document.getElementById("report-load");






// *********************************************************
// Event Listeners

reportLoadButton.addEventListener('change', openReportFile );




// *********************************************************
// *********************************************************




    // *********************************************************
    // Function to read a selected file
    function openReportFile(evento) {
        

        const file = evento.target.files[0];
        loadingFrame.classList.remove("no-visible");

        const fileStatus = new ExcelFileOpen(file);

        const promiseData = loadExcelFile(fileStatus);

        promiseData.then( (response) => {
            
            let contentData = validateReportFile( response );
            console.log("Carga \"" + fileStatus.file.name + "\" Finalizada!", contentData); 

            // contentData = getInfoFromGrossData( contentData );

            // contentData = sortTrucksInfo(contentData);
            // console.log("Array data Trucks: ", dataTrucksMap);


            // shipmentsData = arrayToMap( contentData );

            // showShipmentsData(shipmentsData);
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
    function validateReportFile( dataArray ) {

        console.log("Cotenido a validar!! ", dataArray );
        return dataArray;
    }


    // *********************************************************
    // *********************************************************
    // *********************************************************
    // *********************************************************



