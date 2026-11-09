import subprocess,sys,numpy as np
src,a,b=sys.argv[1],float(sys.argv[2]),float(sys.argv[3])
x=np.frombuffer(subprocess.run(["ffmpeg","-v","error","-ss",str(a),"-i",src,"-t",str(b-a),"-vn","-ac","1","-ar","16000","-f","f32le","-"],capture_output=True).stdout,np.float32)
n=320
for i in range(0,len(x)-n,n):
    r=np.sqrt(np.mean(x[i:i+n]**2)); print(f"{a+i/16000:.2f} {20*np.log10(r+1e-6):6.1f} "+"#"*max(0,int((20*np.log10(r+1e-6)+60)/1.5)))
