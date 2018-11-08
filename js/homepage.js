/*
 *Created By Michael Winberry
 *First Version Completed 11/5/18
 */

 $(document).ready(function() {

    $('#viewData').hide();





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

    var utiliaztion = function() {
        return{
            totalFront: 0,
            totalBack: 0,
            hoursWorked: 0,
            percentTarget: .79,
            targetHrs: 0,
            toTarget: 0,
            initials: "CA",
            tags: 0,
            day: null,
            month: null,
            year: null,
            week: null,
            dateFormatted: null,
            setDate: function(newDate) {
                this.day = newDate.getDate();
                this.month = newDate.getMonth();
                this.year = newDate.getFullYear();
                this.dateFormatted = (this.month+1) + '/' + this.day + '/' + this.year;

            }
        }
    }

    var util = new utiliaztion();
    util.setDate(new Date());

    //Creates the Input, Dropdown, result table, and key for res Codes.
    //hides all resCode objects, result table, and key until resCode is inizialized via dropdown
    var initializeInput = function () {

        $("#formContainer").append(


            "<div id='inputs' class='resCodes'>"+
            "<h3>Input</h3>" +
            /*
            "<div class='cell results'>" + 
            "<div>Initials</div>" + 
            "<input type='text' id='initials'></input>" + 
            "</div>"+
            */
            /*
            "<div class='cell results'>" + 
            "<div id='workedDiv'>Hours Worked</div>" + 
            "<input type='text' id='worked' value='0' ></input>" + 
            "</div>" +
            */

            "<div class='cell results'>" + 
            "<div>Target Percent</div>" + 
            "<input type='text' id='target' value='79' ></input>" + 
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
            //"<th class='resHeader'>Generated Front</th>" + 
            "<th class='resHeader'>Generated Back</th>" +
            //"<th class='resHeader'>Target (hrs)</th>" +
            "<th class='resHeader'>To Target (hrs)</th>" + 

            "</tr>" +
            "<tr>" + 
            "<td><input type='text' id='tDate'></input></td>" + 
            "<td><input type='text' id='tInitials' value='CA'></input></td>" + 
            "<td><input id='tWorked' type='text' value='0'></input></td>" + 
            //"<td id='tGenF'></td>" + 
            "<td id='tGenB'>0</td>" + 
            //"<td id='tTarget'></td>" +
            "<td id='tToTarget' >0</td>" + 
            "</tr>"+
            "</table>" + 
            "</div>" +
            "</div>"+

            "<div id='resCodeWrap'>" +
            "<div id='resCode' class='resCodes' +>" +
            "<div class='abbr cell'>CODE</div>" +
            "<div class='fop cell' value='" + "FP" + "'>" + "FP" + "</div>" + 
            "<div class='bop cell' value='" + "BP"+ "'>" + "BP" + "</div>" + 
            "<div class='description cell'>" + "Description" + "</div>" + 
            "<div class='rhs'>"+
            "<div class='numInput cell' id='util.tags'>" + "Total" + "</div>" +
            "</div>" +
            "</div>"
            
            );

        //Appends the resCodes and then hides until initialized via dropdown #selectCode
        for(var i = 0; i < rezCodes.length; i++)
        {

            codesToInput.push(resCode(rezCodes[i]));
            $('#resCodeWrap').append(codesToInput[i].resCodeHTML());
            if(i > 3)
            {
            	$('#resCode' + i).hide();
            }

        }

        //Hides both the resCode key div and the result table until initialized via dropdown
        
        
        //Populates the Dropdown menu using the code and description from rezCode array
        for(let i = 0; i < rezCodes.length; i++)
        {
            $("#selectCode").append("<option value='" + i + "' index='" + i + "' status='false' id='" + i + "' >" + rezCodes[i][0] + " - " + rezCodes[i][3] + "</option>");
        }
        console.log("true");
        $('#tDate').val(util.dateFormatted);
    }

    //calls above function to initialize ARA input "screen"
    initializeInput();
    
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

    $('#tInitials').focusout(function() {
        if($(this).val() == "")
        {
            $(this).val("CA");
            util.initials = "CA";
        }
    })

    $('#tInitials').on("click focus", function() {
        $(this).select();

    })

    $('#tDate').on('click focus', function() {
        $(this).select();
    })

    //$('#tWorked').focus();
    $('#tDate').focus();




    //if default from dropdown is selected, does nothing, otherwise
    //shows the selected resCode, resCode key, and resets dropdown to default
    $('#selectCode').change(function () {

        let index = $('#selectCode').val();
        if( index != 'default')
        {
            $("#resCode" + index).show();
            $("#selectCode").val('default');
        }

    })
    

    /* 
     * Checks the number of util.tags from the currently selected resCode, if nan sets back to zero.
     * if input is a number, increases the count of the resCode object and increases fop and bop times
     * and updates and shows the result. 
     */
     $('.numInput').on('change keyup paste',function () {
        let oldVal = $(this).attr('value');
        let val = $(this).val();
        let index = $(this).attr("index");
        let code = codesToInput[index];
        
        
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
    $('#initials').on('change keyup paste', function() {
        util.initials = $(this).val();
        console.log(util.initials);
    })

    //Updates result upon the change of "Hours Worked" input (unles NaN).
    $('#tWorked').on('change keyup paste',function() {
        if (isNaN($(this).val()) == true ) 
        {
            alert("Must be a number");
            $(this).val(0);
            util.hoursWorked = 0;
        }
        else
        {
            util.hoursWorked = $(this).val();
            logTotal();
        }
    })

    //Updates result upon the change of "Target Percent" input (unless NaN)
    $('#target').on('change keyup paste',function() {
        if (isNaN($(this).val()) == true ) 
        {
            alert("Must be a number");
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
        let index = $(this).attr("index");
        let oldVal = $('#num' + index).val();
        let code = codesToInput[index];

        logTotal();

        decrementTime(code.fop, code.bop, oldVal);

        $('#num' + index).val(0);
        $('#num' + index).attr('value', 0);
        $("#resCode" + index).hide();

        logTotal();


    })

    $('#tDate').on('change', function() {
        let newDate = $(this).val().split('/');
        console.log(newDate);
        console.log(newDate.length);
        if(newDate.length == 3 )
        {
            let newMonth = newDate[0];
            let newDay = newDate[1];
            let newYear = newDate[2];

            let isValid = isValidDate(newDay, newMonth, newYear);
            console.log("isValidDate: " + isValid);
            if(isValid)
            {
                util.setDate(new Date(newYear, (newMonth-1), newDay));
                return;
            }
        }
        alert("Invalid Date");
        util.setDate(new Date());
        $(this).val(util.dateFormatted);
        

    })


    var isValidDate = function(thisDay, thisMonth, thisYear) {
        let newDate = new Date(thisYear, (thisMonth-1), thisDay);
        let tempDate = new Date();
        console.log("New Date month: " + newDate.getMonth());
        console.log("Date Month: " + util.month);
        let validate = newDate.getFullYear() == thisYear && newDate.getMonth()+1 == thisMonth && newDate.getDate() == thisDay;
        if(validate && isPast(newDate, tempDate))
            return true;
        else
            return false;

    }

    var isPast = function(date1, date2) 
    {
        console.log("New Date: " + date1.getFullYear() + " Current Date: " + date2.getFullYear());
        console.log("Date1: " + date1.getDate() + " Date2: " + date2.getDate());
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
    
    //Updates the result Table
    var logTotal = function()
    {
        util.targetHrs = util.percentTarget * util.hoursWorked;
        util.toTarget = util.totalBack - util.targetHrs;
        $('#tWorked').val(util.hoursWorked);
        //$('#tGenF').text(totalFront.toFixed(2));
        $('#tGenB').text(util.totalBack.toFixed(2));
        //$('#tTarget').text(target.toFixed(2));
        $('#tToTarget').text(util.toTarget.toFixed(2));
        console.log("Total Front: " + util.totalFront.toFixed(2));
        
    }

    var addNewUtilization = function() {
        $.ajax({
            url: '/add',
            method: "POST",
            data: {
                day: util.day, 
                month: util.month, 
                year: util.year, 
                week: util.week,
                initials: util.initials, 
                generatedFront: util.totalFront, 
                generatedBack: util.totalBack,
                toTarget: util.toTarget,
                percent: util.percentTarget
            },
            success: function(data) {
                alert("Successfully Added Utilization: " + util.dateFormatted + " " + util.initials);
            },
            error: function(err)
            {

               updateUtilization();

           }

       })

        util = new Utilization();
        util.setDate(new Date())
    }

    var updateUtilization = function() {
        let confirmation = confirm("Utilization for " + util.initials  + " on " + util.initials + " Already Exists,\n Update?");
        if(confirmation)
        {
            $.ajax({
                url: '/update/',
                type: 'POST',
                data:
                {
                    day: util.day, 
                    month: util.month, 
                    year: util.year,
                    week: util.week, 
                    initials: util.initials, 
                    generatedFront: util.totalFront, 
                    generatedBack: util.totalBack,
                    toTarget: util.toTarget,
                    percent: util.percentTarget,


                },
                success: function() {
                    alert("Successfully Added Utilization: " + util.dateFormatted + " " + util.initials);
                },
                error: function(data)
                {
                    console.log(data);
                }
            })
        }
        else
        {
            alert("No Data Has Been Updated.");
        }
    }

})
