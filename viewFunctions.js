
// *********************************************************
// *********************************************************
//  CONSTANTS AND VARIABLES FOR VIEWS

const CSS_CLASS_ARRAY = [ "_1000", "_2000", "_3000" ];

// *********************************************************
// *********************************************************

function showShipmentsData( shipmentsDataMap ){
    
    document.getElementById("shipments-total").innerText = shipmentsDataMap.size;

    const dataTable = document.getElementById("shipments");
    dataTable.innerHTML = "";
    let html = "";
    let count = 1;

    const arraySorted = sortShipmentsDataMap( shipmentsDataMap );

    arraySorted.forEach( ( shipmentElement ) => {
        
        const codeClass = "_" + shipmentElement.code + ( shipmentElement.manualShipment ? " manual" : "" );

        html += "<tr class='" + codeClass;
        html += shipmentElement.isPlants ? " plants" : "";
        html += "'>";

        html += "<td class='centrar'>";
        html += count;
        html += "</td>";
        
        html += "<td class='selection'>";
        html += "<label><i class='fa-regular fa-copy copy-ship'></i></label>";
        html += "</td>";

        html += "<td>";
        html += "<p>"
        html += shipmentElement.shipmentId;
        html += "</p>"
        html += "</td>";

        html += "<td class='centrar'>";
        html += shipmentElement.dateTimeShipment.toLocaleString();
        html += "</td>";
        
        html += "<td class='centrar'>";
        html += shipmentElement.code;
        html += "</td>";
        
        html += "<td class='selection'>";
        html += '<input type="checkbox" id="' + shipmentElement.shipmentId + '" class="no-visible" value="';
        html += "index";
        html += '" />';
        html += '<label for="' + shipmentElement.shipmentId;
        html += '"><i class="fa-regular fa-circle-check"></i></label>';
        html += "</td>";

        html += "</tr>";
        count++;
    });
    
    countDayCode(shipmentsDataMap);
    dataTable.innerHTML = html;
}


    // *********************************************************
    function sortShipmentsDataMap( data ){

    const array = [];
    for (const element of data.values() ) {
        array.push( element );
    }

    array.sort( ( a, b ) => {
        return ( a.dateTimeShipment.getTime() < b.dateTimeShipment.getTime() ? -1 : 1 );
    });
    return array;
}


// *********************************************************
function countDayCode(map){
    
    let codeFirst = codeSecond = codeThird = 0;
    map.forEach( ( row, key ) => {

        switch (row.code) {
            case CODE_FIRST:
                codeFirst++;
                break;
            case CODE_SECOND:
                codeSecond++;
                break;
            case CODE_THIRD:
                codeThird++;
                break;
            default:
                break;
        }
    });
    shipmentsFirst.innerText = (CODE_FIRST + " = " + codeFirst);
    shipmentsSecond.innerText = (CODE_SECOND + " = " + codeSecond);
    shipmentsThird.innerText = (CODE_THIRD + " = " + codeThird);
}


// *********************************************************
function showPackingListData( packListArray) {

    title.innerText = titlePackingListData;
    packingListData.innerHTML = "";
    let htmlPack = "";
    let count = 0;

    for (const shipMap of packListArray) {
        const colorCode = CSS_CLASS_ARRAY[count];
        shipMap.forEach( (shipment, key) => {

            htmlPack += "<tr class='centrar ";
            htmlPack += colorCode;
            htmlPack += "'>";
            
            htmlPack += "<td >";
            htmlPack += shipment.reference;
            htmlPack += "</td>";
            
            htmlPack += "<td>";
            htmlPack += shipment.code;
            htmlPack += "</td>";
            
            htmlPack += "</tr>";
        });
        count++;
    }
    packingListData.innerHTML = htmlPack;
}

// *********************************************************
function drawReportTableHeaders() {

    htmlReportHeaders = "";
    htmlReportHeaders += "<tr class='centrar'>";

    htmlReportHeaders += '<th>' + ARTICLE_NUMBER + '</th>';
    htmlReportHeaders += '<th>' + ARTICLE_NAME + '</th>';
    htmlReportHeaders += '<th>' + SALES_METHOD + '</th>';
    htmlReportHeaders += '<th>' + HFB + '</th>';
    htmlReportHeaders += '<th>' + PRODUCT_AREA + '</th>';
    htmlReportHeaders += '<th>' + SLID_P + '</th>';
    htmlReportHeaders += '<th>' + SLID_H + '</th>';
    htmlReportHeaders += '<th>' + MSL + '</th>';
    htmlReportHeaders += '<th>' + WORKAREA + '</th>';
    htmlReportHeaders += '<th>' + COMPLETE_CAP_INCL_FLEX + '</th>';
    htmlReportHeaders += '<th>' + TOTAL_QTY_IN_SALES + '</th>';
    htmlReportHeaders += '<th>' + SGF_STOCK + '</th>';
    htmlReportHeaders += '<th>' + FROM_LOCATION + '</th>';
    htmlReportHeaders += '<th>' + TO_LOCATION + '</th>';
    htmlReportHeaders += '<th>' + MOVED_QTY + '</th>';
    htmlReportHeaders += '<th>' + FLOWTYPE + '</th>';
    htmlReportHeaders += '<th>' + FULL_PALLET + '</th>';
    htmlReportHeaders += '<th>' + SALES_STOP_MARK + '</th>';
    htmlReportHeaders += '<th>' + SHIPMENT + '</th>';
    htmlReportHeaders += '<th>' + OPEN_PICK_QTY + '</th>';
    htmlReportHeaders += '<th>' + NEW_LOC + '</th>';
    htmlReportHeaders += '<th>' + NEW_CAP + '</th>';
    htmlReportHeaders += '<th>' + MHS_ID + '</th>';    

    htmlReportHeaders += '</tr>';
    return htmlReportHeaders;
}
// *********************************************************
function showReportData( dataReportArray ){

    title.innerText = titleReportData;
    reportTableHeaders.innerHTML = reportData.innerHTML = "";
    htmlReport = "";
    
    // Draw the headers for the report
    reportTableHeaders.innerHTML = drawReportTableHeaders();
    
    dataReportArray.forEach( row => {
        htmlReport += "<tr class='centrar'>";
        
        htmlReport += '<td>' + row[ARTICLE_NUMBER] + '</td>';
        htmlReport += '<td>' + row[ARTICLE_NAME] + '</td>';
        htmlReport += '<td>' + row[SALES_METHOD] + '</td>';
        htmlReport += '<td>' + row[HFB] + '</td>';
        htmlReport += '<td>' + row[PRODUCT_AREA] + '</td>';
        htmlReport += '<td>' + row[SLID_P] + '</td>';
        htmlReport += '<td>' + row[SLID_H] + '</td>';
        htmlReport += '<td>' + row[MSL] + '</td>';
        htmlReport += '<td>' + row[WORKAREA] + '</td>';
        htmlReport += '<td>' + row[COMPLETE_CAP_INCL_FLEX] + '</td>';
        htmlReport += '<td>' + row[TOTAL_QTY_IN_SALES] + '</td>';
        htmlReport += '<td>' + row[SGF_STOCK] + '</td>';
        htmlReport += '<td>' + row[FROM_LOCATION] + '</td>';
        htmlReport += '<td>' + row[TO_LOCATION] + '</td>';
        htmlReport += '<td>' + row[MOVED_QTY] + '</td>';
        htmlReport += '<td>' + row[FLOWTYPE] + '</td>';
        htmlReport += '<td>' + row[FULL_PALLET] + '</td>';
        htmlReport += '<td>' + row[SALES_STOP_MARK] + '</td>';
        htmlReport += '<td>' + row[SHIPMENT] + '</td>';
        htmlReport += '<td>' + row[OPEN_PICK_QTY] + '</td>';
        htmlReport += '<td>' + row[NEW_LOC] + '</td>';
        htmlReport += '<td>' + row[NEW_CAP] + '</td>';
        htmlReport += '<td>' + row[MHS_ID] + '</td>';

        htmlReport += "</tr>";
    });
    reportData.innerHTML = htmlReport;
}

// *********************************************************
// *********************************************************
