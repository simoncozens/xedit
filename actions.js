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
    },
    javascript: function(buttonX, button) {
        var js = buttonX.getAttribute("function");
        button.addEventListener("click", function() { eval(js) }, true);
    }
};

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
