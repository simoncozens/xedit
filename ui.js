function intuitUIClass() {
    if (document.documentElement.tagName == "window")
        return "xul";
    return "html"; 
}

makeUIElement = {};

makeUIElement.xul = {
    button: function (buttonX) {
        var button = document.createElement("toolbarbutton");
        button.makesElement = buttonX.getAttribute("element");
        if (buttonX.getAttribute("image")) 
            button.setAttribute("image", buttonX.getAttribute("image"));
        else
            button.setAttribute("label", buttonX.getAttribute("name"));
        return button;
    },
    spacer: function() { 
        return document.createElement("toolbarspacer");
    },
    toolbar: function() { 
        var toolbar = document.createElement("toolbar");
        var toolbox = document.createElement("toolbox");
        toolbox.appendChild(toolbar);
        var edit = document.getElementById("edit");
        edit.parentNode.insertBefore(toolbox,edit);
        return toolbar;
    }
};

makeUIElement.html = {
    button: function(buttonX) {
        if (buttonX.getAttribute("image")) {
            var img = document.createElement("img");
            img.setAttribute("src", buttonX.getAttribute("image"));
            img.setAttribute("style", "height:30px");
            return img;
        } 
        var button = document.createElement("button");
        button.appendChild(document.createTextNode(buttonX.getAttribute("name")));
        return button;
    },
    spacer: function() {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode("  "));
        span.setAttribute("style", "margin:20px");
        return span;
    },
    toolbar: function() {
        var toolbar = document.createElement("div");
        toolbar.setAttribute("id", "toptoolbar");
        var edit = document.getElementById("edit");
        edit.parentNode.insertBefore(toolbar,edit);
        return toolbar;
    }
}; 

