var userMessage;

// Globales Array für die Kontaktliste
var contacts = [];
var contacts2 = [];

// Globale Variable für die ID der Kontaktliste - hinzugefügt am 14.05.2018, SR
var contactID = 0;

// Globale Variable für das Objekt der Kontaktliste (List.js) - geändert am 15.05.2018, SR
var contactlist;

/**
 * TODO: span.class{display:none;} setzen
 */

$(function() {
    
    /** Optionen für Kontaktliste werden festgelegt. */
    var options = {
        valueNames: ['cid', 'firstname', 'lastname', 'email']
        , item: '<li class="collection-item" onclick="getContactId(event)"><span class="title cid"></span><span class="lastname"></span>, <span class="firstname"></span><br /><span class="email"></span></li>'
    };

    /** Objekt mit Kontaktdaten im JSON-Format, welche mittels Ajax-Funktion importiert werden. */

    $.getJSON("./database.json", function(data) {
        contacts = data.contacts;
        contacts2 = data.contacts;

        for (var i = 0; i < contacts.length; i++) {
            let bday = contacts[i].birthday

            if (bday != "") {
                contacts[i].birthday = new Date(bday);
            }
        }

        /** Listeninstanz wird angelegt.  */
        contactlist = new List('contactlist', options, contacts);
    });

    var dialog, dialog2, form, dform, dform2
        , emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        , firstname = $("#firstname")
        , lastname = $("#lastname")
        , street = $("#street")
        , zip = $("#zip")
        , city = $("#city")
        , email = $("#email")
        , phone = $("#phone")
        , birthday = $("#birthday")
        , allFields = $([]).add(firstname).add(lastname).add(email).add(birthday)
        , firstname2 = $("#firstname2")
        , lastname2 = $("#lastname2")
        , street2 = $("#street2")
        , zip2 = $("#zip2")
        , city2 = $("#city2")
        , email2 = $("#email2")
        , phone2 = $("#phone2")
        , birthday2 = $("#birthday2")
        , allFields2 = $([]).add(firstname2).add(lastname2).add(email2).add(birthday2)
        , tips = $(".validateTips");

    // Kontaktliste nach String konvertieren und an den Server (PHP) schicken
    function sendContactDataToServer() {

        //for (var i=0; i < contacts.length; i++) {
        //	contacts[i].birthday = contacts[i].birthday.toJSON();
        //}

        let prepared = JSON.stringify(contacts);
        prepared = "{\"contacts\":" + prepared + "}";

        $.post("server.php", {
                neuedaten: prepared
            })
            .done(function(data) {
                console.log(data);
            }).always(function(data){
                console.log(prepared);
            });
    }

    function sendContactDataToServer2() {

        //for (var i=0; i < contacts.length; i++) {
        //	contacts[i].birthday = contacts[i].birthday.toJSON();
        //}

        let prepared = JSON.stringify(contacts2);
        prepared = "{\"contacts\":" + prepared + "}";

        $.post("server.php", {
                neuedaten: prepared
            })
            .done(function(data) {
                console.log(data);
            }).fail(function(data){
                console.log(prepared);
                //alert('failed');
            });
    }

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

    // Aus Datum-String ein Datum-Objekt erstellen
    function createDate(dateString) {
        var bits = dateString.split('.');
        var date = new Date(bits[2], bits[1] - 1, bits[0]);
        return date;
    }

    // Datum in String umwandeln -> DD.MM.YYYY
    function getDateString(date) {
        let dayStr = "00" + date.getDate();
        let monthStr = "00" + (date.getMonth() + 1);
        let year = String(date.getFullYear());

        return dayStr.substr(-2) + "." + monthStr.substr(-2) + "." + year;
    }

    // Speichern/Änderung der Kontaktdaten im Array
    function saveContactData() {
        let valid = true;
        allFields.removeClass("ui-state-error");

        if (firstname.val() == "" && lastname.val() == "") {
            firstname.addClass("ui-state-error");
            lastname.addClass("ui-state-error");
            updateTips("Either \"Vorname\" or \"Nachname\" is required!");
            valid = false;
        } else {
            if (firstname.val() != "") {
                valid = valid && checkRegexp(firstname, /^[a-z]([0-9a-z_\s])+$/i, "Name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
            }
            if (lastname.val() != "") {
                valid = valid && checkRegexp(lastname, /^[a-z]([0-9a-z_\s])+$/i, "Name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
            }
        }

        valid = valid && checkRegexp(email, emailRegex, "eg. ui@jquery.com");
        valid = valid && isValidDate(birthday, "eg. dd.mm.yyyy");

        if (valid) {
            // contacts[contactID].cid = contactID;
            contacts[contactID].firstname = firstname.val();
            contacts[contactID].lastname = lastname.val();
            contacts[contactID].street = street.val();
            contacts[contactID].zip = zip.val();
            contacts[contactID].city = city.val();
            contacts[contactID].email = email.val();
            contacts[contactID].phone = phone.val();
            contacts[contactID].birthday = createDate(birthday.val())

            sendContactDataToServer();

            // clear list
            contactlist.clear();
            contactlist = new List('contactlist', options, contacts);

            // refresh contact details
            addressOut();

            dialog.dialog("close");
        }
        return valid;
    }

    function saveContactData2() {
        let valid = true;
        allFields.removeClass("ui-state-error");

        if (firstname2.val() == "" && lastname2.val() == "") {
            firstname2.addClass("ui-state-error");
            lastname2.addClass("ui-state-error");
            updateTips("Either \"Vorname\" or \"Nachname\" is required!");
            valid = false;
        } else {
            if (firstname2.val() != "") {
                valid = valid && checkRegexp(firstname2, /^[a-z]([0-9a-z_\s])+$/i, "Name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
            }
            if (lastname.val() != "") {
                valid = valid && checkRegexp(lastname2, /^[a-z]([0-9a-z_\s])+$/i, "Name may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
            }
        }

        valid = valid && checkRegexp(email2, emailRegex, "eg. ui@jquery.com");
        valid = valid && isValidDate(birthday2, "eg. dd.mm.yyyy");

        if (valid) {
            // contacts[contactID].cid = contactID;
            let max_cid = contacts2.reduce((max, p) => p.cid > max ? p.cid : max, contacts2[0].cid);
            contacts2.push({'cid': max_cid +1 , 'firstname': firstname2.val() , 'lastname': lastname2.val(), 'street': street2.val(), 'zip': zip2.val(), 'city':city2.val(), 'email':email2.val(), 'phone':phone2.val(), 'birthday':birthday2.val()});

            sendContactDataToServer2();

            // clear list
            contactlist.clear();
            contactlist = new List('contactlist', options, contacts2);

            // refresh contact details
            addressOut();

            dialog2.dialog("close");
        }
        return valid;
    }

    // Variable dialog mit Widget 'Dialog' von jQuery UI initialisieren
    dialog = $("#dialog-form")
        .dialog({
            autoOpen: false
            , height: 400
            , width: 350
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

    dialog2 = $("#dialog-form2")
        .dialog({
            autoOpen: false
            , height: 800
            , width: 350
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

    // Event Handler für dialogopen registrieren (Vorbelegung der Felder mit den Kontaktdaten aus dem Array)
    dialog.on("dialogopen", function(event) {
        //let dform = this.ownerDocument.forms[0];
        //console.log(dform);

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

    dialog2.on("dialogopen", function(event) {
        //let dform = this.ownerDocument.forms[0];
        //console.log(dform);

        //TODO kann wahrscheinlich raus
        dform2.firstname.value = contacts[contactID].firstname;
        dform2.lastname.value = contacts[contactID].lastname;
        dform2.street.value = contacts[contactID].street;
        dform2.zip.value = contacts[contactID].zip;
        dform2.city.value = contacts[contactID].city;
        dform2.email.value = contacts[contactID].email;
        dform2.phone.value = contacts[contactID].phone;
        dform2.birthday.value = getDateString(contacts[contactID].birthday);
        updateTips("Pflichtfelder sind gekennzeichnet mit *.");
    });

    // Form-Objekt holen und Event Handler für submit registrieren 
    // TODO wird das ausgeführt?
    form = dialog.find("form")
        .on("submit", function(event) {
            event.preventDefault();
            saveContactData();
        });

     //console.log(form);

    dform = form[0];
    dform2 = form[0];
    // console.log(dform);

    $("#change")
        .button()
        .on("click", function() {
            dialog.dialog("open");
        });

    $("#create-address")
        .button()
        .on("click", function() {
            dialog2.dialog("open");
        });

    /* ************* TO DO SANDRA: Adresse ausblenden/Overlay einblenden **************************/

    document.getElementById("close")
        .onclick = showElement;

    function showElement() {
        document.getElementById("overlay")
            .style.display = "block";
    }


    /* ************* TO DO SANDRA: Löschen Confirm **************************/

    document.getElementById("delete")
        .onclick = confirmDelete;

    function confirmDelete() {


        var confirmAsk = confirm("Wollen Sie den Kontakt wirklich löschen?");

        if (confirmAsk == true) {
            userMessage = "<p>Löschen bestätigt</p>";

            // TODO: DB weiter verarbeiten

        } else {
            userMessage = "<p>Löschen abgebrochen</p>";
        }

        document.getElementById("userMessages")
            .innerHTML = userMessage;
    }

    /* ************* ENDE SANDRA **************************/

});




/**
 * ID/cid des angeglickten Kontakts wird ausgegeben.
 *
 * @param: {Object} event - das Event des engeklickten Listeneintrags
 *
 */

function getContactId(event) {
    // TODO werden beide id's benötigt?
    var cid = event.currentTarget.firstChild.innerHTML;

    contactID = parseInt(event.currentTarget.firstChild.innerHTML);

    document.getElementById("overlay")
        .style.display = "none"; // Overlay ausblenden

    // var userMessage löschen
    var userMessage = "";
    document.getElementById("userMessages")
        .innerHTML = userMessage;

    addressOut();

}

//TODO evtl. noch für Form2 anpassen
function addressOut() {

    var fullAddress = contacts[contactID];

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
        .innerHTML = fullAddress.birthday;


}

//console.log(contactID);

