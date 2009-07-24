function getDoc (url) {
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", url, false);
  myXMLHTTPRequest.overrideMimeType('text/xml'); // Harder
  myXMLHTTPRequest.send(null);
  return myXMLHTTPRequest.responseXML;
}

var config;

function intuitUIClass() {
    return "html"; // XUL is broken right now
}

function addButtons() {
    var uiclass = intuitUIClass();
    var buttonbox = makeUIElement[uiclass]["toolbar"]();
    var xul = (document.documentElement.tagName.search(/window/i) != -1);
    var buttons = (config.getElementsByTagName("buttons"))[0].childNodes;
    for (var i=0; i < buttons.length; i++) {
        var buttonConfig = buttons.item(i);
        if (buttonConfig.tagName == "button") {
            var button = makeUIElement[uiclass]["button"](buttonConfig);
            var action = buttonConfig.getAttribute("action") || "surround";
            if (!setButtonAction[action]) { alert("Unknown action '"+action+"' for button '"+buttonConfig.getAttribute("name")+"'"); return; }
            setButtonAction[action](buttonConfig, button);
            buttonbox.appendChild(button);
        } else if (buttonConfig.tagName == "spacer") {
            buttonbox.appendChild(makeUIElement[uiclass]["spacer"]());
        }
    }
}

function appendCSS() {
    var styles = config.getElementsByTagName("stylesheet");
    var head = (document.getElementsByTagName("head"))[0];
    var link = document.createElement("link");
    for (var sNo = 0; sNo < styles.length; sNo++) {
        var s = styles[sNo];
        link.setAttribute("href", s.getAttribute("href"));
        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        head.appendChild(link);
    }
}

function startXEdit(configurl) {
  config = getDoc(configurl).documentElement;
  appendCSS();
  addButtons();
}

function loadDoc(docurl) {
    var doc = getDoc(docurl).documentElement;
    // XXX - set the edit element another way
    var editfield = document.getElementById("edit");
    while (editfield.childNodes.length > 0) editfield.removeChild(editfield.firstChild)
    editfield.appendChild(doc);
}
