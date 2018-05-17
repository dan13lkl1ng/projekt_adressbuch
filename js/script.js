/** Klasse für mehrmals vorkommende Konstrukte
 *
 * @author DK
 **/
class Helpers {

    /**
     * Liefert Kontaktdetails abhängig des ID, unabhängig der Position oder des Formats der ID.
     *
     * @author DK
     * @return {Object}   Objekt, welches die Kontaktdetails der markierten Person erhält
     */
    static contactDetailsById() {
        return contacts.find(function(elem) {
            return elem.cid == contactID;
        });
    }

    static valuesToDform(elem) {
        elem.firstname.value = contacts[contactID].firstname;
        elem.lastname.value = contacts[contactID].lastname;
        elem.street.value = contacts[contactID].street;
        elem.zip.value = contacts[contactID].zip;
        elem.city.value = contacts[contactID].city;
        elem.email.value = contacts[contactID].email;
        elem.phone.value = contacts[contactID].phone;
        elem.birthday.value = getDateString(contacts[contactID].birthday);
    }
}

class Person {
    constructor(firstname, lastname, email, phone, birthday, zip, city, street) {
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._phone = phone;
        this._birthday = birthday;
        this._zip = zip;
        this._city = city;
        this._street = street;
    }
}

class MySelf extends Person {
    constructor(firstname, lastname, email, phone, birthday, zip, city, street, favouriteColor) {
        super(firstname, lastname, email, phone, birthday, zip, city, street);
        this._favouriteColor = favouriteColor;


    }


}

var me = new MySelf('Max', 'Mustermann', 'max@mustermann.de', '0123456789', '01.10.1980', '76131', 'Karlsruhe', 'Bahnhofsstraße 1', 'yellow');

// Hinzugefügt am 15.05.18 - SJ
var userMessage;

// Globales Array für die Kontaktliste
var contacts = [];

// Globale Variable für die ID der Kontaktliste - hinzugefügt am 14.05.2018, SR
var contactID = 0;

// Globale Variable für das Objekt der Kontaktliste (List.js) - geändert am 15.05.2018, SR
var contactlist;

// Globales Personendetails-Array
var person_arr = new Array('firstname', 'lastname', 'email', 'phone', 'birthday', 'zip', 'city', 'street');

/**
 * Optionen für Kontaktliste werden festgelegt.
 *
 * @author DK
 */
var options = {
    valueNames: ['cid', 'firstname', 'lastname', 'email']
    , item: '<li class="collection-item" onclick="getContactId(event)"><span class="title cid"></span><span class="lastname"></span>, <span class="firstname"></span><br /><span class="email"></span></li>'
};

function refreshList() {
    contactlist.clear();
    contactlist = new List('contactlist', options, contacts);
    contactlist.sort('lastname', {
        order: "asc"
    });
}

function resetSearch() {
    // reset search field
    var searchfield = $(".search");
    searchfield[0].value = "";
}

// Verschoben: 16.05.18 - SJ
/* Datum in String umwandeln -> DD.MM.YYYY
 *
 * @return {string} 
 * @author SR
 */
function getDateString(date) {
    let dateStr = "";

    if (typeof date == "object") {

        if (date.__proto__.constructor.name == "Date") {
            let dayStr = "00" + date.getDate();
            let monthStr = "00" + (date.getMonth() + 1);
            let year = String(date.getFullYear());

            dateStr = dayStr.substr(-2) + "." + monthStr.substr(-2) + "." + year;
        }
    }
    return dateStr;
}

// Callback function to bring a hidden box back
function callbackbox() {
    setTimeout(function() {
        addressOut();
        $("#addressfield").fadeIn();
    }, 250);
};

// toggle address details
var toggleAddrDetails = false;

/**
 * ID/cid des angeglickten Kontakts wird ausgegeben.
 *
 * @param: {Object} event - das Event des engeklickten Listeneintrags
 * @author: DK
 * @author: Sandra
 *
 * @changes: Stefan at 17.05.2018 - Animation effect
 */
function getContactId(event) {
    var cid = contactID = event.currentTarget.firstChild.innerHTML;

    //contactID = parseInt(event.currentTarget.firstChild.innerHTML);

    // Overlay ausblenden
    document.getElementById("overlay").style.display = "none";

    // document.getElementById("overlay").style.display="block";

    if (toggleAddrDetails) {
        // hide address details
        $("#addressfield").hide("drop", {}, 250, callbackbox);

        // toggleAddrDetails = false;
    } else {
        addressOut();
        // show address details
        $("#addressfield").show("drop", {}, 250);

        toggleAddrDetails = true;
    }
}

/**
 * @author Sandra
 * @author DK (Suchfunktion)
 */
function addressOut() {

    var fullAddress = contacts[contactID];

    // Findet Adresse mittels cid. 20180515 DK, OOP 20180516 DK
    //var fullAddress = Helpers.contactDetailsById();

    // verhindert weitere Referenzierung, falls Kontakt nicht mehr vorhanden. 20180516 DK
    if (fullAddress != undefined) {

        document.getElementById("addrFirstname")
            .innerHTML = fullAddress.firstname;
        document.getElementById("addrLastname")
            .innerHTML = fullAddress.lastname;
        document.getElementById("addrStreet")
            .innerHTML = fullAddress.street;
        document.getElementById("addrZip")
            .innerHTML = fullAddress.zip;
        document.getElementById("addrCity")
            .innerHTML = fullAddress.city;
        document.getElementById("addrEmail")
            .innerHTML = fullAddress.email;
        document.getElementById("addrPhone")
            .innerHTML = fullAddress.phone;
        document.getElementById("addrBirthday")
            .innerHTML = getDateString(fullAddress.birthday);

    }
}

/** 
 * Kontaktliste nach String konvertieren und an den Server (PHP) schicken.
 *
 * @author SR
 * @author DK (swal)
 */
function sendContactDataToServer() {

    let prepared = JSON.stringify(contacts);
    prepared = "{\"contacts\":" + prepared + "}";

    $.post("server.php", {
            neuedaten: prepared
        })
        .done(function(data) {
            swal({
                title: "Done"
                , text: "Erfolgreich übermittelt"
                , type: "success"
            , });
        }).fail(function(data) {
            swal({
                title: "Oooops"
                , text: "Übermittlung schiefgelaufen"
                , type: "error"
            , });
        });
}


/* Aus Datum-String ein Datum-Objekt erstellen
 *
 * @return {date object} 
 * @author SR
 */
function createDate(dateString) {
    var bits = dateString.split('.');
    var date = new Date(bits[2], bits[1] - 1, bits[0]);
    return date;
}

/* *************************** Document ready **************************** */

$(function() {

    swal({
        title: 'Bitte <i>Lieblingsfarbe</i> wählen'
        , type: 'info'
        , html: '<div id="red"></div>' +
            '<div id="green"></div>' +
            '<div id="blue"></div>' +
            '<div id="swatch" class="ui-widget-content ui-corner-all"></div>'
        , showCloseButton: true
        , showCancelButton: false
        , focusConfirm: false
        , confirmButtonText: '<i class="fa fa-thumbs-up"></i> Ok!'
        , confirmButtonAriaLabel: 'Thumbs up, great!'
    , }).then(() => {
        $('body').css("background-color", me._favouriteColor);
    });

    /**  
     * Objekt mit Kontaktdaten im JSON-Format, welche mittels Ajax-Funktion importiert werden. 
     *
     * @author SR 
     * @author DK
     **/
    $.getJSON("./database.json", function(data) {
        contacts = data.contacts;

        for (var i = 0; i < contacts.length; i++) {
            let bday = contacts[i].birthday

            if (bday != "") {
                contacts[i].birthday = new Date(bday);
            }

            contacts[i].cid = i;
        }

        /** Sortiert alphabetisch nach Nachnamen und gibt an das gleiche Objekt zurück.  */

        /** Listeninstanz wird angelegt.  */
        contactlist = new List('contactlist', options, contacts);

        contactlist.sort('lastname', {
            order: "asc"
        });
    });


    /* ************* START STEFAN **************************/

    // prüfen auf gültiges Datum -> d.m.y
    function isValidDate(o, n) {
        var bits = o.val()
            .split('.');
        var d = new Date(bits[2], bits[1] - 1, bits[0]);

        if (d && (d.getMonth() + 1) == bits[1]) {
            return true;
        } else {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        }
    }

    var dialog, form, dform,

        // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
        emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        , firstname = $("#firstname")
        , lastname = $("#lastname")
        , street = $("#street")
        , zip = $("#zip")
        , city = $("#city")
        , email = $("#email")
        , phone = $("#phone")
        , birthday = $("#birthday")
        , allFields = $([]).add(firstname).add(lastname).add(email).add(birthday)
        , tips = $(".validateTips");

    // Aus dem Beispiel von jQuery UI
    function updateTips(t) {
        tips
            .text(t)
            .addClass("ui-state-highlight");
        setTimeout(function() {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    // Aus dem Beispiel von jQuery UI
    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }

    // Speichern/Änderung der Kontaktdaten im Array
    function saveContactData() {
        let valid = true;
        allFields.removeClass("ui-state-error");

        if (firstname.val() == "" && lastname.val() == "") {
            firstname.addClass("ui-state-error");
            lastname.addClass("ui-state-error");
            updateTips("\"Vorname\" oder \"Nachname\" wird benötigt!");
            valid = false;
        } else {
            if (firstname.val() != "") {
                valid = valid && checkRegexp(firstname, /^[a-z]([\u00C0-\u017F0-9a-z_\s])+$/i, "Name muss aus a-z, 0-9, Unterstrichen oder Leerzeichen bestehen und mit einem Buchstaben anfangen.");
            }
            if (lastname.val() != "") {
                valid = valid && checkRegexp(lastname, /^[a-z]([\u00C0-\u017F0-9a-z_\s])+$/i, "Name muss aus a-z, 0-9, Unterstrichen oder Leerzeichen bestehen und mit einem Buchstaben anfangen.");
            }
        }

        if (email.val() != "") {
            valid = valid && checkRegexp(email, emailRegex, "z.B. name@example.com");
        }
        if (birthday.val() != "") {
            valid = valid && isValidDate(birthday, "Kein gültiges Datum.");
        }

        if (valid) {
            // contacts[contactID].cid = contactID;
            contacts[contactID].firstname = firstname.val();
            contacts[contactID].lastname = lastname.val();
            contacts[contactID].street = street.val();
            contacts[contactID].zip = zip.val();
            contacts[contactID].city = city.val();
            contacts[contactID].email = email.val();
            contacts[contactID].phone = phone.val();
            if (birthday.val() != "") {
                contacts[contactID].birthday = createDate(birthday.val())
            }

            sendContactDataToServer();

            // refresh list
            refreshList();

            // refresh contact details
            addressOut();

            // reset search field
            resetSearch();

            $("#addressfield").show("drop", {}, 250);

            dialog.dialog("close");
        }
        return valid;
    }

    // Variable dialog mit Widget 'Dialog' von jQuery UI initialisieren
    dialog = $("#dialog-form").dialog({
        autoOpen: false
        , height: 650
        , width: 450
        , modal: true
        , buttons: {
            "Save": saveContactData
            , Cancel: function() {
                dialog.dialog("close");
            }
        }
        , close: function() {
            dform.reset();
            allFields.removeClass("ui-state-error");
        }
    });

    // Event Handler für dialogopen registrieren (Vorbelegung der Felder mit den Kontaktdaten aus dem Array)
    dialog.on("dialogopen", function(event) {
        //let dform = this.ownerDocument.forms[0];

        dform.firstname.value = contacts[contactID].firstname;
        dform.lastname.value = contacts[contactID].lastname;
        dform.street.value = contacts[contactID].street;
        dform.zip.value = contacts[contactID].zip;
        dform.city.value = contacts[contactID].city;
        dform.email.value = contacts[contactID].email;
        dform.phone.value = contacts[contactID].phone;
        dform.birthday.value = getDateString(contacts[contactID].birthday);
        updateTips("Pflichtfelder sind gekennzeichnet mit *.");
    });

    // Form-Objekt holen und Event Handler für submit registrieren 
    form = dialog.find("form").on("submit", function(event) {
        event.preventDefault();
        saveContactData();
    });

    dform = form[0];

    $("#change").button().on("click", function() {
        // $( "#addressfield" ).hide( "clip", {}, 500 );
        dialog.dialog("open");
    });

    /* ************* ENDE STEFAN **************************/


    /* ************* START DANIEL **************************/

    /**
     * Variablendeklaration aus Form
     *
     * @author DK
     */
    var dialog2, dform2
        , firstname2 = $("#firstname2")
        , lastname2 = $("#lastname2")
        , street2 = $("#street2")
        , zip2 = $("#zip2")
        , city2 = $("#city2")
        , email2 = $("#email2")
        , phone2 = $("#phone2")
        , birthday2 = $("#birthday2")
        , allFields2 = $([]).add(firstname2).add(lastname2).add(email2).add(birthday2);


    /**
     * Führt Validierung durch, versieht falsche Eingaben mit Fehlermeldungen.
     * 
     * @return (bool) valid 
     * @author DK
     */

    function saveContactData2() {
        let valid = true;
        allFields2.removeClass("ui-state-error");

        if (firstname2.val() == '' && lastname2.val() == '') {
            firstname2.addClass("ui-state-error");
            lastname2.addClass("ui-state-error");
            updateTips("\"Vorname\" oder \"Nachname\" wird benötigt!");

            valid = false;
        } else {
            if (firstname2.val() != "") {
                valid = valid && checkRegexp(firstname2, /^[a-z]([\u00C0-\u017F0-9a-z_\s])+$/i, "Name muss aus a-z, 0-9, Unterstrichen oder Leerzeichen bestehen und mit einem Buchstaben anfangen.");
            }
            if (lastname2.val() != "") {
                valid = valid && checkRegexp(lastname2, /^[a-z]([\u00C0-\u017F0-9a-z_\s])+$/i, "Name muss aus a-z, 0-9, Unterstrichen oder Leerzeichen bestehen und mit einem Buchstaben anfangen");
            }
        }

        if (email2.val() != "") {
            valid = valid && checkRegexp(email2, emailRegex, "z.B. name@example.com");
        }

        if (birthday2.val() != '') {
            valid = valid && isValidDate(birthday2, "z.B. dd.mm.yyyy");
        }

        if (valid) {
            contactID = contacts.length;
            // einfacher lösbar durch length, dann aber Gefahr der doppelten ID-Vergabe
            let max_cid = contacts.reduce((max, p) => p.cid > max ? p.cid : max, contacts[0].cid);

            // Wandelt eingegebenen String in Datumsobjekt um, wenn Datum eingegeben wurde.
            let birthday_obj = (birthday2.val()) ? createDate(birthday2.val()) : '';
            contacts.push({
                'cid': max_cid + 1
                , 'firstname': firstname2.val()
                , 'lastname': lastname2.val()
                , 'street': street2.val()
                , 'zip': zip2.val()
                , 'city': city2.val()
                , 'email': email2.val()
                , 'phone': phone2.val()
                , 'birthday': birthday_obj
            });

            sendContactDataToServer();

            // clear list
            contactlist.clear();

            /** Liste wird neu angelegt und sortiert.  */
            contactlist = new List('contactlist', options, contacts);
            contactlist.sort('lastname', {
                order: "asc"
            });


            // refresh contact details
            addressOut();

            $("#addressfield").show("drop", {}, 250);

            // Damit Auffdorderung zur Adressauswahl bei Adressanzeige wieder deaktiviert wird
            $("#addressfield").hide("drop", {}, 250);

            $("input[type='text']").val('');

            dialog2.dialog("close");
        }
        return valid;
    }


    /**
     * Widget "Dialog" aus jQuery UI wird initialisieren.
     *
     * @author DK
     */
    var dialog2 = $("#dialog-form2")
        .dialog({
            autoOpen: false
            , height: 600
            , width: 450
            , modal: true
            , buttons: {
                "Save": saveContactData2
                , Cancel: function() {
                    dialog2.dialog("close");
                }
            }
            , close: function() {
                dform2.reset();
                allFields.removeClass("ui-state-error");
            }
        });


    /**
     * Eventhandler für Dialog und Wertübergabe.
     *
     * @author DK
     */
    dialog2.on("dialogopen", function(event) {
        Helpers.valuesToDform(dform2);
        updateTips("Pflichtfelder sind gekennzeichnet mit *.");
    });

    dform2 = form[0];

    $("#create-address")
        .button()
        .on("click", function() {

            if (toggleAddrDetails) {
                // hide address details
                $("#addressfield").hide("clip", {}, 500);
                document.getElementById("overlay").style.display = "block";
            }

            dialog2.dialog("open");
        });

    /* ************* ENDE DANIEL **************************/


    /** 
     * Adresse ausblenden/Overlay einblenden
     *
     * @author SJ
     * @author SR (dynamisch)
     */

    // document.getElementById("close").onclick = showElement;
    $("#close").button().on("click", showElement);

    function showElement() {

        $("#addressfield").hide("drop", {}, 500);

        document.getElementById("overlay").style.display = "block";

        toggleAddrDetails = false;
    }


    /** 
     * Löschen Confirm Dialog
     *
     * @author SJ
     */
    delDialog = $("#dialog-confirm").dialog({
        autoOpen: false
        , resizable: false
        , height: "auto"
        , width: 400
        , modal: true
        , dialogClass: "no-close"
        , buttons: {
            "LÖSCHEN": delContactData
            , "Abbrechen": function() {
                delDialog.dialog("close");
            }
        }
    });


    $("#delete").button().on("click", function() {
        delDialog.dialog("open");
    });

    /** 
     * Löschen Funktion
     *
     * @author SJ
     * @author GF (splice)
     * @author DK (sort)
     */
    function delContactData() {


        contacts.splice(contactID, 1);

        for (var i = contactID; i < contacts.length; i++) {
            contacts[i].cid = i;
        }

        sendContactDataToServer();

        // clear list
        contactlist.clear();
        contactlist = new List('contactlist', options, contacts);

        // added 20180516 DK
        contactlist.sort('lastname', {
            order: "asc"
        });

        // Dialog schliessen
        delDialog.dialog("close");

        //  Adresse ausblenden/Overlay einblenden
        showElement();

    }

    /* ************* START DANIEL **************************/

    /**
     * jQuery UI-Dialog-Widget wird instanziiert.
     *
     * Mit einer Größe von 600x600px
     * und diversen Ein- und Ausblendeffekten
     *
     * @author DK
     *
     */
    $("#dialog_qr_code").dialog({
        height: 600
        , width: 600
        , autoOpen: false
        , modal: true
        , show: {
            effect: "clip"
            , duration: 1000
        }
        , hide: {
            effect: "explode"
            , duration: 1000
        }
        , close: function(event, ui) {
            $('#picture').html('');

        }
    });


    /**
     * Macht Adressdetails des selektierten Kontakts ausfindig
     *
     * @author DK
     */
    $("#opener").on("click", function() {

        var contact_details = Helpers.contactDetailsById();

        /**
         * Link-Rumpf zur QR-Abfrage und Festlegung des Qualitätsniveaus
         *
         * @author DK
         */
        let link = 'https://chart.apis.google.com/chart?cht=qr&chs=400x400&chl='
            , quality = 'Q';


        /**
         * Bild wird mit einer Größe 400x400 instanziiert
         * 
         * @author DK
         */
        var myImage = new Image(400, 400);

        /* Bild erhält Link mit Adressdetails im VCard 3.0-Format
         *
         * @author DK
         */
        myImage.src = link + 'BEGIN:VCARD%0AVERSION:3.0%0A' +
            'N:' + contact_details.lastname + ';' + contact_details.firstname + ';;%0A' +
            'FN:' + contact_details.firstname + '%20' + contact_details.lastname + '%0A' +
            'TEL;TYPE%3DHOME,VOICE:' + contact_details.phone + '%0A' +
            'ADR;TYPE%3DHOME:;;' + contact_details.street + ';' + contact_details.city + ';' + contact_details.zip + ';%0A' +
            'LABEL;TYPE%3DHOME:' + contact_details.street + '\n' + contact_details.zip + '\ln' + contact_details.city + '%0A' +
            'EMAIL;TYPE%3DPREF,INTERNET:' + contact_details.email + '%0A' +
            'END:VCARD' +
            '&chld=' + quality;

        /** An p Element im DOM wird das Bild angehängt
         *
         * @author DK
         */
        $('#picture').append(myImage);


        $("#dialog_qr_code").dialog("open");
    });

    var url = "https://api.nytimes.com/svc/topstories/v2/world.json";
    url += '?' + $.param({
        'api-key': "2e8afca59cf243bcbc0d87685201793b"
    });

    $.ajax({
        url: url
        , method: 'GET'
    , }).done(function(result) {
        var news_i = 0;
        setInterval(function() {
            if (result.results[news_i].abstract == undefined) {
                return false;
            } else {
                document.getElementById('news').innerHTML = result.results[news_i].abstract;
                //$("#news").animate({width:'toggle'},350);

                if (news_i < result.results.length - 1) {
                    news_i++;
                } else {
                    news_i = 0;
                }
            }
        }, 3000);

    }).fail(function(err) {
        throw err;
    });

              function hexFromRGB(r, g, b) {
                  var hex = [
                      r.toString( 16 ),
                      g.toString( 16 ),
                      b.toString( 16 )
                  ];
                  $.each( hex, function( nr, val ) {
                      if ( val.length === 1 ) {
                          hex[ nr ] = "0" + val;
                      }
                  });
                  return hex.join( "" ).toUpperCase();
              }

              function refreshSwatch() {
                  var red = $( "#red" ).slider( "value" ),
                      green = $( "#green" ).slider( "value" ),
                      blue = $( "#blue" ).slider( "value" ),
                      hex = hexFromRGB( red, green, blue );
                  me._favouriteColor = '#' + hex;
                  $( "#swatch" ).css( "background-color", "#" + hex );
              }

              $( "#red, #green, #blue" ).slider({
                  orientation: "horizontal",
                  range: "min",
                  max: 255,
                  value: 127,
                  slide: refreshSwatch,
                  change: refreshSwatch
              });

              //$( "#red" ).slider( "value", 0 );
              //$( "#green" ).slider( "value", 0 );
              //$( "#blue" ).slider( "value", 0 );

              me._favouriteColor = 'rgb(' 
               + $( "#red" ).slider( "value", 255 ) + ','
              + $( "#green" ).slider( "value", 255 ) + ','
              + $( "#blue" ).slider( "value", 255 ) + ')';
      

    /******************* ENDE DK *************************/
});
