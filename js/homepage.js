


$(document).ready(function() {



	//Code, Front of precinct labor, Back of precinct Labor, Description
	var rezCodes = [
	["AMAL", 20, 9, "Apple Mail-In Repair"],
	["ABAT", 15, 30, "Apple Battery Repair"],
	["AREC", 15, 30, "Apple Speaker Repair"],
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
	["GSOS", 32, 49, "Geek Squad Operating System Install"],
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



	



	var initializeInput = function () {

		$("#formContainer").append(
			"<select id='selectCode'>" +
			"<option class='selectCodes' value='default'>Select Code</option>" +
			"<input id='adder' type='submit' value='Add'> </input>" +
			"</select>" 
			
			);

		for(var i = 0; i < rezCodes.length; i++)
		{

			codesToInput.push(resCode(rezCodes[i]));
			$('#formContainer').append(codesToInput[i].resCodeHTML());
			$('#resCode' + i).hide();

		}
		

		for(let i = 0; i < rezCodes.length; i++)
		{
			$("#selectCode").append("<option value='" + i + "' index='" + i + "' status='false' id='" + i + "' >" + rezCodes[i][0] + " - " + rezCodes[i][3] + "</option>");
		}
		console.log("true");
	}

	initializeInput();

	$('#adder').click(function () {

		let index = $('#selectCode').val();
		if( index != 'default')
		{
			$("#resCode" + index).show();
		}

	})
	


	


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
		logTotal();
	})



	//Removes current Code when x is clicked.
	//Decrements total Times prior to deletion
	$('.removeCode').click( function () {
		let index = $(this).attr("index");
		let code = codesToInput[index];

		logTotal();

		$("#resCode" + index).hide();

		decrementTime(code);

		logTotal();


	})

	//Takes in code and decrements total times (minutes)
	var decrementTime = function (code) 
	{

		if (code.fop > 0)
			totalFront -= ((code.count * code.fop) / 60);
		if(code.bop > 0)
			totalBack -= ((code.count * code.bop) / 60);
	}

	//Takes in res code and increases the total times (minutes)
	var incrementTime = function(code) 
	{
		if (code.fop > 0)
			totalFront += (code.count * code.fop) / 60;
		if(code.bop > 0)
			totalBack += (code.count * code.bop) / 60;
	}
	
	//logs current Time
	var logTotal = function()
	{
		console.log("Total Front: " + totalFront.toFixed(2));
		console.log("Total Back: " + totalBack.toFixed(2));
	}

	


	
	

})
