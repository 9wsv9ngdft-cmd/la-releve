# Génère les images "peur" à partir de la vidéo fournie
import sys, subprocess
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
V, OUT = sys.argv[1], sys.argv[2]
def frame(t, path):
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',V,'-frames:v','1','-q:v','2',path],check=True)

# 11 — photo "par la fente" avec silhouette au fond du couloir
frame(3, '/tmp/s3.jpg')
im = Image.open('/tmp/s3.jpg').convert('RGB')
mask = Image.new('L', im.size, 0); d = ImageDraw.Draw(mask)
cx, top = 292, 588
d.ellipse([cx-17, top, cx+17, top+42], fill=255)                      # tête
d.polygon([(cx-12,top+38),(cx+12,top+38),(cx+36,top+66),(cx+40,top+200),(cx-40,top+200),(cx-36,top+66)], fill=255)  # épaules/corps
d.polygon([(cx-36,top+66),(cx-46,top+150),(cx-38,top+152),(cx-28,top+80)], fill=255)  # bras
mask = mask.filter(ImageFilter.GaussianBlur(5))
dark = Image.new('RGB', im.size, (6,6,8))
alpha = mask.point(lambda v: int(v*0.82))
im = Image.composite(dark, im, alpha)
e = ImageDraw.Draw(im)
for ex in (cx-7, cx+6): e.ellipse([ex-1.5, top+16, ex+1.5, top+19], fill=(150,150,140))  # reflets des yeux
im = ImageEnhance.Brightness(im).enhance(0.78)
im = im.filter(ImageFilter.GaussianBlur(0.8))
im.save(f'{OUT}/11_photo_silhouette.jpg', quality=82)

# Photo de profil "noire" (zoom sur la silhouette, très sombre)
p = im.crop((cx-150, top-90, cx+150, top+210)).resize((640,640))
p = ImageEnhance.Brightness(p).enhance(0.45)
p.save(f'{OUT}/15_profil_noir.jpg', quality=85)

# Base de la porte personnalisée (le prénom est gravé par la console)
frame(6.5, '/tmp/d65.jpg')
Image.open('/tmp/d65.jpg').save(f'{OUT}/12_porte_base.jpg', quality=88)
