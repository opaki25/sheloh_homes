from pathlib import Path
import subprocess, shutil
import imageio_ffmpeg
from PIL import Image
root=Path(__file__).parent
out=root/'dist/assets'
ff=imageio_ffmpeg.get_ffmpeg_exe()
files=sorted(Path('C:/Users/OPAKI/Downloads/Telegram Desktop').glob('video_2026-10-05_23-45-03*.mp4'))
stills=[('living',1,8.3),('bedroom',1,4.7),('balcony',2,30),('bathroom',5,19.4),('dining',8,17.9),('warm-living',8,66.7),('romance',7,13.5),('kitchen',9,5.5),('cozy',10,1.8)]
for name,i,t in stills:
    subprocess.run([ff,'-y','-ss',str(t),'-i',str(files[i]),'-frames:v','1','-vf','scale=1080:-2','-q:v','2',str(out/f'{name}.jpg')],capture_output=True,check=True)
    im=Image.open(out/f'{name}.jpg')
    im.save(out/f'{name}.webp',quality=88)
    (out/f'{name}.jpg').unlink()
    print(name,im.size,flush=True)
for name,i,start,duration in [('tour-home',1,4.8,8.0),('tour-details',2,3.5,24),('tour-romance',7,0,16),('tour-kitchen',9,3.4,7.8)]:
    subprocess.run([ff,'-y','-ss',str(start),'-i',str(files[i]),'-t',str(duration),'-an','-vf','scale=540:-2','-c:v','libx264','-crf','25','-preset','fast','-movflags','+faststart',str(out/f'{name}.mp4')],capture_output=True,check=True)
    print(name,flush=True)
im=Image.open('C:/Users/OPAKI/AppData/Local/Temp/codex-clipboard-4dc29ed6-de58-4dd2-9b9d-bf91ea178af9.jpg')
im.resize((640,640)).save(out/'logo.webp',quality=92)
im.crop((240,65,660,600)).resize((128,163)).save(out/'mark.png')
