# Médias PROVISOIRES de la v2.5 (en attendant les vrais visuels et enregistrements du kit).
# Usage : python3 gen/provisoires.py medias
# Écrit dans medias/provisoire/. Le jeu charge d'abord le fichier final (nom du kit, dans medias/),
# et ne prend le provisoire que si le final est absent.
import sys, os, subprocess, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps, ImageFont
from scipy.signal import butter, lfilter

M = sys.argv[1]
OUT = os.path.join(M, 'provisoire'); os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(42)

# =====================================================================
# IMAGES
# =====================================================================
def frame(t, path):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', f'{M}/08_video_couloir.mp4',
                    '-frames:v', '1', '-q:v', '2', path], check=True)

def silhouette(im, cx, top, h, blur=6, opacity=0.42, tone=(5, 5, 7)):
    """Silhouette humaine sombre, floue, sans ombre (ni reflet d'yeux)."""
    k = h / 200.0
    mask = Image.new('L', im.size, 0); d = ImageDraw.Draw(mask)
    hw = 17 * k
    d.ellipse([cx - hw, top, cx + hw, top + 42 * k], fill=255)
    d.polygon([(cx - 12 * k, top + 38 * k), (cx + 12 * k, top + 38 * k), (cx + 36 * k, top + 66 * k),
               (cx + 40 * k, top + h), (cx - 40 * k, top + h), (cx - 36 * k, top + 66 * k)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(blur))
    alpha = mask.point(lambda v: int(v * opacity))
    return Image.composite(Image.new('RGB', im.size, tone), im, alpha)

def cctv(im, box, size=(960, 720), green=True):
    """Transforme une photo en flux de caméra : N&B gris-vert, basse définition, bruit."""
    im = im.crop(box).convert('L')
    im = ImageEnhance.Contrast(im).enhance(1.25)
    im = im.resize((size[0] // 3, size[1] // 3)).resize(size, Image.BILINEAR)
    a = np.asarray(im).astype(np.float32)
    a += rng.normal(0, 13, a.shape)
    a = np.clip(a, 0, 255)
    if green:
        rgb = np.stack([a * 0.82, a * 0.97, a * 0.84], -1)
    else:
        rgb = np.stack([a, a, a], -1)
    # léger effet « fish-eye » : vignette
    yy, xx = np.mgrid[0:size[1], 0:size[0]]
    r = np.sqrt(((xx - size[0] / 2) / size[0]) ** 2 + ((yy - size[1] / 2) / size[1]) ** 2)
    rgb *= np.clip(1.15 - r * 1.1, 0.25, 1)[..., None]
    return Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))

def save_jpg(im, name, q=82):
    im.save(f'{OUT}/{name}', quality=q, optimize=True)

# --- Ch. 4 : paire vitre (même image source, au pixel près) ---
frame(3, '/tmp/v3.jpg')
base = Image.open('/tmp/v3.jpg').convert('RGB')
base = ImageEnhance.Brightness(base).enhance(0.78).filter(ImageFilter.GaussianBlur(0.8))
save_jpg(base, 'vitre_vide.jpg')
save_jpg(silhouette(base, 470, 560, 330, blur=8, opacity=0.40), 'vitre_silhouette.jpg')

# --- CAM 01 : couloir principal (vide / silhouette) ---
c = Image.open(f'{M}/01_couloir.jpg').convert('RGB')
c_sil = silhouette(c, 300, 560, 200, blur=4, opacity=0.70)
box = (0, 370, 720, 910)
save_jpg(cctv(c, box), 'cam01_couloir_vide.jpg')
save_jpg(cctv(c_sil, box), 'cam01_couloir_silhouette.jpg')

# --- CAM 02 : couloir de service (vide / silhouette) ---
s = Image.open(f'{M}/cam_service.jpg').convert('RGB')
s_sil = silhouette(s, 520, 470, 330, blur=5, opacity=0.75)
box = (0, 300, 720, 840)
save_jpg(cctv(s, box), 'cam02_service_vide.jpg')
save_jpg(cctv(s_sil, box), 'cam02_service_silhouette.jpg')

# --- CAM 03 : grille S.14 (vide / silhouette / collée à l'objectif) ---
g = Image.open(f'{M}/cam_s14.jpg').convert('RGB')
box = (0, 330, 720, 870)
save_jpg(cctv(g, box), 'cam03_grille_vide.jpg')
save_jpg(cctv(silhouette(g, 215, 470, 300, blur=5, opacity=0.72), box), 'cam03_grille_s14.jpg')
o = ImageEnhance.Brightness(g).enhance(0.5)
o = silhouette(o, 360, 300, 1300, blur=26, opacity=0.93, tone=(3, 3, 4))
save_jpg(cctv(o, box), 'cam03_objectif.jpg')

# --- Ch. 8 : traînée de sang SÈCHE (brun-noir mat) + badge J-732 ---
t = Image.open(f'{M}/17_trainee.jpg').convert('RGB')
a = np.asarray(t).astype(np.float32)
sat = a[..., 0] - np.maximum(a[..., 1], a[..., 2])
w = np.clip((sat - 4) / 22, 0, 1)[..., None]          # masque doux du rouge
lum = a.mean(axis=2, keepdims=True) / 255.0
dry = np.array([34, 22, 16]) * (0.6 + lum)              # brun-noir mat
a = a * (1 - w) + dry * w
t = Image.fromarray(a.astype(np.uint8))
badge = Image.new('RGBA', (170, 110), (0, 0, 0, 0)); bd = ImageDraw.Draw(badge)
bd.rounded_rectangle([0, 0, 169, 109], 12, fill=(214, 214, 208, 255), outline=(150, 150, 145, 255), width=2)
bd.rectangle([10, 14, 60, 74], fill=(120, 124, 128, 255))
try:
    f1 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
    f2 = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except Exception:
    f1 = f2 = ImageFont.load_default()
bd.text((70, 26), 'J-732', fill=(15, 15, 15, 255), font=f1)
bd.text((70, 64), 'ARCHIVES NORD', fill=(40, 40, 40, 255), font=f2)
bd.text((12, 84), 'VASSEUR J.', fill=(40, 40, 40, 255), font=f2)
badge = badge.rotate(-18, expand=True, resample=Image.BICUBIC)
t.paste(badge, (395, 1060), badge)
d = ImageDraw.Draw(t); d.line([(445, 1062), (430, 990), (400, 930)], fill=(12, 12, 12), width=6)
t = ImageEnhance.Brightness(t).enhance(0.95)
save_jpg(t, 'trainee_sang_vasseur.jpg')

# =====================================================================
# SONS (numpy -> wav -> mp3, crête plafonnée à -6 dBFS)
# =====================================================================
SR = 44100
def T(sec): return np.arange(int(sec * SR)) / SR
def db(x, d): return x * 10 ** (d / 20)
def norm(x, peak=-6):
    m = np.max(np.abs(x)); return x if m == 0 else x / m * 10 ** (peak / 20)
def bp(x, lo, hi, order=4):
    b, a = butter(order, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = butter(order, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = butter(order, f / (SR / 2), 'high'); return lfilter(b, a, x)
def interphone(x):
    y = lp(hp(x, 300, 4), 3200, 4)
    # compression simple
    env = lp(np.abs(y), 30, 1) + 1e-6
    thr = 10 ** (-18 / 20) * np.max(env)
    g = np.where(env > thr, (thr + (env - thr) / 4) / env, 1.0)
    y = y * g
    return y + db(np.sin(2 * np.pi * 50 * T(len(x) / SR)) + 0.5 * np.sin(2 * np.pi * 100 * T(len(x) / SR)), -38) \
             + db(lp(rng.standard_normal(len(x)), 4000), -44)
def babble(sec, rate=4.2, level=-14):
    """Voix provisoire : babillage formantique, assez proche d'une parole étouffée."""
    n = int(sec * SR); out = np.zeros(n); src = rng.standard_normal(n)
    # voix (impulsions glottiques ~120 Hz) + souffle
    f0 = 118 + 10 * np.sin(2 * np.pi * 0.7 * T(sec))
    ph = np.cumsum(f0 / SR); glott = (np.mod(ph, 1) < 0.08).astype(float) * 2 - 0.16
    exc = glott + 0.25 * src
    seg = int(SR / rate); i = 0
    vowels = [(730, 1090), (270, 2290), (300, 870), (530, 1840), (570, 840), (440, 1020), (660, 1700)]
    while i < n:
        L = int(seg * rng.uniform(0.6, 1.4)); f1, f2 = vowels[rng.integers(len(vowels))]
        e = exc[i:i + L]
        y = bp(e, f1 * 0.8, f1 * 1.25, 2) + 0.6 * bp(e, f2 * 0.85, f2 * 1.18, 2)
        env = np.sin(np.linspace(0, np.pi, len(y))) ** 0.8
        if rng.random() < 0.18: env *= 0.05      # petites pauses
        out[i:i + len(y)] += y * env; i += L
    return db(norm(out, 0), level)
def breath(sec, rate=0.35, level=-24):
    n = rng.standard_normal(int(sec * SR)); n = bp(n, 400, 2600, 2)
    tt = T(sec); env = np.clip(np.sin(2 * np.pi * rate * tt), 0, None) ** 1.6 + 0.3 * np.clip(-np.sin(2 * np.pi * rate * tt), 0, None) ** 2
    return db(norm(n * env, 0), level)
def step(level=-14):
    tt = T(0.35); s = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 28) + 0.35 * lp(rng.standard_normal(len(tt)), 1800) * np.exp(-tt * 40)
    return db(norm(s, 0), level)
def knock(level=-10):
    tt = T(0.4); s = np.sin(2 * np.pi * 95 * tt) * np.exp(-tt * 22) + 0.5 * bp(rng.standard_normal(len(tt)), 200, 1500) * np.exp(-tt * 30)
    return db(norm(s, 0), level)
def click(level=-12, f=3200):
    tt = T(0.06); s = bp(rng.standard_normal(len(tt)), f * 0.6, f * 1.4) * np.exp(-tt * 120)
    return db(norm(s, 0), level)
def metal_lock(level=-12):
    tt = T(0.5); s = sum(np.sin(2 * np.pi * fr * tt) * np.exp(-tt * k) for fr, k in [(410, 18), (1230, 25), (2100, 35)])
    s += 0.6 * bp(rng.standard_normal(len(tt)), 800, 5000) * np.exp(-tt * 80)
    return db(norm(s, 0), level)
def bang(level=-6):
    tt = T(1.6)
    thump = np.sin(2 * np.pi * 55 * tt * (1 - 0.25 * tt)) * np.exp(-tt * 6)
    nz = rng.standard_normal(len(tt)) * np.exp(-tt * 25)
    ring = sum(np.sin(2 * np.pi * fr * tt) * np.exp(-tt * k) for fr, k in [(311, 3), (523, 4), (797, 5), (1187, 6)])
    x = 0.9 * thump + 0.6 * nz + 0.25 * ring
    out = x.copy()
    for dl, gg in [(0.09, 0.45), (0.21, 0.3), (0.37, 0.18)]:
        k = int(dl * SR); out[k:] += gg * x[:-k]
    return norm(np.tanh(out * 2.5), level)
def glass(level=-6):
    tt = T(2.0); x = rng.standard_normal(len(tt)) * np.exp(-tt * 5)
    x = hp(x, 2500, 2) * 0.8; x = mix(x, bang(-8), 0)
    for _ in range(25):
        k = int(rng.uniform(0.05, 1.4) * SR); fr = rng.uniform(3000, 9000)
        L = int(0.15 * SR); seg = np.sin(2 * np.pi * fr * T(0.15)) * np.exp(-T(0.15) * 30)
        x[k:k + L] += 0.3 * seg[:len(x[k:k + L])]
    return norm(x, level)
def bip(level=-14, f=1000, d=0.25):
    tt = T(d); return db(np.sin(2 * np.pi * f * tt) * np.minimum(1, (d - tt) * 50), level)
def mix(base, clip, at):
    k = int(at * SR); end = min(len(base), k + len(clip)); base[k:end] += clip[:end - k]; return base
def pan(x, p):  # p : -1 gauche, 0 centre, +1 droite (puissance constante)
    a = (np.asarray(p) + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)], -1)
def save(x, name, peak=-6, br='160k'):
    x = norm(np.asarray(x, dtype=np.float64), peak)
    ch = 1 if x.ndim == 1 else 2
    wav = f'/tmp/{name}.wav'
    with wave.open(wav, 'w') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', br, f'{OUT}/{name}.mp3'], check=True)

def silence(sec): return np.zeros(int(sec * SR))

# Audio 0 — Léo, phrase d'ancrage (14 s) : PROVISOIRE (babillage filtré)
x = silence(14); x = mix(x, click(-14, 2500), 0.2)
x = mix(x, babble(11.3, 4.4, -12), 1.5); x[int(13 * SR):] = 0
save(interphone(x), 'audio0_leo_ancrage')

# Audio 1 — archive Vasseur 19h40 (24 s)
x = silence(24); x = mix(x, click(-14, 2200), 0.05)
x = mix(x, breath(3, 1.2, -20), 0.1)
for t0 in (0.6, 1.0, 1.5): x = mix(x, step(-16), t0)
x = mix(x, knock(-8), 2.1); x = mix(x, knock(-8), 2.5)
x = mix(x, babble(5, 5.5, -9), 3.0)
x = mix(x, metal_lock(-10), 8.4)
x = mix(x, babble(2, 3.0, -20), 10.0)
x = mix(x, bang(-9)[:int(1.2 * SR)], 12.1)
x = mix(x, db(lp(rng.standard_normal(int(4 * SR)), 900), -40), 14)
x = mix(x, step(-10), 18.4)
x = mix(x, babble(2.2, 2.4, -11), 20.4)
x = mix(x, bip(-12, 880, 0.3), 23.4)
xs = np.stack([interphone(x)] * 2, -1)
save(xs, 'audio1_vasseur_1940')

# Audio 2 — l'appel impossible (26 s), fin 100 % droite
x = silence(26); xs = np.zeros((len(x), 2))
mono = interphone(mix(mix(silence(26), breath(3, 0.25, -22), 0), babble(5, 3.6, -12), 3.0))
xs += pan(mono, 0)
for i, t0 in enumerate((11.2, 12.6)):
    xs = mix(xs, pan(step(-14), -0.8 + 1.6 * i), t0)
v2 = interphone(babble(5, 3.4, -11)); xs = mix(xs, pan(v2, np.linspace(0.4, 1, len(v2))), 15)
nail = click(-10, 4500); xs = mix(xs, pan(nail, 1), 22.3); xs = mix(xs, pan(breath(1.2, 1.1, -20), 1), 22.6)
xs = mix(xs, pan(bip(-12, 600, 0.4), 0), 25.3)
save(xs, 'audio2_appel_faux_leo')

# Audio 3 — les 22 secondes en binaural
xs = np.zeros((int(22 * SR), 2))
xs = mix(xs, pan(step(-20), -1), 3.0)
for i in range(5):
    t0 = 4.0 + i * 1.2; p = -1 + i * 0.5
    xs = mix(xs, pan(step(-19 + i), p), t0)
hnd = np.concatenate([db(bp(rng.standard_normal(int(0.9 * SR)), 300, 1600) * np.linspace(0, 1, int(0.9 * SR)), -30),
                      metal_lock(-22), db(bp(rng.standard_normal(int(0.4 * SR)), 300, 1400), -34)])
xs = mix(xs, pan(hnd, 0.85), 14.2)
br_ = breath(2.6, 0.38, -16); br_[int(1.4 * SR):] *= np.linspace(1, 0, len(br_) - int(1.4 * SR))
xs = mix(xs, pan(br_, 1), 16.2)
for i, t0 in enumerate((19.3, 20.6)): xs = mix(xs, pan(step(-20 - 4 * i), 1), t0)
save(xs, 'audio3_binaural_22s', peak=-12)
save(np.stack([glass(-6)] * 2, -1), 'audio3_echec')

# Audio 4 — bruit domestique : 100 % canal droit, sans filtre
po = silence(3); po = mix(po, db(bp(rng.standard_normal(int(0.8 * SR)), 500, 3000) * np.linspace(0.2, 1, int(0.8 * SR)), -30), 0.4)
po = mix(po, metal_lock(-20), 1.2); po = mix(po, click(-24, 2600), 1.9)
save(pan(po, 1), 'audio4_poignee', peak=-18)
def creak(level=-18):
    tt = T(0.5); f = 180 + 120 * np.sin(2 * np.pi * 3 * tt)
    s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (rng.random(len(tt)) > 0.6)
    return db(norm(bp(s, 300, 2500) * np.sin(np.linspace(0, np.pi, len(tt))), 0), level)
pq = silence(3); pq = mix(pq, creak(), 0.3); pq = mix(pq, creak(), 1.8)
save(pan(pq, 1), 'audio4_parquet', peak=-18)

# Audio 5 secours — voix de Léo reconstruite (9 s)
x = silence(9); x = mix(x, db(lp(rng.standard_normal(int(1.5 * SR)), 3000), -40), 0)
x = mix(x, babble(1.6, 4, -12), 1.5); x = mix(x, babble(1.0, 4, -12), 4.6); x = mix(x, babble(0.7, 4, -12), 6.6)
x[int(7.3 * SR):] = 0
save(interphone(x), 'audio5_secours')

# Fin 4 — 3 s de souffle, coupé net
save(breath(3, 0.6, -10), 'audio_fin4_souffle')
# Ch. 7 — vocal presque inaudible, coup sec, obturateur
x = db(lp(rng.standard_normal(int(9 * SR)), 2500), -50) + breath(9, 0.3, -36) + babble(9, 2.5, -40)
save(x, 'ch7_vocal_inaudible', peak=-28)
save(np.stack([bang(-6)] * 2, -1), 'ch7_coup_sec')
sh = np.concatenate([click(-8, 2400), silence(0.07), click(-10, 1800)]); save(sh, 'ch7_obturateur', peak=-10)
# Fin 3 — choc plein écran
save(np.stack([bang(-6)] * 2, -1), 'fin3_choc')
# Fin 1 — un dernier pas, oreille droite
save(pan(np.concatenate([silence(0.2), step(-14), silence(0.5)]), 1), 'fin1_pas_droite', peak=-16)

# Copies normalisées (-6 dBFS) des vocaux v1 réutilisés
for src, dst in [('03_vocal_bruits.mp3', 'ch4_coups.mp3'), ('fin_echec.mp3', 'fin3_echec.mp3')]:
    out = subprocess.run(['ffmpeg', '-i', f'{M}/{src}', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    mx = float([l for l in out.splitlines() if 'max_volume' in l][0].split()[-2])
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{M}/{src}', '-af', f'volume={-6 - mx}dB',
                    '-codec:a', 'libmp3lame', '-b:a', '128k', f'{OUT}/{dst}'], check=True)
print('ok')
