/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9999864505988836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GET /api/product/1"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/7"], "isController": false}, {"data": [0.9999728997289973, 500, 1500, "GET /api/product (page 1)"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/6"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/9"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/8"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/3"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/2"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/5"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/product/4"], "isController": false}, {"data": [1.0, 500, 1500, "GET /api/category"], "isController": false}, {"data": [0.9999728997289973, 500, 1500, "TC: Browse Catalog"], "isController": true}, {"data": [1.0, 500, 1500, "GET /api/product/31"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 55354, 0, 0.0, 14.49909672291071, 1, 532, 8.0, 33.0, 38.0, 50.0, 92.39032466968881, 334.455445479356, 16.995351582581137], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /api/product/1", 1779, 0, 0.0, 14.56155143338954, 5, 213, 9.0, 30.0, 33.0, 45.0, 3.011166196401157, 3.3316907231665143, 0.5381283339271599], "isController": false}, {"data": ["GET /api/product/7", 1823, 0, 0.0, 14.207350521119047, 5, 162, 9.0, 30.0, 32.0, 45.75999999999999, 3.1048178325203697, 3.2806766550654682, 0.5548649056164332], "isController": false}, {"data": ["GET /api/product (page 1)", 18450, 0, 0.0, 25.810027100271043, 11, 532, 22.0, 40.0, 45.0, 60.0, 30.854287491722022, 270.12567125321084, 6.026228025726957], "isController": false}, {"data": ["GET /api/product/6", 1906, 0, 0.0, 14.200944386148997, 4, 170, 9.0, 30.0, 34.0, 45.0, 3.20455160656311, 3.032432135507474, 0.5726884218760245], "isController": false}, {"data": ["GET /api/product/9", 1879, 0, 0.0, 14.328898350186275, 5, 263, 9.0, 29.0, 32.0, 47.200000000000045, 3.149767329587362, 3.1466913849295617, 0.5628978723774289], "isController": false}, {"data": ["GET /api/product/8", 1726, 0, 0.0, 14.684241019698703, 5, 164, 9.0, 31.0, 34.649999999999864, 48.73000000000002, 2.9254584376424804, 2.8568930055102344, 0.5228114200083729], "isController": false}, {"data": ["GET /api/product/3", 1839, 0, 0.0, 14.668841761827077, 5, 168, 9.0, 29.0, 33.0, 49.0, 3.0987348938780186, 3.489102863907574, 0.5537778179489038], "isController": false}, {"data": ["GET /api/product/2", 1924, 0, 0.0, 14.457380457380443, 4, 151, 9.0, 30.0, 35.0, 55.5, 3.2235203053296986, 3.2990715624858633, 0.5760783358157566], "isController": false}, {"data": ["GET /api/product/5", 1849, 0, 0.0, 16.064899945916782, 6, 108, 10.0, 31.0, 36.0, 50.0, 3.112344004066751, 4.057596919364368, 0.556209914789273], "isController": false}, {"data": ["GET /api/product/4", 1837, 0, 0.0, 14.347305389221553, 5, 77, 9.0, 30.0, 34.0, 45.0, 3.099747059290045, 3.229912219006326, 0.553958702978592], "isController": false}, {"data": ["GET /api/category", 18468, 0, 0.0, 3.2501082954299445, 1, 427, 3.0, 4.0, 5.549999999999272, 10.0, 30.825210308452398, 33.895690241520896, 5.478699488416344], "isController": false}, {"data": ["TC: Browse Catalog", 18450, 0, 0.0, 43.49815718157182, 15, 1222, 42.0, 69.0, 76.0, 98.0, 30.78586553334635, 334.3281038946831, 16.985220724852784], "isController": true}, {"data": ["GET /api/product/31", 1874, 0, 0.0, 13.005336179295625, 3, 109, 7.0, 28.0, 31.0, 45.0, 3.1460953330680805, 1.5484687967444462, 0.5653140051606708], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 55354, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
