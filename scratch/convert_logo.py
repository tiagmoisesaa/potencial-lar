import os
from PIL import Image

src = r"C:\Users\Tiago Moises\.gemini\antigravity\brain\596ecaff-7182-427d-b082-eb24b0b84ca2\media__1780509613614.png"
dest = r"c:\Users\Tiago Moises\Documents\site deposito\images\elephant-logo.png"

# Open image and convert to RGBA
img = Image.open(src).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # If the pixel is pure white or very near white, make it transparent
    if item[0] >= 254 and item[1] >= 254 and item[2] >= 254:
        newData.append((255, 255, 255, 0))
    else:
        newData.append(item)

img.putdata(newData)

# Crop the excess whitespace around the elephant
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

# Save the resulting image
os.makedirs(os.path.dirname(dest), exist_ok=True)
img.save(dest, "PNG")
print("Successfully converted and replaced the elephant logo!")
