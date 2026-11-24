# Sons de sursaut synthétisés (numpy -> wav -> mp3)
import sys, subprocess, numpy as np
OUT = sys.argv[1]; SR = 44100
rng = np.random.default_rng(7)
def t(sec): return np.arange(int(sec*SR))/SR
def lp(x, a):  # passe-bas simple
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x): acc += a*(v-acc); y[i] = acc
    return y
def brown(sec):
    w = rng.standard_normal(int(sec*SR)); b = np.cumsum(w); b -= lp(b, 0.0005); return b/np.max(np.abs(b))
def db(x, d): return x * 10**(d/20)
def breathing(sec, rate=0.28, level=-30):
    n = rng.standard_normal(int(sec*SR)); n = lp(n, 0.08) - lp(n, 0.01)
    env = np.clip(np.sin(2*np.pi*rate*t(sec)), 0, None)**1.5 + 0.35*np.clip(-np.sin(2*np.pi*rate*t(sec)), 0, None)**2
    x = n*env; return db(x/np.max(np.abs(x)), level)
def bang(level=-2):
    d = 2.2; tt = t(d)
    thump = np.sin(2*np.pi*55*tt*(1-0.25*tt)) * np.exp(-tt*6)
    noise = rng.standard_normal(len(tt)) * np.exp(-tt*25)
    ring = sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*k) for f, k in [(311,3),(523,4),(797,5),(1187,6),(1733,8)])
    x = 0.9*thump + 0.6*noise + 0.25*ring
    # écho de couloir
    out = x.copy()
    for dl, g in [(0.09,0.45),(0.21,0.3),(0.37,0.18)]:
        k = int(dl*SR); out[k:] += g*x[:-k]
    out = np.tanh(out*2.5); return db(out/np.max(np.abs(out)), level)
def static(sec, level=-14):
    n = rng.standard_normal(int(sec*SR)); n *= (rng.random(len(n)) > 0.3)
    return db(n/np.max(np.abs(n)), level)
def steps(n=4, gap=0.55, level=-18):
    parts = []
    for i in range(n):
        tt = t(gap); s = np.sin(2*np.pi*70*tt)*np.exp(-tt*30) + 0.3*rng.standard_normal(len(tt))*np.exp(-tt*60)
        parts.append(db(s/np.max(np.abs(s)), level + 3*i))
    return np.concatenate(parts)
def mix(base, clip, at):
    k = int(at*SR); end = min(len(base), k+len(clip)); base[k:end] += clip[:end-k]; return base
def save(x, name):
    x = np.clip(x, -1, 1); wav = f'/tmp/{name}.wav'
    import wave
    with wave.open(wav, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x*32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg','-v','error','-y','-i',wav,'-codec:a','libmp3lame','-q:a','3',f'{OUT}/{name}.mp3'], check=True)

# 13 — vocal « écoute… » : presque rien pendant 11 s, puis BANG
d = 13.5; x = db(brown(d), -46) + breathing(d, 0.3, -36)
x = mix(x, steps(3, 0.7, -30), 6.0)
x = mix(x, bang(-1.5), 10.6)
x[int(12.4*SR):] = 0; x = mix(x, static(0.6, -16), 12.4)
save(x, '13_vocal_ecoute')

# 14 — audio à jouer pendant l'appel WhatsApp : respiration proche, pas, coup, grésillement
d = 21.0; x = db(brown(d), -42) + breathing(d, 0.45, -22)
x = mix(x, steps(5, 0.6, -24), 9.0)
x = mix(x, bang(-1.5), 13.2)
x = mix(x, static(2.5, -12), 15.0)
x[int(17.5*SR):] = 0
save(x[:int(17.6*SR)], '14_appel_souffle')
