"""Render del reel vertical cinematográfico (1080x1920, 30 fps).

Uso: python render.py edl.json out.mp4 [--preview]
El EDL lista clips (tramos del video original con subtítulos palabra a palabra)
y placas (texto sobre negro). El audio se arma aparte en mix.py.
"""
import json, subprocess, sys, math, os
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

SRC = sys.argv[1]
EDL = json.load(open(sys.argv[2]))
OUT = sys.argv[3]
PREVIEW = "--preview" in sys.argv
FPS = 30
W, H = 1080, 1920
SW, SH = 1920, 1080
FONT_DIR = "/Library/Fonts"
SERIF_SB = f"{FONT_DIR}/SourceSerifPro-SemiBold.ttf"
SERIF_IT = f"{FONT_DIR}/SourceSerifPro-SemiBoldItalic.ttf"
SERIF_R = f"{FONT_DIR}/SourceSerifPro-Regular.ttf"
SANS_SB = f"{FONT_DIR}/IBMPlexSans-SemiBold.ttf"
SANS_M = f"{FONT_DIR}/IBMPlexSans-Medium.ttf"
ACCENT = (226, 150, 92)  # cobre del CRC, aclarado para fondo oscuro
CREAM = (248, 243, 234)
LOGO = EDL["logo"]

# ---------- grade / textura ----------
def make_lut():
    x = np.arange(256) / 255.0
    s = x + 0.10 * np.sin((x - 0.5) * math.pi) * (1 - abs(2 * x - 1)) * 1.6  # curva S suave
    s = np.clip(s * 0.97 + 0.012, 0, 1)
    r = np.clip(s ** 0.97 + 0.010 * x, 0, 1)   # cálido en altas
    g = np.clip(s ** 1.00, 0, 1)
    b = np.clip(s ** 1.05 + 0.03 * (1 - x) ** 2, 0, 1)  # sombras levemente frías
    return [np.uint8(np.round(c * 255)) for c in (r, g, b)]
LUT = make_lut()

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H * 0.42) / (H * 0.62)) ** 2)
VIG = np.clip(1.0 - 0.55 * np.clip(d - 0.35, 0, None) ** 1.6, 0.25, 1.0)
# zona baja: el zócalo de PAUTA queda bajo un degradado negro (ahí van los subtítulos)
bottom = np.clip((yy - H * 0.56) / (H * 0.215), 0, 1)
top = np.clip((H * 0.13 - yy) / (H * 0.13), 0, 1)
SHADE = (VIG * (1 - bottom ** 1.15) * (1 - 0.55 * top)).astype(np.float32)[..., None]
rng = np.random.default_rng(7)
GRAIN = [cv2.GaussianBlur(rng.normal(0, 7.5, (H // 2, W // 2)).astype(np.float32), (0, 0), 0.7) for _ in range(6)]
GRAIN = [cv2.resize(g, (W, H), interpolation=cv2.INTER_LINEAR)[..., None] for g in GRAIN]

CARD_SHADE = VIG.astype(np.float32)[..., None]  # las placas no llevan el degradado inferior

def grade(img, fi, shade=None):
    for c in range(3):
        img[..., c] = cv2.LUT(img[..., c], LUT[c])
    hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
    hsv[..., 1] = (hsv[..., 1].astype(np.float32) * 0.80).astype(np.uint8)
    img = cv2.cvtColor(hsv, cv2.COLOR_HSV2RGB).astype(np.float32)
    img = img * (SHADE if shade is None else shade) + GRAIN[fi % len(GRAIN)]
    return np.clip(img, 0, 255).astype(np.uint8)

def bars(img):
    # barras de cine finas arriba y abajo
    img[:36] = 0
    img[-36:] = 0
    return img

# ---------- texto ----------
FONTS = {}
def font(path, size):
    k = (path, size)
    if k not in FONTS:
        FONTS[k] = ImageFont.truetype(path, size)
    return FONTS[k]

def overlay(base, rgba, x, y):
    h, w = rgba.shape[:2]
    x0, y0 = max(0, x), max(0, y)
    x1, y1 = min(W, x + w), min(H, y + h)
    if x1 <= x0 or y1 <= y0:
        return
    sub = rgba[y0 - y:y1 - y, x0 - x:x1 - x].astype(np.float32)
    a = sub[..., 3:4] / 255.0
    base[y0:y1, x0:x1] = (base[y0:y1, x0:x1] * (1 - a) + sub[..., :3] * a).astype(np.uint8)

def text_layer(lines, fnt, fill, spacing=1.18, align="center", maxw=W, shadow=True, track=0):
    """lines: lista de listas de (texto, color). Devuelve RGBA numpy y su ancho/alto."""
    asc, desc = fnt.getmetrics()
    lh = int((asc + desc) * spacing)
    widths = []
    for ln in lines:
        widths.append(sum(fnt.getlength(t) + track * len(t) for t, _ in ln))
    tw = int(max(widths)) + 40
    th = lh * len(lines) + 40
    im = Image.new("RGBA", (tw, th), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    for i, ln in enumerate(lines):
        x = 20 + ((tw - 40 - widths[i]) / 2 if align == "center" else 0)
        y = 20 + i * lh
        for t, col in ln:
            if track:
                for ch in t:
                    dr.text((x, y), ch, font=fnt, fill=col)
                    x += fnt.getlength(ch) + track
            else:
                dr.text((x, y), t, font=fnt, fill=col)
                x += fnt.getlength(t)
    arr = np.array(im)
    if shadow:
        a = arr[..., 3].astype(np.float32)
        sh = cv2.GaussianBlur(a, (0, 0), 6) * 0.75
        out = np.zeros_like(arr)
        out[..., 3] = np.maximum(a, sh).astype(np.uint8)
        al = a / 255.0
        for c in range(3):
            out[..., c] = (arr[..., c] * al).astype(np.uint8)
        # re-premultiplicado inverso: color sobre sombra negra
        outa = out[..., 3:4].astype(np.float32) / 255.0
        out[..., :3] = np.where(outa > 0, np.clip(out[..., :3] / np.maximum(outa, 1e-3), 0, 255), 0).astype(np.uint8)
        arr = out
    return arr

def wrap_words(words, fnt, maxw):
    lines, cur, cw = [], [], 0
    sp = fnt.getlength(" ")
    for i, w in enumerate(words):
        lw = fnt.getlength(w["w"])
        if cur and cw + sp + lw > maxw:
            lines.append(cur); cur, cw = [], 0
        cur.append(i); cw += (sp if cw else 0) + lw
    if cur:
        lines.append(cur)
    if len(lines) == 2:  # equilibrar las dos líneas para no dejar una palabra sola
        flat = lines[0] + lines[1]
        def wid(ix): return sum(fnt.getlength(words[i]["w"]) for i in ix) + sp * (len(ix) - 1)
        best = min(range(1, len(flat)), key=lambda k: max(wid(flat[:k]), wid(flat[k:])))
        if wid(flat[:best]) <= maxw and wid(flat[best:]) <= maxw:
            lines = [flat[:best], flat[best:]]
    return lines

CAP_CACHE = {}
def caption_img(chunk, active, speaker):
    key = (tuple((w["w"], w["s"]) for w in chunk["words"]), active)
    if key in CAP_CACHE:
        return CAP_CACHE[key]
    fnt = font(SERIF_SB, 70)
    words = chunk["words"]
    rows = wrap_words(words, fnt, 940)
    lines = []
    for r in rows:
        ln = []
        for j, i in enumerate(r):
            t = words[i]["w"] + ("" if j == len(r) - 1 else " ")
            col = CREAM + (255,) if i <= active else CREAM + (140,)
            if words[i].get("em"):
                col = ACCENT + (255,) if i <= active else ACCENT + (140,)
            ln.append((t, col))
        lines.append(ln)
    arr = text_layer(lines, fnt, None, spacing=1.12)
    CAP_CACHE[key] = arr
    return arr

WEAK = {"de", "que", "el", "la", "los", "las", "un", "una", "y", "en", "a", "del", "por", "con", "se", "lo", "no", "al", "mi", "su", "tu", "es", "si"}
def chunk_words(words, max_words=5, max_gap=0.6):
    chunks, cur = [], []
    for w in words:
        hard = cur and (w["s"] - cur[-1]["e"] > max_gap or cur[-1]["w"][-1:] in ".?!:»”" or w.get("brk"))
        soft = cur and len(cur) >= max_words and cur[-1]["w"].lower() not in WEAK
        if hard or soft or (cur and len(cur) >= max_words + 2):
            chunks.append(cur); cur = []
        cur.append(w)
    if cur:
        chunks.append(cur)
    out = []
    for c in chunks:
        out.append({"words": c, "s": c[0]["s"], "e": c[-1]["e"]})
    for a, b in zip(out, out[1:]):
        a["e"] = min(max(a["e"], b["s"] - 0.25), b["s"])  # mantener en pantalla hasta el siguiente
    return out

# ---------- encuadre por cara ----------
CASCADE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
PROFILE = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")

def read_frames(start, end, scale=None):
    vf = [] if not scale else ["-vf", f"scale={scale[0]}:{scale[1]}"]
    w, h = scale if scale else (SW, SH)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-ss", f"{start:.3f}", "-i", SRC, "-t", f"{end - start:.3f}",
                          *vf, "-r", str(FPS), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    n = w * h * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            break
        yield np.frombuffer(b, np.uint8).reshape(h, w, 3)
    p.wait()

def exact_frames(clip, scale=None):
    n = int(round((clip["end"] - clip["start"]) * FPS))
    i, last = 0, None
    for f in read_frames(clip["start"], clip["end"], scale):
        if i >= n:
            break
        last = f
        yield f
        i += 1
    while i < n:
        yield last
        i += 1

def analyze(clip):
    """Detecta cortes y centro de cara por plano. Devuelve lista de (frame_ini, cx, cy, ancho_cara)."""
    sw, sh = 480, 270
    prev, cuts, faces = None, [0], {}
    for i, f in enumerate(exact_frames(clip, (sw, sh))):
        g = cv2.cvtColor(f, cv2.COLOR_RGB2GRAY)
        if prev is not None:
            hist_a = cv2.calcHist([g], [0], None, [32], [0, 256]); hist_b = cv2.calcHist([prev], [0], None, [32], [0, 256])
            diff = np.mean(cv2.absdiff(g, prev))
            if diff > 28 or cv2.compareHist(hist_a, hist_b, cv2.HISTCMP_CORREL) < 0.80:
                if i - cuts[-1] > 6:
                    cuts.append(i)
        prev = g
        if i % 3 == 0:
            gg = g[: int(sh * 0.80)]  # sin zócalo
            fs = list(CASCADE.detectMultiScale(gg, 1.1, 5, minSize=(18, 18)))
            if not fs:
                fs = list(PROFILE.detectMultiScale(gg, 1.1, 4, minSize=(18, 18)))
                fs += [(sw - x - w, y, w, h) for (x, y, w, h) in PROFILE.detectMultiScale(cv2.flip(gg, 1), 1.1, 4, minSize=(18, 18))]
            faces[i] = [(x + w / 2, y + h / 2, w) for (x, y, w, h) in fs]
    nframes = i + 1
    shots = []
    bounds = cuts + [nframes]
    for k in range(len(cuts)):
        a, b = bounds[k], bounds[k + 1]
        cands = [ff for j, fl in faces.items() if a <= j < b for ff in fl]
        override = None
        for ov in clip.get("frame", []):  # encuadre manual: [t_rel, cx_src, ancho_cara, cy]
            if a / FPS <= ov[0] < b / FPS:
                override = ov
        if override is not None:
            cx = override[1]
            fw = override[2] if len(override) > 2 else 250
            cy = override[3] if len(override) > 3 else 300
        elif cands:
            # agrupar detecciones por posición: gana la cara más constante del plano
            bins = {}
            for c in cands:
                bins.setdefault(int(c[0] // 25), []).append(c)
            groups = []
            for k in sorted(bins):
                if groups and k - groups[-1][0] <= 1:
                    groups[-1][1].extend(bins[k]); groups[-1][0] = k
                else:
                    groups.append([k, list(bins[k])])
            groups = [g[1] for g in groups]
            best = max(len(g) for g in groups)
            strong = [g for g in groups if len(g) >= best * 0.5]
            if len(strong) > 1:  # plano con dos personas: elegir lado
                side = clip.get("wide", "right")
                strong.sort(key=lambda g: np.median([c[0] for c in g]))
                pool = strong[-1] if side == "right" else strong[0]
            else:
                pool = max(groups, key=len)
            cx = float(np.median([c[0] for c in pool])) * SW / sw
            cy = float(np.median([c[1] for c in pool])) * SH / sh
            fw = float(np.median([c[2] for c in pool])) * SW / sw
        else:
            cx, cy, fw = 1010, 300, 120
        shots.append((a, cx, cy, fw))
    return shots, nframes

# ---------- composición ----------
def frame_clip(src, shot, rel, shot_len, zoom_base):
    a, cx, cy, fw = shot
    p = rel / max(shot_len, 1)
    z = zoom_base * (1.0 + 0.055 * p)  # empuje lento dentro de cada plano
    z *= float(np.clip(250 / max(fw, 1), 1.0, 1.7))  # plano general: acercar a la cara
    ch = SH / z
    cw = ch * 9 / 16
    x0 = np.clip(cx - cw / 2, 0, SW - cw)
    if fw >= 200 and cx >= 1030:
        x0 = min(max(x0, 790), SW - cw)
    y0 = np.clip(cy - ch * 0.30, 0, SH - ch)
    M = np.float32([[W / cw, 0, -x0 * W / cw], [0, H / ch, -y0 * H / ch]])
    return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_REFLECT)

DOF_CACHE = {}
def apply_dof(img, spec):
    key = json.dumps(spec)
    if key not in DOF_CACHE:
        cx, cy, rx, ry = spec["ellipse"]
        m = (((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2 < 1) | (yy > spec["ybot"])
        DOF_CACHE[key] = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 55)[..., None]
    mask = DOF_CACHE[key]
    small = cv2.resize(img, (W // 4, H // 4), interpolation=cv2.INTER_AREA)
    bg = cv2.resize(cv2.GaussianBlur(small, (0, 0), 9), (W, H), interpolation=cv2.INTER_LINEAR).astype(np.float32) * 0.30
    return (img.astype(np.float32) * mask + bg * (1 - mask)).astype(np.uint8)

LOGO_CACHE = {}
def logo_img(size, alpha=1.0):
    if size not in LOGO_CACHE:
        im = Image.open(LOGO).convert("RGBA").resize((size, size), Image.LANCZOS)
        arr = np.array(im).astype(np.float32)
        lum = arr[..., :3].mean(axis=2)
        a = arr[..., 3] * np.clip((200 - lum) / 120, 0, 1)  # trazos oscuros -> blancos
        out = np.zeros((size, size, 4), np.uint8)
        out[..., :3] = CREAM
        out[..., 3] = np.clip(a, 0, 255)
        LOGO_CACHE[size] = out
    out = LOGO_CACHE[size].copy()
    out[..., 3] = (out[..., 3] * alpha).astype(np.uint8)
    return out

STATIC = {}
def static_layers():
    if STATIC:
        return STATIC
    STATIC["kicker"] = text_layer([[("DESDE EL JARDÍN  ·  RADIO PAUTA", CREAM + (215,))]], font(SANS_SB, 26), None, track=3)
    return STATIC

def ease(x):
    x = min(max(x, 0), 1)
    return x * x * (3 - 2 * x)

def fade_layer(arr, a):
    if a >= 0.999:
        return arr
    o = arr.copy(); o[..., 3] = (o[..., 3] * a).astype(np.uint8); return o

def render():
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "veryfast" if PREVIEW else "slow", "-crf", "26" if PREVIEW else "19", "-maxrate", "16M", "-bufsize", "32M",
                            "-pix_fmt", "yuv420p", "-movflags", "+faststart", OUT], stdin=subprocess.PIPE)
    fi = 0
    st = static_layers()
    total = len(EDL["items"])
    for idx, it in enumerate(EDL["items"]):
        if it["type"] == "card":
            n = int(round(it["dur"] * FPS))
            fnt = font(SERIF_IT if it.get("italic") else SERIF_SB, it.get("size", 118))
            lines = [[(l, (ACCENT if l in it.get("accent", []) else CREAM) + (255,))] for l in it["lines"]]
            txt = text_layer(lines, fnt, None, spacing=1.08, shadow=False)
            sub = text_layer([[(it["sub"], (ACCENT if it.get("sub_accent") else CREAM) + (235,))]], font(SANS_SB, it.get("sub_size", 34)), None, shadow=False, track=3) if it.get("sub") else None
            sub2 = text_layer([[(it["sub2"], CREAM + (190,))]], font(SANS_M, it.get("sub2_size", 26)), None, shadow=False, track=3) if it.get("sub2") else None
            lg = it.get("logo")
            for k in range(n):
                t = k / FPS
                img = np.full((H, W, 3), 9, np.uint8)
                a = ease(t / 0.35) * ease((it["dur"] - t) / 0.30) if it.get("fade", True) else 1
                sc = 1 + 0.03 * k / n
                tl = cv2.resize(txt, None, fx=sc, fy=sc, interpolation=cv2.INTER_CUBIC)
                ty = int(H * it.get("y", 0.44) - tl.shape[0] / 2)
                if lg:
                    lgi = logo_img(300, a)
                    overlay(img, lgi, (W - 300) // 2, ty - 360)
                overlay(img, fade_layer(tl, a), (W - tl.shape[1]) // 2, ty)
                if sub is not None:
                    a2 = ease((t - 0.35) / 0.4) * ease((it["dur"] - t) / 0.30)
                    overlay(img, fade_layer(sub, a2), (W - sub.shape[1]) // 2, ty + tl.shape[0] + 24)
                    if sub2 is not None:
                        overlay(img, fade_layer(sub2, a2), (W - sub2.shape[1]) // 2, ty + tl.shape[0] + 24 + sub.shape[0] + 6)
                img = grade(img, fi, CARD_SHADE)
                enc.stdin.write(bars(img).tobytes()); fi += 1
            print(f"[{idx + 1}/{total}] placa", flush=True)
            continue

        shots, nfr = analyze(it)
        print(f"[{idx + 1}/{total}] clip {it['start']:.2f}-{it['end']:.2f} planos: " + ", ".join(f"{s[0] / FPS:.1f}s@x{s[1]:.0f}/w{s[3]:.0f}" for s in shots), flush=True)
        words = [dict(w, s=w["s"] - it["start"], e=w["e"] - it["start"]) for w in it["words"]]
        chunks = chunk_words(words)
        bounds = [s[0] for s in shots] + [nfr]
        lower = None
        if it.get("lower"):
            name, role = it["lower"]
            lower = (text_layer([[(name, CREAM + (255,))]], font(SERIF_SB, 50), None),
                     text_layer([[(role, ACCENT + (255,))]], font(SANS_SB, 24), None, track=2))
        clip_len = nfr / FPS
        for k, src in enumerate(exact_frames(it)):
            if k >= nfr:
                break
            si = max(j for j in range(len(shots)) if shots[j][0] <= k)
            img = frame_clip(src, shots[si], k - shots[si][0], bounds[si + 1] - shots[si][0], it.get("zoom", 1.0))
            dof = it.get("dof")
            if dof and shots[si][0] / FPS <= dof["t"] < bounds[si + 1] / FPS:
                img = apply_dof(img, dof)
            img = grade(np.ascontiguousarray(img), fi)
            t = k / FPS
            # entrada/salida suave
            fin = ease(t / 0.18) if it.get("fadein", True) else 1
            fout = ease((clip_len - t) / 0.18) if it.get("fadeout", True) else 1
            # crédito superior: primero el nombre, luego el programa
            la = ease((it.get("lower_dur", 4.2) - t) / 0.4) if lower else 0
            ka = 1 - (la if lower and t < it.get("lower_dur", 4.2) else 0)
            kk = st["kicker"]
            overlay(img, fade_layer(kk, ka), (W - kk.shape[1]) // 2, 92)
            if lower and t < it.get("lower_dur", 4.2):
                n_, r_ = lower
                overlay(img, fade_layer(n_, la), (W - n_.shape[1]) // 2, 44)
                overlay(img, fade_layer(r_, la), (W - r_.shape[1]) // 2, 112)
            # subtítulos
            for c in chunks:
                if c["s"] - 0.05 <= t < c["e"] + 0.05 or (c is chunks[-1] and t >= c["s"]):
                    active = -1
                    for wi, w in enumerate(c["words"]):
                        if t >= w["s"] - 0.03:
                            active = wi
                    cap = caption_img(c, active, None)
                    ca = ease((t - c["s"] + 0.05) / 0.12)
                    overlay(img, fade_layer(cap, ca), (W - cap.shape[1]) // 2, 1372)
                    spk = c["words"][0].get("spk")
                    if spk:
                        sl = text_layer([[(spk.upper(), CREAM + (170,))]], font(SANS_SB, 24), None, track=3)
                        overlay(img, fade_layer(sl, ca), (W - sl.shape[1]) // 2, 1330)
                    break
            if fin < 1 or fout < 1:
                img = (img.astype(np.float32) * min(fin, fout)).astype(np.uint8)
            enc.stdin.write(bars(img).tobytes()); fi += 1
    enc.stdin.close(); enc.wait()
    print("frames", fi, "dur", fi / FPS)

render()
