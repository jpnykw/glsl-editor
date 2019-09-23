(() => {
    const keyBuffer = [];

    window.onload = () => {
        const editor = ace.edit('editor');
        editor.setFontSize(13);
        editor.getSession().setMode("ace/mode/glsl");
        editor.setTheme('ace/theme/tomorrow_night_eighties');

        // editor.setValue('// write your cool shader in here.');
        editor.setValue('precision mediump float;\nuniform vec2 resolution;\n\nvoid main() {\n\t// write your cool shader in here ...\n\tvec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);\n\tvec3 color = vec3(position.x, position.y, 0.0);\n\tgl_FragColor = vec4(color, 1.0);\n}');

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
