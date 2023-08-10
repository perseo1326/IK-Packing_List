
// *********************************************************
// *********************************************************
//  CONSTANTS AND VARIABLES FOR VIEWS

const CSS_CLASS_ARRAY = [ "_1000", "_2000", "_3000" ];


// *********************************************************
// *********************************************************

function showShipmentsData( shipmentsDataMap ){
    
    // console.log("SHOW DATA: ", shipmentsDataMap);

    shipmentsTotal.innerText = shipmentsDataMap.size;

    dataTable.innerHTML = "";
    let html = "";

    shipmentsDataMap.forEach( ( row, key ) => {
        
        // console.log("FILA: ", key, row);
        const codeClass = "_" + row.code;

        html += "<tr class='" + codeClass;
        html += row.isPlants ? " plants" : "";
        html += "'>";
        
        html += "<td>";
        html += key;
        html += "</td>";

        html += "<td>";
        html += row.estimatedArrivalDate.toLocaleString();
        html += "</td>";
        
        html += "<td class='centrar'>";
        html += row.code;
        html += "</td>";
        
        html += "<td class='selection'>";
        html += '<input type="checkbox" id="' + key + '" class="no-visible" value="';
        html += "index";
        html += '" />';
        html += '<label for="' + key;
        html += '"><i class="fa-regular fa-circle-check"></i></label>';
        html += "</td>";

        html += "</tr>";
    });
    dataTable.innerHTML = html;
}


// *********************************************************
function showPackingListData( packListArray) {

    packingListData.innerHTML = "";
    let htmlPack = "";
    let count = 0;

    // for (const shipMap of packListArray) {
    //     const colorCode = CSS_CLASS_ARRAY[count];
    //     shipMap.forEach( (shipment, key) => {
    //         // console.log("Shipment: ", shipment, " Key: ", key);
    //         htmlPack += "<tr class='centrar ";
    //         htmlPack += colorCode;
    //         htmlPack += "'>";
            
    //         htmlPack += "<td>";
    //         htmlPack += shipment.reference;
    //         htmlPack += "</td>";
            
    //         htmlPack += "<td>";
    //         htmlPack += shipment.code;
    //         htmlPack += "</td>";
            
    //         htmlPack += "</tr>";

    //         if(x++ > 20) {
    //             packingListData.innerHTML = htmlPack;
    //             return;
    //         } 
    //     });
    //     count++;
    // }

    const colorCode = CSS_CLASS_ARRAY[count];
    for (let i = 0; i < 20; i++) {
        
        htmlPack += "<tr class='centrar ";
        htmlPack += colorCode;
        htmlPack += "'>";
        
        htmlPack += "<td>";
        htmlPack += "12345678";
        htmlPack += "</td>";
        
        htmlPack += "<td>";
        htmlPack += "1022";
        htmlPack += "</td>";
        
        htmlPack += "</tr>";
        
    }        // console.log("Shipment: ", shipment, " Key: ", key);

    packingListData.innerHTML = htmlPack;
}



// *********************************************************
// *********************************************************





