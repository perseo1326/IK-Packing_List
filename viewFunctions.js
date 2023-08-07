

function showShipmentsData( shipmentsDataMap ){

    shipmentsTotal.innerText = shipmentsDataMap.size;

    dataTable.innerHTML = "";
    let html = "";

    shipmentsDataMap.forEach( ( row, key ) => {
        
        // console.log("FILA: ", row);

        html += "<tr class='";
        html += row.isPlants ? "plants" : "";
        html += "'>";
        
        html += "<td>";
        html += key;
        html += "</td>";

        html += "<td>";
        html += row.estimatedArrivalDate.toLocaleString();
        html += "</td>";
        
        html += "<td>";
        html += "1000";
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