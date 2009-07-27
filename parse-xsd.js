function getDoc (url) {
  var myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", url, false);
  myXMLHTTPRequest.overrideMimeType('text/xml'); // Harder
  myXMLHTTPRequest.send(null);
  return myXMLHTTPRequest.responseXML;
}

function jsdump(str) {
    console.log(str);
}

__basehandler = function(e, root, ctx, where) {
    var thisNode = where[e.getAttribute("name")] = {};
    attribsToJS(e,thisNode);
    visitChildren(e, root, thisNode);
};

__contexthandler = function(e, root, ctx, where, type) {
    if (!ctx) { jsdump(type+" seen without context!"); return; }
    if (!ctx[where]) ctx[where] = {};
    var thisNode = ctx[where][e.getAttribute("name")] = {};
    attribsToJS(e,thisNode);
    visitChildren(e, root, thisNode);
    jsdump(root);
}

var handler = {
    "xs:element": function (e,root,ctx) {
        __basehandler(e,root,ctx,root["elements"]);
    },
    "xs:complexType": function(e, root, ctx) { __basehandler(e,root,ctx,root["types"]); },
    "xs:simpleType": function(e, root, ctx) { __basehandler(e,root,ctx,root["types"]); },
    "xs:attribute": function(e,root,ctx) {
        __contexthandler(e,root,ctx,"attribute", "Attribute");
    },
    "xs:sequence": function(el, root, ctx) {
        var cn = el.childNodes;
        ctx["sequence"] = [];
        for (var i= 0; i < cn.length; i++) { var e = cn[i];
            if (!e.tagName) continue;
            var thisNode = {name: e.getAttribute("name")};
            attribsToJS(e, thisNode);
            ctx["sequence"].push(thisNode);
        }
        visitChildren(el, root, ctx);
    }
};

function attribsToJS(e, n) {
    if (!e.attributes) return;
    for(var i = 0; i < e.attributes.length; i++) {
        if (e.attributes[i].nodeName == "name") continue;
        n[e.attributes[i].nodeName] = e.attributes[i].nodeValue;
    }
}
doParse("simple.xsd");

function visitChildren (el, root, ctx) {
    var cn = el.childNodes;
    for (var i= 0; i < cn.length; i++) { var e = cn[i];
        if (!e.tagName) continue;
        jsdump(e.tagName);
        if (handler[e.tagName]) {
            handler[e.tagName](e, root, ctx);
        }
    }

}

function doParse(url) {
    var doc = getDoc(url);
    var root = {elements: {}, types: {} };
    var el = doc.documentElement;
    visitChildren(el, root);
    jsdump(root);
}
