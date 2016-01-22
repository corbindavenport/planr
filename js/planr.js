// Initialize everything

$(document).ready(function(){

	$('#setup').hide();
	$('#content').hide();
	$('#transfer-help').hide();
	$('.nav-wrapper').hide();
	$('select').material_select();

	if (localStorage.getItem("todaylist") === null) {
		localStorage["todaylist"] = '"This is a sample list item. You can delete these easily by tapping the Dismiss button. You can also push them to tomorrow by tapping the Push button.","You can paste links to media in a task, such as images or videos, and they will appear in the card. http://i.imgur.com/v2X91VD.jpg","It even works for YouTube videos! https://youtu.be/QQh56geU0X8"';
	}

	if (localStorage.getItem("tomorrowlist") === null) {
		localStorage['tomorrowlist'] = '';
	}

	if (localStorage.getItem("planr") != "2.0") {
		localStorage['planr'] = '2.0';
		$('#update').openModal();
	}

	if (localStorage.getItem("showweather") === null) {
		localStorage['showweather'] = 'true';
	}

	if (localStorage.getItem("showmedia") === null) {
		localStorage['showmedia'] = 'true';
	}

	if (localStorage.getItem("bg") === null) {
		localStorage['bg'] = '';
	}

	if (localStorage.getItem("analytics") === null) {
		localStorage['analytics'] = 'true';
	}

	if (localStorage.getItem("help") === null) {
		localStorage['help'] = 'true';
	}

	if (document.addEventListener && window.localStorage) {
		console.log("Compatible web browser detected.");
	} else {
		$('#warning').openModal();
	}

	// Google Analytics

	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','http://www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-59452245-2', 'auto');
	  ga('send', 'pageview');

	// Set variables

	var todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
	var tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");
	var tempitem = "";
	var temptask = "";

	// Find date

	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var date = d.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;
	if (localStorage.getItem("lastopened") === null || localStorage.getItem("lastopened") === "") {
		localStorage["lastopened"] = date;
	}
	if (localStorage.getItem("lastopened") != date) {
		todaylist = todaylist.concat(tomorrowlist);
		tomorrowlist = JSON.parse("[]");
		localStorage["lastopened"] = date;
	}

	// Reload everything after changes

	function reloadData() {

		var todaytemp = "";
		for (var i = 0; i < todaylist.length; ++i) {
			tempitem = todaylist[i].replace(/"/g, '&quot;');
			todaytemp += '"' + tempitem + '",';
		}
		var tomorrowtemp = "";
		for (var i = 0; i < tomorrowlist.length; ++i) {
			tempitem = tomorrowlist[i].replace(/"/g, '&quot;');
			tomorrowtemp += '"' + tempitem + '",';
		}
		todaytemp = todaytemp.substring(0, todaytemp.length - 1); // Cut off last comma
		tomorrowtemp = tomorrowtemp.substring(0, tomorrowtemp.length - 1); // Cut off last comma
		localStorage["todaylist"] = todaytemp;
		localStorage["tomorrowlist"] = tomorrowtemp;
		var url = new RegExp(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
		// Generate today list
		if($('#todaylist').length > 0) {
			$("#todaylist").empty();
			if (todaylist.length === 0 || todaylist.length === undefined){
				$("#todaylist").append('<div class="card"><div class="card-content"><p><i>Theres nothing here! Add an item by pressing the Add button in the lower-right corner of the screen.</i></p></div></div>');
			} else {
				for (var i = 0; i < todaylist.length; ++i) {
					$("#todaylist").append('<div id="today' + i + '" class="card"><div class="card-content"><div class="task todaytask' + i + '">' + todaylist[i] + '</div><div class="actions actions' + i + '"><a class="waves-effect waves-green btn-flat todaydismiss">Dismiss</a><a class="waves-effect waves-green btn-flat push">Push</a></div></div></div>');
					// Detect links in task
					var result;
					while((result = url.exec(todaylist[i])) !== null) {
						if (localStorage.getItem("showmedia") === "true") {
							if (result[1].match(/https?:\/\/([^\s]+\.[^\s\.]+\.(png|jpg|jpeg|gif))/i)) {
								// Detect image in URL and show it inside card
								$("#today" + i).prepend('<div class="card-image"><img src="' + result[1] + '"></div>');
							} else if (result[1].match(/mp4$/)) {
								// Detect MP4 video in URL and embed HTML5 player
								$("#today" + i).prepend('<div class="card-image"><video controls><source src="' + result[1] + '" type="video/mp4"></video></div>');
							} else if (result[1].match(/ogg$/)) {
								// Detect OGG video in URL and embed HTML5 player
								$("#today" + i).prepend('<div class="card-image"><video controls><source src="' + result[1] + '" type="video/ogg"></video></div>');
							} else if (result[1].match(/webm$/)) {
								// Detect WebM video in URL and embed HTML5 player
								$("#today" + i).prepend('<div class="card-image"><video controls><source src="' + result[1] + '" type="video/webm"></video></div>');
							} else if (result[1].match(/mp3$/)) {
								// Detect MP3 audio in URL and embed HTML5 player
								$("#today" + i).prepend('<div class="card-image"><audio controls><source src="' + result[1] + '" type="audio/mpeg"></audio></div>');
							} else if (result[1].match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) {
								// Detect YouTube video link and embed player
								var videoid = (result[1].match(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) ? RegExp.$1 : false;
								$("#today" + i).prepend('<div class="card-image youtube-embed"><iframe src="https://www.youtube.com/embed/' + videoid + '?modestbranding=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
							} else if (result[1].match(/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/)) {
								// Detect Vimeo video link and embed player
								var videoid = (result[1].match(/vimeo.*\/(\d+)/)) ? RegExp.$1 : false;
								$("#today" + i).prepend('<div class="card-image vimeo-embed"><iframe src="https://player.vimeo.com/video/' + videoid + '?badge=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
							} else if (result[1].match(/vine\.co\/v\/([a-z0-9]+)/i)) {
								// Detect Vine video link and embed player
								var videoid = (result[1].match(/(.*v\s+)(.*)(\s+milk.*)/)) ? RegExp.$1 : false;
								$("#today" + i).prepend('<div class="card-image vine-embed"><iframe src="' + result[1] + '/embed/simple" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>');
							} else if (result[1].indexOf("https://twitter.com/") > -1) {
								$.getScript("http://platform.twitter.com/widgets.js");
								$("#today" + i).prepend('<div class="card-image tweet-container tweet' + i + '" align="center"><blockquote class="twitter-tweet"><a href="' + result[1] + '"><div class="progress"><div class="indeterminate"></div></div></a></blockquote></div>');
							}
						}
					}
				}
			}
		}

		// Generate tomorrow list
		if($('#tomorrowlist').length > 0) {
			$("#tomorrowlist").empty();
			if (tomorrowlist.length === 0 || tomorrowlist.length === undefined){
				$("#tomorrowlist").append('<div class="card"><div class="card-content"><i>This is where your items pushed to tomorrow appear.</i></div></div>');
			} else {
				for (var i = 0; i < tomorrowlist.length; ++i) {
					$( "#tomorrowlist" ).append('<div id="tomorrow' + i + '" class="card"><div class="card-content"><div class="task tomorrowtask' + i + '">' + tomorrowlist[i] + '</div><div class="actions actions' + i + '"><a class="waves-effect waves-green btn-flat tomorrowdismiss">Dismiss</a><a class="waves-effect waves-green btn-flat pull">Pull</a></div></div></div>');
				}
			}
		}

		// Reload variables from updated localStorage sources
		todaylist = JSON.parse("[" + localStorage["todaylist"] + "]");
		tomorrowlist = JSON.parse("[" + localStorage["tomorrowlist"] + "]");

		// Make links clickable
		$('#content').linkify({});
		$("#content a").attr("target","_blank");
	}

	reloadData();

	// Read values of settings from localStorage

	$("#showmedia").prop('checked', JSON.parse(localStorage['showmedia']));

	// Actions for menu items

	$(".settings-trigger").click(function() {
		if (localStorage.getItem("help") === "true") {
			$('#settings').prepend('<div class="card helpcard"><div class="card-content">Look in the side menu (or the top menu on larger screens) to save these settings. Tap this card to hide this message.</div></div>');
			$(document).on("click",".helpcard", function () {
				$('.helpcard').fadeOut( 300, function() {});
				localStorage['help'] = 'false';
			});
		}
		$('.add-btn').fadeOut( 300, function() {});
		$('#content').fadeOut( 300, function() {
			$('.settings-trigger').html('<i class="mdi-content-save left"></i> Save settings');
			$('#settings').fadeIn( 300, function() {});
		});
		$(".settings-trigger").click(function() {
			if ($('#showweather').is(':checked')) {
				localStorage['showweather'] = "true";
			} else {
				localStorage['showweather'] = "false";
			}
			localStorage['location'] = $("#location").val();
			localStorage['unit'] = $("#unit").val();
			if ($('#showmedia').is(':checked')) {
				localStorage['showmedia'] = "true";
			} else {
				localStorage['showmedia'] = "false";
			}
			if ($('#analytics').is(':checked')) {
				localStorage['analytics'] = "true";
			} else {
				localStorage['analytics'] = "false";
			}
			window.location.replace('index.html');
			});
	});

	$(".import-trigger").click(function() {
		$('#import').openModal();
	});

	$(".export-trigger").click(function() {
		$('#export').openModal();
	});

	$(".transfer-trigger").click(function() {
		$('#transfer').openModal();
	});

	$(document).on('click', ".transfer-help-trigger", function() {
		$("#transfer-help").fadeIn( 500, function() {});
	});

	$(".reset-trigger").click(function() {
		$('#reset').openModal();
	});

	$(".new-trigger").click(function() {
		$('#new').openModal();
		$('#task').focus();
	});

	// Settings items

	$('.location-item').click(function() {
		$('#locationmodal').openModal();
		$("#location").select();
	});

	$('.units-item').click(function() {
		$('#unitsmodal').openModal();
		$("#unit").select();
	});

	$('.privacy-item').click(function() {
		$('#privacymodal').openModal();
	});

	$('.twitterlink').click(function() {
		window.open("https://twitter.com/PlanrApp", "_blank");
	});

	$('.googlelink').click(function() {
		window.open("https://plus.google.com/114345563365880139237", "_blank");
	});

	$('.githublink').click(function() {
		window.open("https://github.com/corbindavenport/planr", "_blank");
	});

	$('.paypal').click(function() {
		$('#paypalmodal').openModal();
	});

	$('.bitcoin').click(function() {
		$('#bitcoinmodal').openModal();
	});

	// Data functions

	$(document).on('click', ".export-confirm", function() {
		var format = $('input[name=format]:checked').attr('id');
		$("#export").html('<div class="modal-content"><div class="progress"><div class="indeterminate"></div></div><p>Exporting ' + format + ' file...</p></div><div class="modal-footer"></div>');
		if (format === "txt") {
			var txt = ("Planr data exported at " + localStorage['lastopened'] + ":\n\nToday tasks: " + todaylist.toString() + "\n\nTomorrow tasks:" + tomorrowlist.toString());
			var blob = new Blob([txt], {type: "text/plain;charset=utf-8"});
			$("#export").html('<div class="modal-content">Your plain text file has been successfully exported! You can now download the file to your device.</div><div class="modal-footer"><a href="#" class="waves-effect btn-flat download-trigger">Download</a><a href="#" class="waves-effect btn-flat export-close">Close</a></div>');
			$(document).on('click', ".download-trigger", function() {
				Materialize.toast('Downloading!', 3000, 'rounded');
				saveAs(blob, "planr-data.txt");
				$('#export').closeModal();
			});
		} else if (format === "html") {
			var url = new RegExp(/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim);
			var todaytemp = "";
			for (var i = 0; i < todaylist.length; ++i) {
				todaytemp += '"' + todaylist[i] + '",';
			}
			var tomorrowtemp = "";
			for (var i = 0; i < tomorrowlist.length; ++i) {
				tomorrowtemp += '"' + tomorrowlist[i] + '",';
			}
			var txt = ('<html><head><meta http-equiv="content-type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"><title>Planr Data</title></head><body><p><b>Planr data exported at ' + localStorage['lastopened'] + '</b></p></p><u>Today tasks:</u></p><ul>');
			if (todaylist.length === 0) {
				txt += ('<li>No tasks for today</li>');
			} else {
				for (var i = 0; i < todaylist.length; ++i) {
					txt += ('<li>' + todaylist[i]);
					while((result = url.exec(todaylist[i])) !== null) {
						txt += (' <a href="' + result[1] + '" target="_blank">[Open Link]</a>');
					}
					txt += ('</li>');
				}
			}
			txt += ('</ul><p><u>Tomorrow tasks:</u></p><ul>');
			if (tomorrowlist.length === 0) {
				txt += ('<li>No tasks for tomorow</li>');
			} else {
				for (var i = 0; i < tomorrowlist.length; ++i) {
					txt += ('<li>' + tomorrowlist[i]);
					while((result = url.exec(tomorrowlist[i])) !== null) {
						txt += (' <a href="' + result[1] + '" target="_blank">[Open Link]</a>');
					}
					txt += ('</li>');
				}
			}
			txt += ('</ul></body></html>');
			var blob = new Blob([txt], {type: "text/html;charset=utf-8"});
			$("#export").html('<div class="modal-content">Your HTML file has been successfully exported! You can now download the file to your device.</div><div class="modal-footer"><a href="#" class="waves-effect btn-flat download-trigger">Download</a><a href="#" class="waves-effect btn-flat export-close">Close</a></div>');
			$(document).on('click', ".download-trigger", function() {
				Materialize.toast('Downloading!', 3000, 'rounded');
				saveAs(blob, "planr-data.html");
				$('#export').closeModal();
			});
		} else if (format === "csv") {
			var txt = ('"Planr data exported at ' + localStorage['lastopened'] + '"\n"Today tasks:",');
			if (todaylist.length === 0) {
				txt += ('No tasks');
			} else {
				for (var i = 0; i < todaylist.length; ++i) {
					txt += '"' + todaylist[i] + '",';
				}
			}
			txt += ('\n"Tomorrow tasks:",');
			if (tomorrowlist.length === 0) {
				txt += ('No tasks');
			} else {
				for (var i = 0; i < tomorrowlist.length; ++i) {
					txt += '"' + tomorrowlist[i] + '",';
				}
			}
			var blob = new Blob([txt], {type: "text/csv;charset=utf-8"});
			$("#export").html('<div class="modal-content">Your CSV file has been successfully exported! You can now download the file to your device.</div><div class="modal-footer"><a href="#" class="waves-effect btn-flat download-trigger">Download</a><a href="#" class="waves-effect btn-flat export-close">Close</a></div>');
			$(document).on('click', ".download-trigger", function() {
				Materialize.toast('Downloading!', 3000, 'rounded');
				saveAs(blob, "planr-data.csv");
				$('#export').closeModal();
			});
		} else if (format === "plnr") {
			var txt = "1\n" // PLNR file standard 1.0
			var todaytemp = "";
			for (var i = 0; i < todaylist.length; ++i) {
				tempitem = todaylist[i].replace(/"/g, '&quot;');
				todaytemp += '"' + tempitem + '",';
			}
			var tomorrowtemp = "";
			for (var i = 0; i < tomorrowlist.length; ++i) {
				tempitem = todaylist[i].replace(/"/g, '&quot;');
				tomorrowtemp += '"' + tempitem + '",';
			}
			todaytemp = todaytemp.substring(0, todaytemp.length - 1); // Cut off last comma
			tomorrowtemp = tomorrowtemp.substring(0, tomorrowtemp.length - 1); // Cut off last comma
			txt += todaytemp + "\n" + tomorrowtemp;
			var blob = new Blob([txt], {type: "text/planr;charset=utf-8"});
			$("#export").html('<div class="modal-content">Your Planr data has been successfully exported! You can now download the file to your device.<br /><br />Planr data files can be imported into any Planr app on any device from the Import data menu.</div><div class="modal-footer"><a href="#" class="waves-effect btn-flat download-trigger">Download</a><a href="#" class="waves-effect btn-flat export-close">Close</a></div>');
			$(document).on('click', ".download-trigger", function() {
				Materialize.toast('Downloading!', 3000, 'rounded');
				saveAs(blob, "planr-data.plnr");
				$('#export').closeModal();
			});
		} else {
			Materialize.toast('No format selected!', 3000, 'rounded');
		}
		$(document).on('click', ".export-close", function() {
			$('#export').closeModal();
		});
	});

	document.getElementById('importchooser').onchange = function(){
		var file = this.files[0];
		var reader = new FileReader();
		var format = file.name.split('.').pop().toLowerCase();
		$("#import").html('<div class="modal-content"><div class="progress"><div class="indeterminate"></div></div><p>Importing file...</p></div><div class="modal-footer"></div>');
		reader.onload = function(progressEvent){
			var content = this.result.replace(/(?:\r\n|\r|\n)/g, '<br />');
			var lines = this.result.split('\n');
			if (format === "plnr") {
				if (lines[0] === "1") { // Check for version 1 of planr data file
					todaylist = JSON.parse("[" + lines[1] + "]");
					tomorrowlist = JSON.parse("[" + lines[2] + "]");
					reloadData();
					$("#import").html('<div class="modal-content"><h4>Import Complete</h4><p>Import from Planr data file complete! You can now close this window.</p></div><div class="modal-footer"><a href="#" class="waves-effect btn-flat import-close">Close</a></div>');
					$(document).on('click', ".import-close", function() {
						$('#import').closeModal();
					});
				} else {
					$("#import").html('<div class="modal-content"><h4>Error</h4><p>The file selected was not a valid Planr data file. The contents of the file can be seen below:</p><p style="border:1px solid 757575; background:#EEEEEE; padding: 10px; width:100%; font-family: Courier, monospace;">' + content + '</p></div><div class="modal-footer"><a href="#" class="waves-effect btn-flat import-close">Close</a></div>');
					$(document).on('click', ".import-close", function() {
						$('#import').closeModal();
					});
				}
			} else {
				$("#import").html('<div class="modal-content"><h4>Error</h4><p>The file selected was not a reconized file. Imported files must be in Planr data file format (.plnr). The contents of the file can be seen below:</p><p style="border:1px solid 757575; background:#EEEEEE; padding: 10px; width:100%; font-family: Courier, monospace;">' + content + '</p></div><div class="modal-footer"><a href="#" class="waves-effect btn-flat import-close">Close</a></div>');
				$(document).on('click', ".import-close", function() {
					$('#import').closeModal();
				});
			}
		};
		reader.readAsText(file);
	};

	// Actions for reset button

	$(".reset-confirm").click(function() {
		localStorage['location'] = '';
		localStorage["todaylist"] = '"This is a sample list item. You can delete these easily by tapping the Dismiss button. You can also push them to tomorrow by tapping the Push button.","You can paste links to media in a task, such as images or videos, and they will appear in the card. http://i.imgur.com/v2X91VD.jpg","It even works for YouTube videos! https://youtu.be/QQh56geU0X8"';
		localStorage['tomorrowlist'] = '';
		localStorage['showmedia'] = 'true';
		localStorage['analytics'] = 'true';
		localStorage['help'] = 'true';
		window.location.replace('index.html');
	});

	// Action for dismiss buttons

	$(document).on('click', ".todaydismiss", function() {
		var item = $(this).parent().parent().parent().attr('id').replace('today','');
		todaylist.splice(item,1);
		tempitem = $(this).parent().parent().parent().attr('id').replace('today','');
		temptask = $( ".todaytask" + item ).text();
		$( "#today" + item ).fadeOut( 500, function() {
			reloadData();
			Materialize.toast('<span>Task dismissed</span> <a class="btn-flat yellow-text today-undo-dismiss" href="#">Undo<a>', 3000, 'rounded');
		});
	});

	$(document).on('click', ".tomorrowdismiss", function() {
		var item = $(this).parent().parent().parent().attr('id').replace('tomorrow','');
		tomorrowlist.splice(item,1);
		tempitem = $(this).parent().parent().parent().attr('id').replace('tomorrow','');
		temptask = $( ".tomorrowtask" + item ).text();
		$( "#tomorrow" + item ).fadeOut( 500, function() {
			reloadData();
			Materialize.toast('<span>Task dismissed</span> <a class="btn-flat yellow-text tomorrow-undo-dismiss" href="#">Undo<a>', 3000, 'rounded');
		});
	});

	// Action for undo dismiss

	$(document).on('click', ".today-undo-dismiss", function() {
		todaylist.unshift(temptask);
		reloadData();
	});

	$(document).on('click', ".tomorrow-undo-dismiss", function() {
		tomorrowlist.unshift(temptask);
		reloadData();
	});

	// Actions for push/pull buttons

	$(document).on('click', ".push", function() {
		var item = $(this).parent().parent().parent().attr('id').replace('today','');
		var task = $( ".todaytask" + item ).text();
		tempitem = $(this).parent().parent().parent().attr('id').replace('today','');
		temptask = $( ".todaytask" + item ).text();
		todaylist.splice(item,1); // Remove item from today list
		tomorrowlist.unshift(task); // Add item to tomorrow list
		$( "#today" + item ).fadeOut( 500, function() {
			reloadData();
			Materialize.toast('Task pushed.', 3000, 'rounded');
		});
	});

	$(document).on('click', ".pull", function() {
		var item = $(this).parent().parent().parent().attr('id').replace('tomorrow','');
		var task = $( ".tomorrowtask" + item ).text();
		tempitem = $(this).parent().parent().parent().attr('id').replace('tomorrow','');
		temptask = $( ".tomorrowtask" + item ).text();
		tomorrowlist.splice(item,1); // Remove item from tomorrow list
		todaylist.unshift(task); // Add item to today list
		$( "#tomorrow" + item ).fadeOut( 500, function() {
			reloadData();
			Materialize.toast('Task pulled.', 3000, 'rounded');
		});
	});

	// Actions for adding new task

	$(document).on('click', ".add-task", function() {
		if(document.getElementById("task").value == 0) {
			Materialize.toast('Enter a task', 3000, 'rounded');
		} else {
			var task = document.getElementById("task").value;
			if ($('#new-toggle').is(':checked')) {
				// Add item to tomorrow list
				tomorrowlist.unshift(task);
				// Reset checkbox
				$("#new-toggle").prop('checked', false);
			} else {
				// Add item to today list
				todaylist.unshift(task);
			}
			reloadData();
			document.getElementById("task").value = "";
			$('#new').closeModal();
			Materialize.toast('Task added.', 3000, 'rounded');
		}
	});

});

// Display everything

$(window).load(function() {
	$(".button-collapse").sideNav({closeOnClick: true});
	$(".dropdown-button").dropdown();
	$('.preloader-wrapper').fadeOut( "slow", function() {});
	$('.nav-wrapper').fadeIn( "slow", function() {});
	$('#content').fadeIn( "slow", function() {});
});
