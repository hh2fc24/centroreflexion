"""Portada del reel. Uso: python cover.py src.mp4 out.jpg logo.png t kicker linea1 linea2"""
import sys, numpy as np, cv2, subprocess
from PIL import Image, ImageDraw, ImageFont
src,out,logo,T,KICK,L1,L2=sys.argv[1:8]
W,H=1080,1920
b=subprocess.run(["ffmpeg","-v","error","-ss",T,"-i",src,"-frames:v","1","-f","rawvideo","-pix_fmt","rgb24","-"],capture_output=True).stdout
f=np.frombuffer(b,np.uint8).reshape(1080,1920,3)
ch=1080/1.04; cw=ch*9/16; cx=1052; x0=cx-cw/2; y0=0
M=np.float32([[W/cw,0,-x0*W/cw],[0,H/ch,-y0*H/ch]])
img=cv2.warpAffine(f,M,(W,H),flags=cv2.INTER_LANCZOS4).astype(np.float32)
yy=np.mgrid[0:H,0:W][0].astype(np.float32)
shade=1-np.clip((yy-H*0.46)/(H*0.27),0,1)**1.2
hsv=cv2.cvtColor(np.clip(img,0,255).astype(np.uint8),cv2.COLOR_RGB2HSV).astype(np.float32); hsv[...,1]*=0.80
img=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2RGB).astype(np.float32)
x_=np.arange(256)/255.0; lut=np.clip(x_+0.16*np.sin((x_-0.5)*np.pi)*(1-np.abs(2*x_-1)),0,1)
img=np.uint8(lut[img.astype(np.uint8)]*255).astype(np.float32)
img=np.clip(img*0.92*shade[...,None],0,255).astype(np.uint8)
im=Image.fromarray(img).convert("RGBA"); d=ImageDraw.Draw(im)
CREAM=(248,243,234); ACC=(226,150,92)
fq=ImageFont.truetype("/Library/Fonts/SourceSerifPro-SemiBoldItalic.ttf",112)
fs=ImageFont.truetype("/Library/Fonts/IBMPlexSans-SemiBold.ttf",30)
fn=ImageFont.truetype("/Library/Fonts/SourceSerifPro-SemiBold.ttf",50)
def ctext(y,t,fnt,col,track=0):
    w=sum(fnt.getlength(c)+track for c in t)-track; x=(W-w)/2
    for c in t: d.text((x,y),c,font=fnt,fill=col); x+=fnt.getlength(c)+track
ctext(1010,KICK,fs,ACC+(255,),3)
ctext(1090,L1,fq,CREAM); ctext(1215,L2,fq,ACC)
d.rectangle([(W-120)/2,1380,(W+120)/2,1384],fill=ACC)
ctext(1420,"Juan Carlos Rauld",fn,CREAM)
ctext(1490,"DESDE EL JARDÍN · RADIO PAUTA",fs,CREAM+(200,),3)
lg=Image.open(logo).convert("RGBA").resize((150,150),Image.LANCZOS); a=np.array(lg).astype(np.float32)
alpha=a[...,3]*np.clip((200-a[...,:3].mean(2))/120,0,1); L=np.zeros((150,150,4),np.uint8); L[...,:3]=CREAM; L[...,3]=alpha.astype(np.uint8)
im.alpha_composite(Image.fromarray(L),((W-150)//2,1580))
im.convert("RGB").save(out,quality=92)
