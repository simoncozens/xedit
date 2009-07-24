SOURCES = ui.js actions.js xedit.js

xedit.js.min: $(SOURCES)
	cat $(SOURCES) | jsmin > xedit.js.min
