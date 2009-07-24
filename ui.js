makeUIElement = {};

makeUIElement.xul = {
    button: function (buttonX) {
        var button = document.createElement("button");
        button.makesElement = buttonX.getAttribute("element");
        if (buttonX.getAttribute("image")) 
            button.setAttribute("image", buttonX.getAttribute("image"));
        else
            button.setAttribute("label", buttonX.getAttribute("name"));
        return button;
    },
    spacer: function() { }
};

makeUIElement.html = {
    button: function(buttonX) {
        var button = document.createElement("button");
        if (buttonX.getAttribute("image")) {
            var img = document.createElement("img");
            img.setAttribute("src", buttonX.getAttribute("image"));
            button.appendChild(img);
        } else 
            button.appendChild(document.createTextNode(buttonX.getAttribute("name")));
        return button;
    },
    spacer: function() {
        var span = document.createElement("span");
        span.appendChild(document.createTextNode(" | "));
        span.setAttribute("style", "margin:20px");
        return span;
    }
}; 

