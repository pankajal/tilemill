// Inline color editing for Carto
(function (context) {
    if (!$) throw new Error('$-library expected');
    if (!_) throw new Error('_-library expected');

    function cartoColor(editor) {

        var delay = null;

        function cancelEvent(e) {
            if (!e) return;
            if (e.stopPropagation) { e.stopPropagation(); }
            if (e.preventDefault) { e.preventDefault(); }
        }

        function chooseColor() {
            // We want a single cursor position.
            // Find the token at the cursor
            // If it's not a 'word-style' token, ignore the token.
            if (editor.somethingSelected()) return;

            var cur = editor.getCursor(false),
                token = editor.getTokenAt(cur),
                tprop = token;

            if (token.className !== 'carto-colorcode') return;

            function insert(str) {
                editor.replaceRange(str, {
                    line: cur.line,
                    ch: token.start
                }, {
                    line: cur.line,
                    ch: token.end
                });
            }

            // Build the select widget
            var widget = document.createElement('div');
            widget.className = 'insert-colors';

            var $widget = $(widget);

            var pos = editor.cursorCoords();
            widget.style.height = '100px';
            widget.style.position = 'absolute';
            widget.style.left = pos.x + 'px';
            widget.style.top = pos.yBot + 'px';


            function css2rgb(c) {
                var x = function(i, size) {
                    return Math.round(parseInt(c.substr(i, size), 16) /
                        (Math.pow(16, size) - 1) * 255);
                };
                if (c[0] === '#' && c.length == 7) {
                    return {R:x(1, 2), G:x(3, 2), B:x(5, 2)};
                } else if (c[0] === '#' && c.length == 4) {
                    return {R:x(1, 1), G:x(2, 1), B:x(3, 1)};
                } else {
                    var rgb = c.match(/\d+/g);
                    return {R:rgb[0], G:rgb[1], B:rgb[2]};
                }
            }

            var hsv = Color.RGB_HSV(css2rgb(token.string));
            var cp = new Color.Picker({
                hue: hsv.H,
                sat: hsv.S,
                val: hsv.V,
                element: widget,
                callback: _(function(hex) {
                    insert('#' + hex);
                }).bind(this)
            });

            document.body.appendChild(widget);
            var done = false;
            function close() {
                if (done) return;
                done = true;
                widget.parentNode.removeChild(widget);
            }
            function pick() {
                insert(sel.options[sel.selectedIndex].text);
                close();
                setTimeout(function(){
                    editor.focus();
                }, 50);
            }
            $widget.blur(close);

            return true;
        }

        return {
            onCursorActivity: function(i, e) {
                if (delay) window.clearTimeout(delay);

                delay = window.setTimeout(function() {
                    chooseColor();
                }, 800);
            }
        };
    }

    context.cartoColor = cartoColor;
})(this);
