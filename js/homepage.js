/*
 *Created By Michael Winberry
 *First Version Completed 11/5/18
*/

$(document).ready(function() {

    $('#viewData').hide();



    //Code, Front of precinct labor, Back of precinct Labor, Description
    var rezCodes = [
    ["AMAL", 20, 9, "Apple Mail-In Repair"],
    ["ABAT", 15, 30, "Apple Battery Repair"],
    ["AREC", 15, 30, "Apple Reciever Repair"],
    ["ASPK", 15, 30, "Apple Speaker Repair"],
    ["AVIB", 15, 30, "Apple Vibe Motor Repair"],
    ["ALON", 15, 0, "Apple Loaner Phone"],
    ["ASFT", 15, 15, "Apple Mobile Software Repair"],
    ["ACOM", 15, 0, "Apple Consultation"],
    ["ASCR", 15, 35, "Apple Display Repair"],
    ["AWUR", 20, 9, "Apple Whole Unit Replacement"],
    ["ARDO", 0, 20, "Apple Repair Redo"],
    ["AFAL", 0, 20, "Apple Failed Same Unit Repair"],
    ["GSDI", 32, 30, "Diagnostic"],
    ["GSHD", 32, 18, "Hard Drive Install"],
    ["GSHW", 32, 18, "Misc Internal Part Install"],
    ["GSMM", 32, 18, "Memory Install"],
    ["GSNW", 32, 18, "Network Card/Adapter Install"],
    ["GSOI", 32, 20, "Operating System Install"],
    ["GSOS", 32, 49, "Geek Squad Operating System Repair"],
    ["GSPS", 32, 18, "Power Supply Install"],
    ["GSPU", 32, 18, "Computer Processor Install"],
    ["GSSB", 32, 18, "System Board Install"],
    ["GSSC", 32, 18, "Sound Card Install"],
    ["GSSW", 32, 12, "Software Installation"],
    ["GSPW", 32, 12, "Password Reset"],
    ["GSVC", 32, 18, "Video Card Install"],
    ["GSCS", 30, 0, "PC/Tablet Setup"],
    ["GSDS", 20, 0, "Device Setup"],
    ["GSFM", 5, 0, "Restore Media Creation"],
    ["GSSH", 9, 0, "Device Screen Shield Install"],
    ["GSDB", 32, 57, "Data Back Up or Transfer"],
    ["GSRD", 32, 57, "Precinct Data Recovery Level One"],
    ["GSSF", 32, 0, "Geek Squad Express Replacement"],
    ["GSCC", 35, 0, "Geek Squad Certified Open Box Computers"],
    ["GSCP", 25, 0, "Geek Squad Certified Open Box Phones and Tablets"],
    ["GSCT", 40, 0, "Geek Squad Certified Open Box TV"],
    ["GSOB", 15, 0, "Geek Squad Open Box"],
    ["GS30", 40, 0, "30 Minute Tutorial"],
    ["GS60", 70, 0, "60 Minute Tutorial"],
    ["GSCO", 20, 0, "Geek Squad Consultation"]
    ];

    var currentTabID = 0;
    var codesToInput = [];
    var totalFront = 0;
    var totalBack = 0;
    var hoursWorked = 0;  
    var percentTarget = 0;
    var target = 0;
    var toTarget = 0;


    //Create month/day/year date
    var date = new Date();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var dateFormatted = month + '/'  + day + '/' + date.getFullYear();


    
    

    //return object containing input from rezCode array,
    var resCode = function( rezCode ) 
    {
        return {
            abbr: rezCode[0],

            fop: rezCode[1],

            bop: rezCode[2],

            description: rezCode[3],

            position: codesToInput.length,

            count: 0,

            setCount: function(count)
            {
                this.count = count;
            },

            getCount: function()
            {
                return this.count;
            },

            getCode: function () {
                return this.abbr;
            },

            getFront: function () {
                return this.fop;
            },

            getBack: function () {
                return this.bop;
            },

            getDescription: function () {
                return this.description;
            },

            resCodeHTML: function () {
                let thisId = "resCode" + this.position;
                let html = "<div id='resCode" + this.position + "' class='resCodes' index='" + this.position + "'>" +
                "<div class='abbr cell'>" + this.abbr + "</div>" +
                "<div class='fop cell' value='" + this.fop + "'>" + this.fop + "</div>" + 
                "<div class='bop cell' value='" + this.bop + "'>" + this.bop + "</div>" + 
                "<div class='description cell'>" + this.description + "</div>" + 
                "<div class='rhs'>" + 
                "<input class='numInput cell' id='num" + this.position + "' class='numericalInput' value='0' type='text' index='"+ this.position.toString() + "'></input>" +
                "<div class='removeCode cell' id='del'" + this.position + "' index='" + this.position + "' >" + "X" + "</div>" +
                "</div>"+
                "</div>";

                

                return html;
            }


        }

    }    

    //Creates the Input, Dropdown, result table, and key for res Codes.
    //hides all resCode objects, result table, and key until resCode is inizialized via dropdown
    var initializeInput = function () {

        $("#formContainer").append(
            

            "<div id='inputs' class='resCodes'>"+
            "<h3>Input</h3>" +
            "<div class='cell results'>" + 
            "<div>Initials</div>" + 
            "<input type='text' id='initials'></input>" + 
            "</div>"+

            "<div class='cell results'>" + 
            "<div id='workedDiv'>Hours Worked</div>" + 
            "<input type='text' id='worked' ></input>" + 
            "</div>" +

            "<div class='cell results'>" + 
            "<div>Target Percent</div>" + 
            "<input type='text' id='target' ></input>" + 
            "</div>" +
            
            "<h3>Select Code</h3>"+
            "<select id='selectCode'>" +
            "<option class='selectCodes' value='default'>Select Resolution Code</option>" +
            "</select>"+

            "<div class='cell results' id='result'>" + 
            "<h3>Results</h3>" +
            "<table id='resTable'>"+
            "<tr>" +
            "<th class='resHeader'>Date</th>" + 
            "<th class='resHeader'>Initials</th>" + 
            "<th class='resHeaser'>Hours Worked</th>" + 
            "<th class='resHeader'>Generated Front</th>" + 
            "<th class='resHeader'>Generated Back</th>" +
            "<th class='resHeader'>Target (hrs)</th>" +
            "<th class='resHeader'>To Target (hrs)</th>" + 
 
            "</tr>" +
            "<tr>" + 
            "<td id='tDate'></td>" + 
            "<td id='tInitials'></td>" + 
            "<td id='tWorked'></td>" + 
            "<td id='tGenF'></td>" + 
            "<td id='tGenB'></td>" + 
            "<td id='tTarget'></td>" +
            "<td id='tToTarget'></td>" + 
            "</tr>"+
            "</table>" + 
            "</div>" +
            "</div>"+

            "<div id='resCode' class='resCodes' +>" +
            "<div class='abbr cell'>CODE</div>" +
            "<div class='fop cell' value='" + "FP" + "'>" + "FP" + "</div>" + 
            "<div class='bop cell' value='" + "BP"+ "'>" + "BP" + "</div>" + 
            "<div class='description cell'>" + "Description" + "</div>" + 
            "<div class='rhs'>"+
            "<div class='numInput cell' id='tags'>" + "Total" + "</div>" +
            "</div>"
            
            );

        //Appends the resCodes and then hides until initialized via dropdown #selectCode
        for(var i = 0; i < rezCodes.length; i++)
        {

            codesToInput.push(resCode(rezCodes[i]));
            $('#formContainer').append(codesToInput[i].resCodeHTML());
            $('#resCode' + i).hide();

        }

        //Hides both the resCode key div and the result table until initialized via dropdown
        $('#result').hide();
        $('#resCode').hide();
        
        //Populates the Dropdown menu using the code and description from rezCode array
        for(let i = 0; i < rezCodes.length; i++)
        {
            $("#selectCode").append("<option value='" + i + "' index='" + i + "' status='false' id='" + i + "' >" + rezCodes[i][0] + " - " + rezCodes[i][3] + "</option>");
        }
        console.log("true");
    }

    //calls above function to initialize ARA input "screen"
    initializeInput();

    //if default from dropdown is selected, does nothing, otherwise
    //shows the selected resCode, resCode key, and resets dropdown to default
    $('#selectCode').change(function () {

        let index = $('#selectCode').val();
        if( index != 'default')
        {
            $("#resCode" + index).show();
            $('#resCode').show();
            $("#selectCode").val('default');
        }

    })
    

    /* 
     * Checks the number of tags from the currently selected resCode, if nan sets back to zero.
     * if input is a number, increases the count of the resCode object and increases fop and bop times
     * and updates and shows the result. 
    */
    $('.numInput').change(function () {
        let val = $(this).val();
        let index = $(this).attr("index");
        let code = codesToInput[index];
        console.log(val);
        console.log(isNaN(val).toString());

        decrementTime(code);

        if (isNaN(val) == true ) 
        {
            alert("Must be a number");
            $(this).val(0);
            code.setCount(0);
            

        }
        else 
        {
            code.setCount(val);
            incrementTime(code);
        }
        $('#result').show();
        logTotal();
    })

    //Updates result upon the change of the initials input.
    $('#initials').change(function() {
        logTotal();
    })

    //Updates result upon the change of "Hours Worked" input (unles NaN).
    $('#worked').change(function() {
        if (isNaN($(this).val()) == true ) 
        {
            alert("Must be a number");
            $(this).val('');
            hoursWorked = 0;
        }
        else
        {
            hoursWorked = $(this).val();
            logTotal();
        }
    })

    //Updates result upon the change of "Target Percent" input (unless NaN)
    $('#target').change(function() {
        if (isNaN($(this).val()) == true ) 
        {
            alert("Must be a number");
            $(this).val('');
            percentTarget = 0;
        }
        else
        {
            percentTarget = $(this).val() / 100;
            console.log(percentTarget);
            logTotal();
        }

    })



    //Removes current Code when x is clicked.
    //Decrements total Times prior to deletion
    $('.removeCode').click( function () {
        let index = $(this).attr("index");
        let code = codesToInput[index];

        logTotal();

        $("#resCode" + index).hide();

        decrementTime(code);

        if(tags == 0)
        {
            $('#result').hide();
            $('#resCode').hide();
        }

        logTotal();


    })

    //Takes in code and decrements total times (minutes)
    var decrementTime = function (code) 
    {

        if (code.fop > 0)
            totalFront -= ((code.count * code.fop) / 60);
        if(code.bop > 0)
            totalBack -= ((code.count * code.bop) / 60);

        tags -= code.count * 1;
    }

    //Takes in res code and increases the total times (minutes)
    var incrementTime = function(code) 
    {
        if (code.fop > 0)
            totalFront += (code.count * code.fop) / 60;
        if(code.bop > 0)
            totalBack += (code.count * code.bop) / 60;

        tags += code.count * 1;
    }
    
    //Updates the result Table
    var logTotal = function()
    {
        target = percentTarget * hoursWorked;
        toTarget = totalBack - target;
    
        if( toTarget > 0 ) 
            let toTarStr = "+" + toTarget.toFixed(2);
        
         
        $('#tDate').text(dateFormatted);
        $('#tInitials').text($('#initials').val().toString());
        $('#tWorked').text($('#worked').val());
        $('#tGenF').text(totalFront.toFixed(2));
        $('#tGenB').text(totalBack.toFixed(2));
        $('#tTarget').text(target.toFixed(2));
        $('#tToTarget').text(toTarStr);
        console.log("Total Front: " + totalFront.toFixed(2));
        
    }
})
