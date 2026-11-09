"""Audio del reel: voz de los tramos + música de ElevenLabs (bajo la voz, sube en placas) + golpe en cada placa.

Uso: python mix.py src.mp4 edl.json musica.mp3 impacto.mp3 out_mezcla.wav out_solo_voz.wav
"""
import json, subprocess, sys
import numpy as np

SRC, EDL, MUS, SFX, OUT_M, OUT_V = sys.argv[1], json.load(open(sys.argv[2])), sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[6]
SR = 48000
FPS = 30

def decode(path, start=None, dur=None, ch=2):
    cmd = ["ffmpeg", "-v", "error"]
    if start is not None:
        cmd += ["-ss", f"{start:.3f}"]
    cmd += ["-i", path]
    if dur is not None:
        cmd += ["-t", f"{dur:.3f}"]
    cmd += ["-vn", "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"]
    x = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).copy()
    return x.reshape(-1, ch)

def fade(x, fi, fo):
    n1, n2 = int(fi * SR), int(fo * SR)
    if n1: x[:n1] *= (np.linspace(0, 1, n1) ** 2)[:, None]
    if n2: x[-n2:] *= (np.linspace(1, 0, n2) ** 2)[:, None]
    return x

voice, marks = [], []
t = 0.0
for it in EDL["items"]:
    if it["type"] == "card":
        n = int(round(it["dur"] * FPS)) / FPS
        voice.append(np.zeros((int(round(n * SR)), 2), np.float32)); marks.append((t, "card", n, it))
    else:
        n = int(round((it["end"] - it["start"]) * FPS)) / FPS
        L = int(round(n * SR))
        x = decode(SRC, it["start"], n)
        x = np.pad(x, ((0, max(0, L - len(x))), (0, 0)))[:L]
        voice.append(fade(x, 0.06 if it.get("fadein", True) else 0.01, 0.12 if it.get("fadeout", True) else 0.01))
        marks.append((t, "clip", n, it))
    t += n
v = np.concatenate(voice)
N = len(v)
act = np.abs(v).max(axis=1) > 0.01
v *= 0.12 / np.sqrt(np.mean(v[act] ** 2))

m = decode(MUS)
m = np.pad(m, ((0, max(0, N - len(m))), (0, 0)))[:N]
m *= 0.12 / np.sqrt(np.mean(m ** 2) + 1e-9)  # mismo nivel RMS que la voz antes de ducking

# ducking: bajo la voz la música queda ~-17 dB; en placas, a nivel pleno; final abierto
env = np.full(N, 0.18, np.float32)
ramp = int(0.30 * SR)
for (t0, kind, dur, it) in marks:
    if kind != "card":
        continue
    a, z = int(t0 * SR), min(N, int((t0 + dur) * SR))
    lvl = 0.85 if it.get("logo") else 0.60
    env[a:z] = lvl
    env[max(0, a - ramp):a] = np.linspace(0.18, lvl, a - max(0, a - ramp))
    if z < N:
        e = min(N, z + ramp); env[z:e] = np.linspace(lvl, 0.18, e - z)
# suavizar el envolvente
k = int(0.05 * SR)
env = np.convolve(env, np.ones(k) / k, mode="same").astype(np.float32)
m = fade(m * env[:, None], 0.4, 1.2)

hit = decode(SFX)
hit *= 0.35 / (np.max(np.abs(hit)) + 1e-9)
fx = np.zeros_like(v)
for (t0, kind, dur, it) in marks:
    if kind == "card":
        i0 = max(0, int((t0 - 0.03) * SR)); e = min(N, i0 + len(hit))
        fx[i0:e] += hit[: e - i0]

def write(path, x):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-",
                    "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", str(SR), path], input=x.astype(np.float32).tobytes())

mix = v + m + fx
write(OUT_M, mix / max(1.0, np.max(np.abs(mix)) / 0.95))
write(OUT_V, v / max(1.0, np.max(np.abs(v)) / 0.95))
print("dur", N / SR)
