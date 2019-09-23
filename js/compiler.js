const vertexShader = `
    attribute vec3 position;
    void main(void) {
        gl_Position = vec4(position, 1.0);
    }
`;

const render = input => {
    errorLog.value = 'No Errors!';

    const fragmentShader = input;
    const createProgram = (vs, fs) => {
        let stack = ctx.createProgram();

        ctx.attachShader(stack, vs);
        ctx.attachShader(stack, fs);
        ctx.linkProgram(stack);

        if (ctx.getProgramParameter(stack, ctx.LINK_STATUS)) {
            console.log('Success <create program>');
            ctx.useProgram(stack);
            return stack;
        } else {
            return null;
        }
    };

    const createShader = (script, type) => {
        let shader = null;
        if (type == 'v') shader = ctx.createShader(ctx.VERTEX_SHADER);
        if (type == 'f') shader = ctx.createShader(ctx.FRAGMENT_SHADER);

        ctx.shaderSource(shader, script);
        ctx.compileShader(shader);

        if (ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
            console.log('Success <create shader>');
            return shader;
        } else {
            const error = ctx.getShaderInfoLog(shader);
            // console.log('Error', error);
            errorLog.value = error.toString();
        }
    };

    const createVbo = data => {
        let vbo = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(data), ctx.STATIC_DRAW);
        ctx.bindBuffer(ctx.ARRAY_BUFFER, null);

        return vbo;
    };

    const createIbo = data => {
        let ibo = ctx.createBuffer();
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, ibo);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Int16Array(data), ctx.STATIC_DRAW);
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, null);

        return ibo;
    };

    const program = createProgram(createShader(vertexShader, 'v'), createShader(fragmentShader, 'f'));

    const uniform = [];
    uniform[0] = ctx.getUniformLocation(program, 'time');
    uniform[1] = ctx.getUniformLocation(program, 'resolution');

    const position = [
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0
    ];

    const index = [
        0, 2, 1,
        1, 2, 3
    ];

    const vbo_Index = createIbo(index);
    const vbo_Position = createVbo(position);
    const vbo_AttLocation = ctx.getAttribLocation(program, 'position');

    ctx.bindBuffer(ctx.ARRAY_BUFFER, vbo_Position);
    ctx.enableVertexAttribArray(vbo_AttLocation);
    ctx.vertexAttribPointer(vbo_AttLocation, 3, ctx.FLOAT, false, 0, 0);
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, vbo_Index);
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);

    const tick = () => {
        const sec = (new Date().getTime() - time) / 1000;
        ctx.clear(ctx.COLOR_BUFFER_BIT);

        ctx.uniform1f(uniform[0], sec);
        ctx.uniform2fv(uniform[1], [width, height]);
        ctx.drawElements(ctx.TRIANGLES, 6, ctx.UNSIGNED_SHORT, 0);
        ctx.flush();

        time++;
        requestAnimationFrame(tick);
    }

    let time = new Date().getTime();
    tick();
}

const errorLog = document.getElementById('error');

const canvas = document.getElementById('canvas');
const height = innerHeight * 0.8;
const width = innerWidth * 0.5;
canvas.height = height;
canvas.width = width;

const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
