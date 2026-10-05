from pathlib import Path
import subprocess, re
from PIL import Image, ImageDraw
import imageio_ffmpeg
ff = imageio_ffmpeg.get_ffmpeg_exe()
root = Path(__file__).parent
out = root / 'qa'
out.mkdir(exist_ok=True)
files = sorted(Path('C:/Users/OPAKI/Downloads/Telegram Desktop').glob('video_2026-10-05_23-45-03*.mp4'))
for i,p in enumerate(files):
    info = subprocess.run([ff,'-i',str(p)],capture_output=True,text=True).stderr
    m = re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',info)
    dur = int(m[1])*3600+int(m[2])*60+float(m[3])
    print(i,p.name,dur,flush=True)
    sheet = Image.new('RGB',(1200,420),'#eee9df')
    d = ImageDraw.Draw(sheet)
    for j,frac in enumerate([.03,.22,.42,.62,.82,.95]):
        t = dur*frac
        dest = out / f'{i}-{j}.jpg'
        subprocess.run([ff,'-y','-ss',str(t),'-i',str(p),'-frames:v','1','-vf','scale=190:340:force_original_aspect_ratio=decrease',str(dest)],capture_output=True)
        im = Image.open(dest)
        sheet.paste(im,(j*200,40))
        d.text((j*200+5,10),f'{i} | {t:.1f}s',fill='black')
    sheet.save(out/f'sheet-{i}.jpg')
