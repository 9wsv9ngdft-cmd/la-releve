# Images « sang » générées à partir des images du jeu
import sys, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
M = sys.argv[1]; random.seed(4)

def blood_layer(size, draw_fn, blur=3):
    mask = Image.new('L', size, 0); d = ImageDraw.Draw(mask); draw_fn(d)
    mask = mask.filter(ImageFilter.GaussianBlur(blur)).point(lambda v: 255 if v > 110 else int(v*1.6))
    return mask.filter(ImageFilter.GaussianBlur(1.2))

def apply(im, mask, color=(78, 4, 6), shine=True):
    # texture irrégulière : le sang n'est pas uniforme
    tex = Image.effect_noise(im.size, 60).filter(ImageFilter.GaussianBlur(2)).point(lambda v: 120 + v//2)
    mask = ImageChops.multiply(mask, tex.point(lambda v: min(255, v + 60)))
    lum = im.convert('L').point(lambda v: 40 + v*0.55)
    dark = Image.merge('RGB', (lum.point(lambda v: int(v*.62)), lum.point(lambda v: int(v*.06)), lum.point(lambda v: int(v*.07))))
    out = Image.composite(dark, im, mask.point(lambda v: int(v*.92)))
    if shine:  # petits reflets humides
        hl = mask.filter(ImageFilter.FIND_EDGES).point(lambda v: int(v*.25))
        out = Image.composite(Image.new('RGB', im.size, (190, 120, 120)), out, hl)
    return out

def hand(d, cx, cy, s, ang):
    pts = []
    def rot(x, y): c, si = math.cos(ang), math.sin(ang); return (cx + (x*c - y*si)*s, cy + (x*si + y*c)*s)
    for k in range(6):   # traînée vers le bas
        off = k*9
        poly = [rot(-36, -10+off), rot(36, -10+off), rot(40, 50+off), rot(-34, 55+off)]
        d.polygon(poly, fill=255)
        for fx, fl in [(-30, 55), (-12, 72), (6, 76), (24, 66)]:
            x0, y0 = rot(fx, -10+off); x1, y1 = rot(fx, -10-fl+off)
            d.line([(x0, y0), (x1, y1)], fill=255, width=int(13*s))
        x0, y0 = rot(38, 25+off); x1, y1 = rot(70, -5+off); d.line([(x0, y0), (x1, y1)], fill=255, width=int(14*s))

def drips(d, x0, x1, y0, n, maxlen):
    for _ in range(n):
        x = random.uniform(x0, x1); w = random.uniform(2, 7); L = random.uniform(maxlen*.3, maxlen)
        d.line([(x, y0), (x + random.uniform(-3, 3), y0 + L)], fill=255, width=int(w))
        d.ellipse([x-w, y0+L-w, x+w, y0+L+w*1.4], fill=255)

# 16 — porte de la salle 14 : main ensanglantée qui glisse + coulures
im = Image.open(f'{M}/cam_s14.jpg').convert('RGB')
def porte(d):
    hand(d, 352, 600, 0.62, -0.18)
    drips(d, 320, 390, 610, 9, 180)
    for _ in range(40):
        x, y = random.gauss(360, 45), random.gauss(560, 70); r = random.uniform(1.5, 4.5); d.ellipse([x-r, y-r, x+r, y+r], fill=255)
mask = blood_layer(im.size, porte, 2.5)
out = apply(im, mask)
ImageEnhance.Brightness(out).enhance(.9).save(f'{M}/16_sang_porte.jpg', quality=86)

# 17 — couloir : traînée de sang au sol jusqu'au fond (pour les mauvaises fins)
im = Image.open(f'{M}/01_couloir.jpg').convert('RGB')
W, H = im.size
def trainee(d):
    for i in range(140):
        t = i/140; y = H*0.98 - t*(H*0.98 - H*0.60); x = W*0.47 + math.sin(t*5)*30*(1-t)
        if random.random() < .18: continue
        w = (1-t)*55 + 5 + random.uniform(-10, 10)*(1-t)
        w = max(w, 4); jx = random.uniform(-9, 9); d.ellipse([x-w/2 + jx, y-4, x+w/2 + jx, y+4], fill=255)
    for _ in range(70):
        t = random.random(); y = H*0.98 - t*(H*0.98 - H*0.60); x = W*0.47 + random.gauss(0, (1-t)*70+6); r = random.uniform(2, 9)*(1-t*.6)
        d.ellipse([x-r, y-r*.6, x+r, y+r*.6], fill=255)
mask = blood_layer(im.size, trainee, 3)
out = apply(im, mask, (60, 2, 4))
ImageEnhance.Brightness(out).enhance(.8).save(f'{M}/17_trainee.jpg', quality=86)
