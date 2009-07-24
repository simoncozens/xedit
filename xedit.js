function getDoc (url) {
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", url, false);
  myXMLHTTPRequest.overrideMimeType('text/xml'); // Harder
  myXMLHTTPRequest.send(null);
  return myXMLHTTPRequest.responseXML;
}

var config;

makeAButton = {
    xul: function (buttonX) {
        var button = document.createElement("button");
        button.makesElement = buttonX.getAttribute("element");
        if (buttonX.getAttribute("image")) 
            button.setAttribute("image", buttonX.getAttribute("image"));
        else
            button.setAttribute("label", buttonX.getAttribute("name"));
        return button;
    },
    html: function(buttonX) {
        var button = document.createElement("button");
        if (buttonX.getAttribute("image")) {
            var img = document.createElement("img");
            img.setAttribute("src", buttonX.getAttribute("image"));
            button.appendChild(img);
        } else 
            button.appendChild(document.createTextNode(buttonX.getAttribute("name")));
        return button;
    }
}; 

setButtonAction = {
    surround: function(buttonX, button) {
        button.makesElement = buttonX.getAttribute("element");
        button.addEventListener("click", function () {
            makeSelection(this.makesElement) 
        }, true);
    },
    replace: function(buttonX, button) {
        button.makesElement = buttonX.getAttribute("element");
        button.addEventListener("click", function () {
            replaceHeadNode(this.makesElement) 
        }, true);
    }
};

function addButtons() {
    var buttonbox = document.getElementById("toptoolbar");
    var xul = (document.documentElement.tagName.search(/window/i) != -1);
    var buttons = config.getElementsByTagName("button");
    for (var i=0; i < buttons.length; i++) {
        var buttonConfig = buttons.item(i);
        var button = makeAButton[xul ? "xul" : "html"](buttonConfig);
        var action = buttonConfig.getAttribute("action") || "surround";
        if (!setButtonAction[action]) { alert("Unknown action '"+action+"' for button '"+buttonConfig.getAttribute("name")+"'"); return; }
        setButtonAction[action](buttonConfig, button);
        buttonbox.appendChild(button);
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

function makeSelection (element) {
    var s = window.getSelection();
    if (s.isCollapsed) return;
    if (s.focusNode != s.anchorNode) { alert("Cannae do it"); return }
    var r = s.getRangeAt(0);
    r.surroundContents(document.createElement(element));
    document.getElementById('edit').focus();
}

function paragraphLevelElement(p) {
    return p.nodeType==1 && document.defaultView.getComputedStyle(p, "").display== "block";
}

function replaceHeadNode (element) {
    var s = window.getSelection();
    var p = s.getRangeAt(0).startContainer;
    while (p && ! paragraphLevelElement(p)) { p = p.parentNode }
    var children = p.childNodes;
    var repl = document.createElement(element);
    while (children.length > 0) repl.appendChild(children[0]);
    p.parentNode.insertBefore(repl, p);
    p.parentNode.removeChild(p);
}
