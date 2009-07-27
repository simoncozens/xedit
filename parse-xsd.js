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
    jsdump(e.tagName);
    var thisNode = {};
    attribsToJS(e,thisNode);
    visitChildren(e, root, thisNode);
    jsdump(thisNode);
    thisNode["_tag"] = e.tagName;
    if (where) where[e.getAttribute("name")]  = thisNode;
    if (!where && ctx) { ctx[e.tagName] = thisNode }
    return thisNode;
};

__contexthandler = function(e, root, ctx, where, type) {
    if (!ctx) { ctx=root; }
    if (!ctx[where]) ctx[where] = {};
    var thisNode = ctx[where][e.getAttribute("name")] = {};
    attribsToJS(e,thisNode);
    visitChildren(e, root, thisNode);
    return thisNode;
}
function __arrayhandler(el, root, ctx, type) {
    var cn = el.childNodes;
    var a = [];
    for (var i= 0; i < cn.length; i++) { var e = cn[i];
        if (!e.tagName) continue;
        if (handler[e.tagName]) a.push(handler[e.tagName](e, root,ctx));
    }
    return a;
}

var handler = {
    "xs:element": function (e,root,ctx) {
        return __basehandler(e,root,ctx,root["elements"]);
    },
    "xs:attributeGroup": function(e, root, ctx) { return __basehandler(e,root,ctx,root["attributegroups"]); },
    "xs:group": function(e, root, ctx) { return __basehandler(e,root,ctx,root["groups"]); },
    "xs:complexType": function(e, root, ctx) { return __basehandler(e,root,ctx,root["types"]); },
    "xs:simpleType": function(e, root, ctx) { return __basehandler(e,root,ctx,root["types"]); },
    "xs:attribute": function(e,root,ctx) { return __contexthandler(e,root,ctx,"attribute", "Attribute"); },
    "xs:minInclusive": function(e,root) { return __basehandler(e,root); },
    "xs:maxInclusive": function(e,root) { return __basehandler(e,root); },
    "xs:annotation": function(e,root,ctx) {},
    "xs:description": function(e,root,ctx) {},
    "xs:restriction": function(el, root, ctx) { 
        ctx["restriction"] = __arrayhandler(el, root);
        return ctx["restriction"];
    },
    "xs:enumeration": function(e, root, ctx) { return __basehandler(e,root,ctx); },
    "xs:choice": function(el, root, ctx) { 
        var thisNode = __arrayhandler(el, root);
        if(ctx) ctx["choice"] = thisNode;
        return thisNode;
    },
    "xs:sequence": function(el, root, ctx) {
        var thisNode = __arrayhandler(el, root);
        if(ctx) ctx["sequence"] = thisNode;
        return ctx["sequence"];
    }
};

function attribsToJS(e, n) {
    if (!e.attributes) return;
    for(var i = 0; i < e.attributes.length; i++) {
        if (e.attributes[i].nodeName == "name") continue;
        n[e.attributes[i].nodeName] = e.attributes[i].nodeValue;
    }
}

function visitChildren (el, root, ctx) {
    var cn = el.childNodes;
    for (var i= 0; i < cn.length; i++) { var e = cn[i];
        if (!e.tagName) continue;
        if (handler[e.tagName]) {
            handler[e.tagName](e, root, ctx);
        }
    }

}

function doParse(url) {
    var doc = getDoc(url);
    var root = {elements: {}, types: {}, groups: {}, attributegroups: {} };
    var el = doc.documentElement;
    visitChildren(el, root);
    jsdump(root);
}
