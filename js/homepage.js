/*
*Created By Michael Winberry
*First Version Completed 11/5/18
*/

$(document).ready(function() {
    var login = false;


    //Code, Front of precinct labor, Back of precinct Labor, Description
    var rezCodes = [
    ["GSDB", 32, 57, "Data Back Up or Transfer"],
    ["GSDI", 32, 30, "Diagnostic"],
    ["GSOS", 32, 49, "Geek Squad Operating System Repair"],
    ["GSSW", 32, 12, "Software Installation"],
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
    ["GSHD", 32, 18, "Hard Drive Install"],
    ["GSHW", 32, 18, "Misc Internal Part Install"],
    ["GSMM", 32, 18, "Memory Install"],
    ["GSNW", 32, 18, "Network Card/Adapter Install"],
    ["GSOI", 32, 20, "Operating System Install"],
    ["GSPS", 32, 18, "Power Supply Install"],
    ["GSPU", 32, 18, "Computer Processor Install"],
    ["GSSB", 32, 18, "System Board Install"],
    ["GSSC", 32, 18, "Sound Card Install"],
    ["GSPW", 32, 12, "Password Reset"],
    ["GSVC", 32, 18, "Video Card Install"],
    ["GSCS", 30, 0, "PC/Tablet Setup"],
    ["GSDS", 20, 0, "Device Setup"],
    ["GSFM", 5, 0, "Restore Media Creation"],
    ["GSSH", 9, 0, "Device Screen Shield Install"],
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
            var thisId = "resCode" + this.position;

            var html = "<div id='resCode" + this.position + "' class='resCodes' index='" + this.position + "'>" +
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


//Creates utilization object based on User inputed Values.
//Uses Date Object
//Primary structure for mongodb 
var utilization = function() {
    return{
        totalFront: 0,
        totalBack: 0,
        hoursWorked: 0,
        percentTarget: .79,
        targetHrs: 0,
        toTarget: 0,
        initials: "CA",
        tags: 0,
        date: null,
        day: null,
        year: null,
        week: 1,
        fWeek: null,
        dateFormatted: null,

        setDate: function(newDate) {
            this.date = newDate;
            this.day = newDate.getDate();
            this.month = newDate.getMonth();
            this.year = newDate.getFullYear();
            this.dateFormatted = (this.month+1) + '/' + this.day + '/' + this.year;

        },
    }
}

var util = new utilization();
//util.setDate(new Date());, 
util.setDate(new Date());

var todaysDate = new utilization();
todaysDate.setDate(new Date());

//Creates the Input, Dropdown, result table, and key for res Codes.
//hides all resCode objects, result table, and key until resCode is inizialized via dropdown
var initializeInput = function () {

    $("#formContainer").append(

        "<div id='araInput'>" + 
        "<div id='inputs' class='resCodes'>"+
        "<h2>Input</h2>" +

        "<div class='cell results'>" + 
        "<div>Target Percent</div>" + 
        "<input type='text' id='target' value='79' ></input>" + 
        "</div>" +
        
        "<h2>Select Code</h2>"+
        "<select id='selectCode'>" +
        "<option class='selectCodes' value='default'>Select Resolution Code</option>" +
        "</select></br>"+

        "<div class='cell results' id='result'>" + 
        "<h3>Results</h3>" +
        "<table id='resTable'>"+
        "<tr>" +
        "<th class='resHeader'>Date</th>" + 
        "<th class='resHeader'>Week</th>" +
        "<th class='resHeader'>Fiscal Month</th>" + 
        "<th class='resHeader'>Initials</th>" + 
        "<th class='resHeaser'>Hours Worked</th>" +  
        "<th class='resHeader'>Generated Back</th>" +
        "<th class='resHeader'>To Target (hrs)</th>" + 
        "</tr>" +
        "<tr>" + 
        "<td><input type='text' id='tDate'></input></td>" + 
        "<td><input type='text' id='tWeek' value='1'></input></td>" + 
        "<td><input type='text' id='fMonth' value='0'></input></td>" + 
        "<td><input type='text' id='tInitials' value='CA'></input></td>" + 
        "<td><input id='tWorked' type='text' value='0'></input></td>" + 
        "<td id='tGenB'>0</td>" + 
        "<td id='tToTarget' >0</td>" + 
        "</tr>"+
        "</table>" + 
        "</div>" +

        "<input id='addUtildb' value='Submit' type='button'/>" +
        "</div>"+
        "<div id='resCodeWrap'>" +
        "<div id='resCode' class='resCodes' +>" +
        "<div class='abbr cell'>CODE</div>" +
        "<div class='fop cell' value='" + "FP" + "'>" + "FP" + "</div>" + 
        "<div class='bop cell' value='" + "BP"+ "'>" + "BP" + "</div>" + 
        "<div class='description cell'>" + "Description" + "</div>" + 
        "<div class='rhs'>"+
        "<div class='rsh'></div>"+
        "<div class='numInput cell' id='tags'>" + "Total" + "</div>" +
        "</div>" +
        "</div>" +
        "</div>"
        );

    //Appends the resCodes and then hides until initialized via dropdown #selectCode
    for(var i = 0; i < rezCodes.length; i++)
    {
        codesToInput.push(resCode(rezCodes[i]));
        $('#resCodeWrap').append(codesToInput[i].resCodeHTML());

        if(i > 3)
            $('#resCode' + i).hide();
    }

    //Populates the Dropdown menu using the code and description from rezCode array
    for(let i = 0; i < rezCodes.length; i++)
        $("#selectCode").append("<option value='" + i + "' index='" + i + "' status='false' id='" + i + "' >" + rezCodes[i][0] + " - " + rezCodes[i][3] + "</option>");
    
    $('#tDate').val(util.dateFormatted);
}


//Creates the HTML Portions of the View Data Tab and Hides for Selection.
var initializeData = function() {
    $("#formContainer").append(
        "<div id='dataSearch'>" +
        "<div id='dataWrap'>"+
        "<h2>Select Search Parameters</h2>" +

        "<select id='selSearch'>" +

        "<option value='default'>Select Search Criteria</option>"+
        //"<option value='searchP1'>View All</option>"+ 
        "<option value='searchP2'>View Year</option>" +
        "<option value='searchP3'>View Month</option>"+
        "<option value='searchP4'>View Week</option>" +
        //"<option value='searchP5'>View Agent</option>" +

        "</select>" +

        "<div id='searchInputs'>" +
        "<table class='searchTable' id='searchP2'>" +

        "<tr>"+
        "<th class='resHeader'>Year</th>"+
        "</tr>"+

        "<tr>"+
        "<td><input class='sYears searchInput' id='sYear' type='text'></input></td>"+
        "</tr>" +

        "</table>" +

        "<table class='searchTable' id='searchP3'>" +

        "<tr>"+
        "<th class='resHeader'>Month</th>"+
        "<th class='resHeader'>Year</th>"+
        "</tr>"+

        "<tr>" +
        "<td><input class='sMonths searchInput' type='text' id='sMonth'></input></td>"+
        "<td><input class='sYears searchInput' id='sYear' type='text' id='sYear'></input></td>"+
        "</tr>" +

        "</table>" +

        "<table class='searchTable' id='searchP4'>" +

        "<tr>"+
        "<th class='resHeader'>Week</th>" +
        "<th class='resHeader'>Month</th>"+
        "<th class='resHeader'>Year</th>"+
        "</tr>"+

        "<tr>" +
        "<td><input class='sWeeks searchInput' type='test' id='sWeek'></input></td>"+
        "<td><input class='sMonths searchInput' type='text' id='sMonth'></input></td>"+
        "<td><input class='sYears searchInput' id='sYear' type='text'></input></td>"+
        "</tr>" +

        "</table>" +

        "<div id=submitSearchDiv >"+
        "<input type='button' value='submit' id='submitSearch'/>" +
        "</div>"+
        "</div>"+
        "<div id='printData'></div>" +
        "</div>"

        );

    for (let i = 2; i <= 5; i++)
    {
        $('#searchP' + i).hide();
    }
    
}

function loadLogin() {
    $("#formContainer").prepend(
        "<form id='loginForm'>" +
        "<h2>Login</h2>"+
        "<input type='text' placeholder='Username' id='uname' required><br>" +
        "<input type='password' placeholder='Password' id='psw' required><br>" +
        "<button type='submit' >Login</button>" +
        "</form>"
        );
    $('#uname').focus();
}


initializeInput();
initializeData();
loadLogin();

$('#loginForm').submit(function () {
    attemptLogin();
    $('#uname').val('');
    $('#psw').val('');
    return false;
})

//Hides the View Data HTML, When clicking on ARA Tab.
$('#araTab').on('click', function() {
    $('#dataSearch').hide();
    $('#loginForm').hide();
    $('#araInput').show();
})

$('#viewLogin').on('click', function() {
    $('#dataSearch').hide();
    $('#araInput').hide();
    $('#loginForm').show();
    $('#uname').focus();

})

//Hides the ARA Tab When Clicking on ViewData Tab.
$('#viewDataTab').on('click', function() {
    $('#loginForm').hide();
    $('#araInput').hide();
    $('#dataSearch').show();
    popSearchInputs();
})


//sets the default search parameters.
var popSearchInputs = function() {
    $('.sWeeks').val(1);
    $('.sYears').val(todaysDate.year);
    $('.sMonths').val(todaysDate.month+1);
}

var previousSearch = 'default';

//Shows new search type when the selector is changed
$('#selSearch').on('change', function() {
    $('#' + previousSearch).hide();
    previousSearch = $(this).val();

    if(previousSearch != 'default' && previousSearch != 'searchP1')
        $('#' + previousSearch).show();

    if(previousSearch == "searchP2")
        $('#sYear').focus();
    
    else if(previousSearch == 'searchP3')
        $('#sMonth').focus();
    
    else if(previousSearch == 'searchP4')
        $('#sWeek').focus();
})

//if default from dropdown is selected, does nothing, otherwise
//shows the selected resCode, resCode key, and resets dropdown to default
$('#selectCode').change(function () {
    var index = $('#selectCode').val();

    if( index != 'default')
    {
        $("#resCode" + index).show();
        $("#selectCode").val('default');
    }
})

//Set focus and unfocus behaviors for input's

$('#tWorked').on('focus click', function(){
    $(this).select();
})

$('#tWorked').focusout(function() {
    if($(this).val() == "")
    {
        $(this).val(0);
        util.hoursWorked = 0;
    }
    
})

$('#tWeek').on('focus click', function() {
	$(this).select();
})

$('#tWeek').focusout(function() {
	if(isNaN($(this).val()))
	{
		$(this).val(1);
		util.week = 1;
	}
})

$('#fMonth').on('focus click', function() {
    $(this).select();
})

$('#fMonth').on('focusout change', function () {
    if(isNaN(parseInt($(this).val())))
    {
        $(this).val(0);
    }

    else if(parseInt($(this).val()) <= 0 || parseInt($(this).val() > 12)) {
        alert("Not Valid Month");
    }

    else 
        util.fMonth = $(this).val();
})


$('#tInitials').on('change focusout',function() {
    if($(this).val() == "")
    {
        alert("Invalid Input");
        $(this).focus();
    }
})

$('#tInitials').on("click focus", function() {
    $(this).select();

})

$('#tDate').on('click focus', function() {
    $(this).select();
})

//$('#tWorked').focus();
$('#tInitials').focus();

//Submit Button For ARA Tab, Inserts New Util Object into Database 'dates'.
$('#addUtildb').click(function() {
    if($('#fMonth').val() > 12 || $('#fMonth').val() <= 0 || isNaN($('#fMonth').val()))
    {
        $('#fMonth').focus();
    }
    else
        checkLogin();
})

//Handles Submit Search Parameters Based on Drop Down Lists Selection.
$('#submitSearch').click(function() {
    $('#printData').empty();
    var thisMonth = $('#sMonth').val() - 1;
    var thisFMonth = $('#sMonth').val();
    var thisYear = $('#sYear').val();
    var thisWeek = $('#sWeek').val();
    var thisAgent = $('#sInitial').val();

    if(previousSearch == 'searchP2')
        getByYear(thisYear);
    else if(previousSearch == 'searchP3')
        getByMonth(thisFMonth, thisYear);
    else if (previousSearch == 'searchP4')
        getByWeek(thisWeek, thisFMonth, thisYear);
})


/* 
 * Checks the number of util.tags from the currently selected resCode, if nan sets back to zero.
 * if input is a number, increases the count of the resCode object and increases fop and bop times
 * and updates and shows the result. 
 */
 $('.numInput').on('change keyup paste',function () {
    var oldVal = $(this).attr('value');
    var val = $(this).val();
    var index = $(this).attr("index");
    var code = codesToInput[index];
    
    if (isNaN(val) == true ) 
    {
        alert("Must be a number");
        $(this).val(oldVal);
        code.setCount(oldVal);
    }
    else 
    {
        decrementTime(code.fop, code.bop, oldVal);
        code.setCount(val);
        incrementTime(code.fop, code.bop, val);
        $(this).attr('value', val);
    }
    logTotal();
})

//Updates result upon the change of the initials input.
$('#tInitials').on('change keyup paste', function() {
    util.initials = $(this).val();
    console.log(util.initials);
})

//Updates util.week upon changin the week input
$('#tWeek').on('focusout change keyip paste', function() {
   if ($(this).val() > 6 || $(this).val() <= 0)
   {
    alert("Invalid Week")
    $(this).focus();
}
else
{
   util.week = $(this).val();
}

})

//Updates result upon the change of "Hours Worked" input (unles NaN).
$('#tWorked').on('foucusout change keyup paste',function() {
    if (isNaN($(this).val()) == true ) 
    {
        alert("Must be a number");
        $(this).focus();
    }
    else
    {
        util.hoursWorked = $(this).val();
        logTotal();
    }
})

//Updates result upon the change of "Target Percent" input (unless NaN)
$('#target').on('focusout change paste',function() {
    if (isNaN($(this).val()) == true || $(this).val() > 100 || $(this).val() < 1) 
    {
        alert("Must be a Number between 1 and 100");
        $(this).val(79);
        util.percentTarget = .79;
    }
    else
    {
        util.percentTarget = $(this).val() / 100;
        console.log(util.percentTarget);
        logTotal();
    }

})

//Removes current Code when x is clicked.
//Decrements total Times prior to deletion
$('.removeCode').click( function () {
    var index = $(this).attr("index");
    var oldVal = $('#num' + index).val();
    var code = codesToInput[index];

    decrementTime(code.fop, code.bop, oldVal);

    $('#num' + index).val(0);
    $('#num' + index).attr('value', 0);
    $("#resCode" + index).hide();

    logTotal();
})

//validates date on change. 
$('#tDate').on('change', function() {
    var newDate = $(this).val().split('/');
    console.log(newDate);
    console.log(newDate.length);
    if(newDate.length == 3 )
    {
        var newMonth = newDate[0];
        var newDay = newDate[1];
        var newYear = newDate[2];
        var isValid = isValidDate(newDay, newMonth, newYear);
        console.log(isValid);

        if(isValid)
        {
            util.date = new Date(newYear, (newMonth-1), newDay);
            util.setDate(util.date);
            console.log(util.dateFormatted);
            return;
        }
    }
    else
    {
        alert("Invalid Date");
        util.setDate(new Date());
        $('#tDate').val(util.dateFormatted);
    }

})

//creates new date object, validates that it is a valid date, then calls isPast to verify not a future date. 
var isValidDate = function(thisDay, thisMonth, thisYear) 
{
    let newDate = new Date(thisYear, (thisMonth-1), thisDay);
    let tempDate = new Date();
    console.log(thisYear + "/" + thisMonth + "/" + thisDay); 
    
    validate = newDate.getFullYear() == thisYear && (newDate.getMonth()+1) == thisMonth && newDate.getDate() == thisDay;
    
    
    console.log(validate);
    if(validate && isPast(newDate, tempDate))
        return true;
    else
        return false;
}

//checks if date is today, or if it is in past to prevent future dates.
var isPast = function(date1, date2) 
{
    if(date1.getFullYear() < date2.getFullYear())
        return true;
    else if(date1.getMonth() < date2.getMonth())
        return true;
    else if(date1.getDate() <= date2.getDate())
        return true;
    else
        return false;
}


//Takes in code and decrements total times (minutes)
var decrementTime = function(fop, bop, val) 
{
    if (fop > 0)
        util.totalFront -= ((val * fop) / 60);
    if(bop > 0)
        util.totalBack -= ((val * bop) / 60);

    util.tags -= val * 1;
}

//Takes in res code and increases the total times (minutes)
var incrementTime = function(fop, bop, val) 
{
    if (fop > 0)
        util.totalFront += (val * fop) / 60;
    if(bop > 0)
        util.totalBack += (val * bop) / 60;

    util.tags += val * 1;
}

//Updates the result Table as well as targetHrs and toTarget.
var logTotal = function()
{
    util.targetHrs = util.percentTarget * util.hoursWorked;
    util.toTarget = util.totalBack - util.targetHrs;

    $('#tWorked').val(util.hoursWorked);
    $('#tGenB').text(round(util.totalBack));
    $('#tToTarget').text(round(util.toTarget));   
}


//Populate Based on the Selection Chosen By User, and the Current ID when the View Submit Botton is Clicked/Submitted.

var populateYearTable = function(data) {
    let months = [];
    let year = sortByInitial(data);

    /*
    for (let i = 0; i < data.length; i++)
    {
        if(weeks.indexOf(data[i].week) <= -1)
        {
            weeks.push(data[i].week);
        }
    }
    */
    populateTable(year, 'year');
    /*
    for(let i = 0; i < weeks.length; i++)
        getByWeek(weeks[i], month[0].month, month[0].year);
    */
}


var populateMonthTable = function(data) {
    let weeks = [];
    let month = sortByInitial(data);

    
    for (let i = 0; i < data.length; i++)
    {
        if(weeks.indexOf(data[i].week) <= -1)
        {
            weeks.push(data[i].week);
        }
    }
    
    populateTable(month, 'month');
    
    for(let i = 0; i < weeks.length; i++)
        getByWeek(weeks[i], month[0].fMonth, month[0].year);
    
}

var populateWeekTable = function(data)
{
    let week = sortByInitial(data);
    populateTable(week, 'week');
}


//Populates a New Table Based on the Identifier Provided By User Input (year, month, or week)
var populateTable = function(data, identifier) {
    let thisID = '';
    let idString = '';

    if(identifier == 'year')
    {
        thisID = data[0].year;
        idString = thisID;
    }
    else if (identifier == 'month')
    {
        thisID = (parseInt(data[0].fMonth))  + "-" + data[0].year;
        idString = thisID;
    }
    else if (identifier == 'week')
    {
        thisID = data[0].week + "-" + data[0].fMonth + "-" + data[0].year;
        idString = "Week: " + data[0].week + " " + data[0].fMonth + "-" + data[0].year ;
    }


    $('#printData').append(
        "<table class='dataWrap' id='" + thisID + "'>" +
        "<tr>"+
        "<th class='dataTable title'>" + idString + "</th>"+
        "</tr>"+
        "<tr>"+
        "<th class='dataTable'>Agent</th>" +
        "<th class='dataTable'>Hrs Worked</th>"+
        "<th class='dataTable'>Generated</th>"+
        "<th class='dataTable'>To Target</th>"+
        "</tr>"+
        "</table>"
        );

    var currentAgent = data[0].initials;
    var totalWorked = 0;
    var totalGenerated = 0;
    var totalTarget = 0;
    var agentWorked = 0;
    var agentGenerated = 0;
    var agentTarget = 0;

    for (let i = 0; i < data.length; i++)
    {
        initials = data[i+1];
        agentWorked += parseFloat(data[i].hoursWorked);
        agentGenerated += parseFloat(data[i].totalBack);
        agentTarget += parseFloat(data[i].toTarget);

        if (initials == null || initials.initials != currentAgent)
        {
            $('#' + thisID).append(
                "<tr id='" + thisID + currentAgent + "'>"+
                "<td class='dataTable'>" + currentAgent + "</td>"+
                "<td class='dataTable'>" + round(agentWorked) + "</td>" +
                "<td class='dataTable'>" + round(agentGenerated) + "</td>" +
                "<td class='dataTable'>" + round(agentTarget) + "</td>"+
                "</tr>" 
                );

            totalWorked += agentWorked;
            totalGenerated += agentGenerated;
            totalTarget += agentTarget;
            agentWorked = agentGenerated = agentTarget = 0;

            if(initials != null)
                currentAgent = data[i+1].initials;
        }
    }
    $('#' + thisID).append(
        "<tr>"+
        "<td class='dataTable'>Totals</td>"+
        "<td class='dataTable'>" + round(totalWorked) + "</td>" +
        "<td class='dataTable'>" + round(totalGenerated) + "</td>" +
        "<td class='dataTable'>" + round(totalTarget) + "</td>"+
        "</tr>"
        );
}


//Insertion Sort, based on Initials.
var sortByInitial = function(data) {
    for(var i = 0; i < data.length; i++)
    {
        for(var j = i; j > 0; j--)
        {
            if(data[j].initials < data[j-1].initials)
            {
                var temp = data[j];
                data[j] = data[j-1];
                data[j-1] = temp;
            }
            else
                break; 
        }
    }
    return data;
}

var round = function(numb) {
    return Math.round(numb * 100) / 100;
}


//Adds new utilization to data base, if it exists then calls update.
var addNewUtilization = function(utilit) { 
        $.ajax({
            url: '/add',
            method: "POST",
            data: {
                day: utilit.day,
                year: utilit.year,
                month: utilit.month,
                week: utilit.week,
                fMonth: utilit.fMonth,
                initials: utilit.initials.toUpperCase(),
                hoursWorked: utilit.hoursWorked,
                percentTarget: utilit.percentTarget,
                totalFront: utilit.totalFront,
                totalBack: utilit.totalBack,
                toTarget: utilit.toTarget
            },
            success: function(data) {
                alert(data);
                alert("Successfully Added Utilization");
            },
            error: function(err, data)
            {           
               updateUtilization(util);
           }
       }) 
}

//requests to update, updates if confirmed, upserts if does not exist, logs data if error. 
var updateUtilization = function(utilit) {
    var confirmation = confirm("Utilization for " + utilit.initials  + " on " + utilit.initials + " Already Exists,\n Update?");
    if(confirmation)
    {
        $.ajax({
            url: '/updateDB',
            type: 'POST',
            data:
            {
             day: utilit.day,
             year: utilit.year,
             month: utilit.month,
             fMonth: utilit.fMonth,
             week: utilit.week,
             initials: utilit.initials.toUpperCase(),
             hoursWorked: utilit.hoursWorked,
             percentTarget: utilit.percentTarget,
             totalFront: utilit.totalFront,
             totalBack: utilit.totalBack,
             toTarget: utilit.toTarget 
         },
         success: function(data) {
            alert("Successfully updated Utilization");
        },
        error: function(err)
        {
            console.log(err);
        }
    });
    }
    else
        alert("No Data Has Been Updated.");
}

//app.get('/view/:week/:month/:year', db.viewWeek);
//Finds and Returns Entries Based on Week, Month, and Year.
var getByWeek = function (week, month, year) {
    if(isValidDate(todaysDate.day, (month-1), year))
    {
        $.ajax({
            url: "/view/" + week + "/" + month + "/" + year,
            type: 'get',
            success: function(data) {
                popSearchInputs();
                populateWeekTable(data);
            },
            err: function(err) {
                console.log(err);
                alert("No Entries Found For Given Parameters.");
                popSearchInputs();
            }
        });
    }
    else{
        alert("Invalid Parameters");
        popSearchInputs();
    }
}

//app.get('/view/:month/:year', db.viewMonth);
//Finds and Returns Data Based on Month and Year.
var getByMonth = function (fMonth, year) {
    if(isValidDate(todaysDate.day, (fMonth-1), year))
    {
        $.ajax({
            url: "view/" + fMonth + "/" + year,
            type: 'get',
            success: function(data) {
                popSearchInputs();
                populateMonthTable(data);
            },

            err: function (err) {
                console.log(err);
                alert("No Entries Found For Given Parameters");
                popSearchInputs();
            }
        });
    }
    else{
        alert("Invalid Parameters");
        popSearchInputs();
    }

}

//app.get('/view/:year', db.viewYear); 
//Finds and Removes Entries Based on Year. 
var getByYear = function (year) {
    if(isValidDate(todaysDate.day, todaysDate.month, year))
    {
        $.ajax({
            url: "view/" + year,
            type: 'get',
            success: function(data) {
                popSearchInputs();
                populateYearTable(data);
            },
            err: function(err) {
                alert("No Entries Found For Given Parameters");
                popSearchInputs();
            }
        });
    }
    else{
        alert("Invalid Parameters");
        popSearchInputs();
    }

}

var getLast = function(newUtil) {
    $.ajax({
        url: "getLast/",
        type: 'get',
        success: function(data) {
            if(data == undefined || data.length == 0)
                return;
            
            if(newUtil.date.getDay() != 0)
            {
                var lastAdded = data[0];
                newUtil.week = lastAdded.week;
                newUtil.fMonth = lastAdded.fMonth;
            }
            else if(newUtil.date.getDay() == 0)
            {
                var lastAdded = data[0];
                if(lastAdded.month != newUtil.month || lastAdded.fMonth != (parseInt(lastAdded.month)+1))
                {
                    newUtil.week = 1;
                    if(lastAdded.fMonth == 12)
                        newUtil.fMonth = 1;
                    else
                        newUtil.fMonth = parseInt(lastAdded.fMonth) + 1;
                }
                else
                {
                    newUtil.week = parseInt(lastAdded.week) + 1;
                    newUtil.fMonth = lastAdded.fMonth;
                }
                
            }

            $('#target').val(lastAdded.percentTarget * 100);
            $('#tWeek').val(newUtil.week);
            $('#fMonth').val(newUtil.fMonth);
        },
        err: function(err) {
            console.log("No Last Week");
            
        }
    })
}



function checkLogin() {
    $.ajax({
        url: "checkLogin/",
        type: 'get',
        success: function(data) {
            addNewUtilization(util);
        },
        error: function(err) {
            console.log(err); 
            alert("Must Login To Submit");
            toggleLogin();

        }
    });
}

function attemptLogin() {
    $.ajax({
        url: "/login",
        type: 'POST',
        data: { Username: $('#uname').val(), Password: $('#psw').val() },
        success: function(data) {
            $('#loginForm').hide();
            $('#araInput').show();
            $('#viewLogin').hide();
        },
        error: function(err) {
            alert("Invalid Username or Password");
        }
    });
}

function toggleLogin() {
    if(login)
    {
        $('#loginForm').hide();
        $('#dataSearch').hide();
        $('#araTab').show();
    }
    else 
    {
        $('#dataSearch').hide();
        $('#araInput').hide();
        $('#loginForm').show();
    }
};
toggleLogin();

//Calls Get Last to set last added week. 
getLast(util);
})
