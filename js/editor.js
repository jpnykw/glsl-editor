(() => {
    const keyBuffer = [];

    window.onload = () => {
        const editor = ace.edit('editor');
        editor.setFontSize(13);
        editor.getSession().setMode("ace/mode/glsl");
        editor.setTheme('ace/theme/tomorrow_night_eighties');

        const editorElement = document.getElementById('editor');

        editorElement.addEventListener('keydown', (event) => {
            keyBuffer[event.keyCode] = true;

            if (keyBuffer[13] && (keyBuffer[17] || keyBuffer[91])) {
                keyBuffer[13] = false;
                keyBuffer[17] = false;
                keyBuffer[91] = false;
                render(editor.getValue());
            }
        });

        editorElement.addEventListener('keyup', (event) => {
            keyBuffer[event.keyCode] = false;
        });
    };
})();
