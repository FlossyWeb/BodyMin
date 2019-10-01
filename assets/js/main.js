var globals, isMobile=false, 
App = {

	settings: {
		bottomScrolled: false,
		serverAddress: "https://sns-gs.com/bodyminute/db.php",
		year: (new Date).getFullYear(),
		id: $.localStorage.getItem('id'),
		nom: $.localStorage.getItem('nom'),
		tel: $.localStorage.getItem('tel'),
	},
//var greenIcon = new LeafIcon({iconUrl: 'assets/img/leaflet/marker-icon-2x-green.png'}), redIcon = new LeafIcon({iconUrl: 'assets/img/leaflet/marker-icon-2x-red.png'}), orangeIcon = new LeafIcon({iconUrl: 'assets/img/leaflet/marker-icon-2x-orange.png'});
	refreshGlobals: function(data) {
		globals.id = data.id;
		globals.nom = data.nom;
		globals.tel = data.tel;
	},

	init: function() {
		// kick things off
		globals = this.settings;
		if(document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1 && document.URL.indexOf("localhost") != 7) {
			isApp = true;
			App.bindUIActions();
			// PhoneGap application
			// Attendre que PhoneGap soit prêt	    //
			document.addEventListener("deviceready", App.onDeviceReady, false);
		}
		else {
			isApp = false;
			App.bindUIActions();
		}
	},

	onDeviceReady: function() {
		// PhoneGap est prêt
		//document.addEventListener("backbutton", App.onBackKeyDown, false);
		//document.addEventListener("resume", App.onResume, false);
		//document.addEventListener("menubutton", App.onMenuKeyDown, false);
		//document.addEventListener("pause", App.onPause, false);
		StatusBar.overlaysWebView(false);
		StatusBar.backgroundColorByHexString("#FFF");
		// prevent device from sleeping
		window.powermanagement.acquire();
		/*
		if((navigator.network.connection.type == Connection.NONE) || !window.jQuery){
			//$("body").empty().append('<img src="no_network.png" width="'+screen.width+'" height="'+screen.height+'" onClick="window.location.reload()" />');
			navigator.notification.alert('Cette application a besoin d\'une connexion internet afin de mieux fonctionner', App.alertDismissed, 'BoursoConvois', 'OK');
		}
		*/
		//App.getLocation();
		openPdf = cordova.plugins.disusered.open;
		/*
		// For Android => Enable background mode
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.setDefaults({
			title:  'App toujours en fonction (3 MINUTES MAX)',
			ticker: 'App toujours en fonction (3 MINUTES MAX)',
			text:   'Nous vous informons des courses en cours...'
		});
		//cordova.plugins.backgroundMode.configure({
		//	title:'App toujours en fonction (3 MINUTES MAX), nous vous informons des courses en cours...'
		//});
		*/
		// For iOS => backgroundtask
		//backgroundtask.start(bgFunctionToRun);
		// Efficient and batterie saving geolocation...
		/* USING Plugin V3.X */
		// BackgroundGeolocation is highly configurable. See platform specific configuration options 
		/*
		BackgroundGeolocation.configure({
			locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER, // ACTIVITY_PROVIDER, DISTANCE_FILTER_PROVIDER OR RAW_PROVIDER
			desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
			stationaryRadius: 1000,
			distanceFilter: 1000,
			activityType: 'AutomotiveNavigation',
			debug: false,
			interval: 60000,
			fastestInterval: 30000,
			activitiesInterval: 60000,
			saveBatteryOnBackground : false,
			stopOnStillActivity : false,
			stopOnTerminate : false,
			startForeground: true,
			notificationTitle: 'BoursoConvois',
			notificationText: 'Suivi de votre position',
			notificationIconColor: '#FEDD1E'
		});
		BackgroundGeolocation.on('location', function(location) {
			// handle your locations here
			// to perform long running operation on iOS
			// you need to create background task
			lat = location.latitude;
			lng = location.longitude;
			BackgroundGeolocation.startTask(function(taskKey) {
				// execute long running task
				// eg. ajax post location
				//$("#returnsGeoloc").append("geoloc launch:"+lat+", "+lng);
				$.post(globals.serverAddress, {id: globals.id, lead: globals.lead, pwd: globals.pwd, lat: lat, lng: lng, req: 'updateGeolocation'}, function(data){
				}, "json");
				// IMPORTANT: task has to be ended by endTask
				BackgroundGeolocation.endTask(taskKey);
			});
		});
		BackgroundGeolocation.on('background', function() {
			// you can also reconfigure service (changes will be applied immediately)
			BackgroundGeolocation.configure({ locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER });
		});
		BackgroundGeolocation.on('foreground', function() {
			BackgroundGeolocation.configure({ locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER });
		});
		BackgroundGeolocation.on('stationary', function(stationaryLocation) {
			// handle stationary locations here
		});
		BackgroundGeolocation.on('error', function(error) {
			console.log('[ERROR] BackgroundGeolocation error:', error.code, error.message);
		});
		BackgroundGeolocation.on('start', function() {
			console.log('[INFO] BackgroundGeolocation service has been started');
		});
		BackgroundGeolocation.on('stop', function() {
			console.log('[INFO] BackgroundGeolocation service has been stopped');
		});
		BackgroundGeolocation.on('abort_requested', function() {
			console.log('[INFO] Server responded with 285 Updates Not Required');
			// Here we can decide whether we want stop the updates or not.
			// If you've configured the server to return 285, then it means the server does not require further update.
			// So the normal thing to do here would be to `BackgroundGeolocation.stop()`.
			// But you might be counting on it to receive location updates in the UI, so you could just reconfigure and set `url` to null.
		});
		BackgroundGeolocation.on('http_authorization', () => {
			console.log('[INFO] App needs to authorize the http requests');
		});
		BackgroundGeolocation.on('error', function(error) {
			//if(isApp) navigator.notification.alert('BackgroundGeolocation error', App.alertDismissed, 'BoursoConvois', 'OK');
			//else alert('BackgroundGeolocation error');
			navigator.notification.confirm('Erreur de Géolocalisation, voulez-vous aller dans les réglages afin d\'activer le service de géolocalisation pour cette app ?', 'BoursoConvois', function() {
				BackgroundGeolocation.showAppSettings();
			});
		});
		BackgroundGeolocation.on('authorization', function(status) {
			if (status !== BackgroundGeolocation.AUTHORIZED) {
				// we need to set delay or otherwise alert may not be shown
				setTimeout(function() {
					navigator.notification.confirm('Erreur de Géolocalisation, voulez-vous aller dans les réglages afin d\'activer le service de géolocalisation pour cette app ?', 'BoursoConvois', function() {
						BackgroundGeolocation.showAppSettings();
					});
				}, 1000);
			}
		});
		// Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
		BackgroundGeolocation.start();
		*/
	},
	
	alertDismissed: function() {
		// Do nothing !
	},
	/*
	bgFunctionToRun: function() {
		if(hail_id!="") check_answer_open();
		if(idcourse!="") check_answer();
	},
	// GESTION DES BOUTONS MATERIEL
	// Bouton retour
	onBackKeyDown: function() {
		navigator.notification.alert("Veuillez ne pas quitter BoursoConvois pendant la recheche de taxi disponibles", App.alertDismissed, 'BoursoConvois', 'OK');
	},
	onResume: function() {
		setTimeout(function() {
			if((navigator.network.connection.type == Connection.NONE) || !window.jQuery){
				$("body").empty().append('<img src="no_network.png" width="'+screen.width+'" height="'+screen.height+'" onClick="window.location.reload()" />');
			}
		}, 500);// iOS Quirks
	},
	// Bouton menu
	onMenuKeyDown: function() {
		// Do something
	},
	// Escaping...
	onPause: function() {
		if(idcourse!='') {
			stopCall();
			navigator.notification.alert("SI VOUS AVIEZ UNE COMMANDE EN COURS ELLE A ETE ANNULEE ! (CELA NE S'APPLIQUE PAS AUX RESERVATIONS)");
		}
	},
	*/
	changePage: function(pageToShow, previousPage) {
		if(pageToShow != previousPage) {
			$('.fullpage').not('#'+pageToShow).fadeOut();
			$('#'+pageToShow).fadeIn();
		}
		// Modifying return link...
		$('#returnLink').attr('onclick', '').attr('onclick', 'App.changePage(\''+previousPage+'\', \''+pageToShow+'\')');
	},

	openSomeUrl: function(url) {
		window.open(url,'_blank','location=false,enableViewportScale=yes,scrollbars=yes,closebuttoncaption=Fermer');
	},

	scanSuccess: function (result) {
		var textFormats = "QR_CODE DATA_MATRIX";
		var productFormats = "UPC_E UPC_A EAN_8 EAN_13";
		if (result.cancelled) { return; }
		if (textFormats.match(result.format)) {                
			let scanVal = result.text;
			$('#code_ean').val(scanVal);
			/*
			if (scanVal.indexOf("http") === 0) {
				setTimeout(function() { 
					//window.plugins.childBrowser.showWebPage(result.text, { showLocationBar: true }); 
					window.open(result.text,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer');
				}, 500);
			} else {
				navigator.notification.alert(
						result.text,
						function (){},
						'Valeur du scan:',
						'OK'
					);
			}
			*/
		} else if (productFormats.match(result.format)) {
			let scanVal = result.text;
			$('#code_ean').val(scanVal);
			/*
			var searchUrl = "https://www.google.fr/#q=" + result.text;
			setTimeout(function() { window.open(searchUrl,'_blank','location=yes,enableViewportScale=yes,closebuttoncaption=Fermer'); }, 500);
			*/
		} else { 
			let scanVal = result.text;
			$('#code_ean').val(scanVal);
			//navigator.notification.alert("Format du scan: " + result.format + " NON SUPPORTE. Valeur du scan: " + result.text, alertDismissed, 'Inventaire BodyMinute Erreur', 'OK');
		}
	},
	
	goScan : function () {
		const options = {
			"preferFrontCamera" : true, // iOS and Android
			"showFlipCameraButton" : true, // iOS and Android
			//"formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
			//"orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
			"prompt" : "Placer le code barre dans la zone de scan" // supported on Android only
		}
		cordova.plugins.barcodeScanner.scan(
			App.scanSuccess, 
			function (error) {
				navigator.notification.alert("Scan Erreur: " + error, alertDismissed, 'Inventaire BodyMinute Erreur', 'OK');
			},
			options
		);
	},
	
	subContact: function (myFormDiv) {
		$(myFormDiv+' #sender').attr("disabled", true);
		var query = $(myFormDiv).serialize();
		const op = "contact";
		query = query + "&op=" + op;
		var returns = "";
		$(myFormDiv+' #successfail').append('<div class="alert alert-success" role="alert"><b>Query : '+query+'</b></div>');
		$.post(serverAddress, query, function(data){
			if(data.ok=="ok")
				returns = '<div class="alert alert-success" role="alert"><b>Votre message a bien été envoyé.</b></div>'
			else
				returns = '<div class="alert alert-danger" role="alert"><b>Votre message n\'a pas été envoyé.</b></div>'
			$(myFormDiv+' #sender').attr("disabled", false);
			$(myFormDiv+' #successfail').empty().append(returns);
		}, "json");
	},
	
	subManagement: function (myFormDiv) {
		$(myFormDiv+' #sender').attr("disabled", true);
		let query = $(myFormDiv).serialize();
		const op = "inventory_set";
		query = query + "&op=" + op;
		var returns = "";
		var myModalId = "";
		//$(myFormDiv+' #successfail').append('<div class="alert alert-success" role="alert"><b>Query : '+query+'</b></div>');
		$.post(globals.serverAddress, query, function(data){
			if(data.ok=="ok") {
				returns = '<div class="alert alert-success" role="alert"><b>Nous avons procédé au traitement de vos réponses avec succès.</b></div>';
				alert("Nous avons procédé au traitement de vos réponses avec succès.");
			}
			else {
				returns = '<div class="alert alert-danger" role="alert"><b>Nous n\'avons pas pu procédé au traitement de vos réponses suite à un problème technique.</b></div>';
				alert("Nous n'avons pas pu procédé au traitement de vos réponses suite à un problème technique.");
			}
		}, "json").always(function(data){
			$(myFormDiv+' #sender').attr("disabled", false);
			$(myFormDiv+' #successfail').empty().append(returns);
		});
	},
	
	addWasValidatedClass: function (myFormDiv) {
		$(myFormDiv).addClass('was-validated');
	},
		
	clearFormFields: function(myFormDiv)
	{
		$(myFormDiv).find("input[type=text], input[type=tel], input[type=email], input[type=number], textarea, select, checkbox").val("");
	},
	
	safeJsonParse: function(input) {
		try {
			return JSON.parse(input);
		} catch (e) {
			return undefined;
		}
	},
	
	urlParam: function(name, url){
		// Get parameters from an URL
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
		//For current URL
		//var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		if (results==null){
		   return null;
		}
		else{
		   return results[1] || 0;
		}
	},
		
	bindUIActions: function() {
		// Is it Mobile device
		if(/Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent)) isMobile = true;
		if(isMobile) {
		}
		$("[data-toggle=tooltip]").tooltip();
		$("#now-date").append(globals.year);
		$('.hideMe').hide('fast');
		$('.expends').click(function () {
			$(this).next('div').slideToggle('slow');
			//$.mobile.silentScroll($(this).next('div').offset().top);
		});
		$('section, hr, .modal').click(function () {
			if(window.innerWidth < 991) {
				$('.navbar').slideToggle("slow");
				$('#navbar-collapse').removeClass('show');
				//alert(window.innerWidth);
			}
		});
		$('.nav-item').click(function () {
			if(window.innerWidth < 768) {
				//$('.navbar').slideToggle("slow");
				$('#navbar-collapse').removeClass('show');
				//alert(window.innerWidth);
			}
		});
		document.addEventListener("scroll", function (event) {
			if (App.getDocHeight() == App.getScrollXY()[1] + window.innerHeight) {
				//$('.go-up-fixed').fadeOut('slow');
				globals.bottomScrolled=true;
			}
			else {
				globals.bottomScrolled=false;
				if(App.getScrollXY()[1] == 0) {
					$('.navbar').slideDown("slow");
					$('#navbar-collapse').removeClass('show');
					$('.go-up-fixed').fadeOut('slow');
				}
				else
					$('.go-up-fixed').fadeIn('slow');
			}
		});
	},
	
	//below taken from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
	getScrollXY: function () {
		var scrOfX = 0, scrOfY = 0;
		if( typeof( window.pageYOffset ) == 'number' ) {
			//Netscape compliant
			scrOfY = window.pageYOffset;
			scrOfX = window.pageXOffset;
		} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
			//DOM compliant
			scrOfY = document.body.scrollTop;
			scrOfX = document.body.scrollLeft;
		} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
			//IE6 standards compliant mode
			scrOfY = document.documentElement.scrollTop;
			scrOfX = document.documentElement.scrollLeft;
		}
		return [ scrOfX, scrOfY ];
	},

	//taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
	getDocHeight: function () {
		var D = document;
		return Math.max(
			D.body.scrollHeight, D.documentElement.scrollHeight,
			D.body.offsetHeight, D.documentElement.offsetHeight,
			D.body.clientHeight, D.documentElement.clientHeight
		);
	}
};

(function() {
	
	App.init();
	
})();