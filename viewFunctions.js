

function showShipmentsData( trucksInfoArray ){

    dataTable.innerHTML = "";
    let html = "";

    // trucksInfoArray.forEach( ( row ) => {
    for (let index = 0; index < trucksInfoArray.length; index++) {
        const row = trucksInfoArray[index];
        
        // console.log("FILA: ", row);

        html += "<tr class='";
        html += row.isPlants ? "plants" : "";
        html += "'>";
        
        html += "<td>";
        html += row.shipmentId;
        html += "</td>";

        html += "<td>";
        html += row.estimatedArrivalDate.toLocaleString();
        html += "</td>";
        
        html += "<td>";
        html += "1000";
        html += "</td>";
        
        html += "<td class='selection'>";
        html += '<input type="checkbox" id="' + row.shipmentId + '" class="no-visible" value="';
        html += index;
        html += '" />';
        html += '<label for="' + row.shipmentId;
        html += '"><i class="fa-regular fa-circle-check"></i></label>';
        html += "</td>";

        html += "</tr>";
    }
    dataTable.innerHTML = html;
}