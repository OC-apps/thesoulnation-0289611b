import { useEffect, useRef } from "react";

/**
 * Cinematic volumetric background: WebGL fragment shader with fbm smoke,
 * deep black core, blue + orange volumetric light, mouse parallax,
 * breathing pulse, edge-concentrated mask to keep center readable.
 */
export function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false, alpha: true });
    if (!gl) return;

    const vertSrc = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fragSrc = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;     // -1..1, smoothed
      uniform float u_pulse;    // 0..1 breathing

      // hash + value noise
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
      float noise(vec2 p){
        vec2 i = floor(p), f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0,0.0));
        float c = hash(i + vec2(0.0,1.0));
        float d = hash(i + vec2(1.0,1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
      }
      float fbm(vec2 p){
        float v = 0.0; float a = 0.5;
        mat2 r = mat2(0.8,-0.6,0.6,0.8);
        for(int i=0;i<6;i++){
          v += a * noise(p);
          p = r * p * 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vec2 uv = v_uv;
        vec2 p = (uv - 0.5);
        p.x *= u_res.x / u_res.y;

        float t = u_time * 0.04;
        vec2 par = u_mouse * 0.08;

        // domain warp for organic volumetric smoke
        vec2 q = vec2(fbm(p*1.4 + vec2(0.0, t)), fbm(p*1.4 + vec2(5.2, -t)));
        vec2 r = vec2(fbm(p*1.8 + 4.0*q + vec2(1.7, 9.2) + t*0.7),
                      fbm(p*1.8 + 4.0*q + vec2(8.3, 2.8) - t*0.5));
        float n = fbm(p*1.6 + 3.5*r + par);

        // edge mask: high near edges/corners, low in center
        float vignette = smoothstep(0.02, 0.82, length(p*vec2(0.85,1.05)));

        // two volumetric light sources (orange top-right, blue bottom-left)
        vec2 orangeC = vec2(-0.80, 0.32) + par*1.2;
        vec2 blueC   = vec2(0.72,-0.24) - par*1.2;
        float orangeD = length(p - orangeC);
        float blueD   = length(p - blueC);

        float breathO = 0.85 + 0.15 * u_pulse;
        float breathB = 0.85 + 0.15 * (1.0 - u_pulse);

        float orangeGlow = exp(-orangeD * 1.25) * breathO;
        float blueGlow   = exp(-blueD   * 1.15) * breathB;

        // smoke density modulated by noise + vignette so center stays clean
        float smoke = pow(n, 1.6) * (0.35 + 0.85 * vignette);

        vec3 colOrange = vec3(1.0, 0.45, 0.12);    // flame
        vec3 colBlue   = vec3(0.18, 0.42, 1.0);    // electric blue
        vec3 base      = vec3(0.005, 0.008, 0.015); // deep black

        vec3 col = base;
        col += colOrange * (orangeGlow * 1.85 + smoke * orangeGlow * 2.9);
        col += colBlue   * (blueGlow   * 1.85 + smoke * blueGlow   * 2.9);

        // subtle ambient haze in mid tones, kept off center
        col += mix(colBlue, colOrange, n) * smoke * 0.16 * vignette;

        // minimal floating particles via high-freq noise threshold
        float sp = noise(p*180.0 + t*8.0);
        float spark = smoothstep(0.985, 1.0, sp) * (0.4 + 0.6*vignette);
        col += vec3(1.0, 0.85, 0.6) * spark * 0.35;

        // filmic-ish tone + slight grain
        col = col / (1.0 + col);
        float grain = (hash(uv * u_res + t) - 0.5) * 0.025;
        col += grain;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
      }
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uPulse = gl.getUniformLocation(prog, "u_pulse");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    function resize() {
      const w = Math.floor(window.innerWidth * dpr);
      const h = Math.floor(window.innerHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w; canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }
    resize();
    window.addEventListener("resize", resize);

    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);

    const start = performance.now();
    let raf = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function frame() {
      const t = (performance.now() - start) / 1000;
      // smooth parallax
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      // breathing 0..1 with slow sine
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);

      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, reduced ? 0 : t);
      gl!.uniform2f(uMouse, cur.x, cur.y);
      gl!.uniform1f(uPulse, pulse);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ background: "#03060d" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* center readability mask */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 46% 40% at 50% 44%, rgba(3,6,13,0.24), rgba(3,6,13,0) 72%)",
        }}
      />
      {/* edge vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 180px 35px rgba(0,0,0,0.62)" }}
      />
    </div>
  );
}
