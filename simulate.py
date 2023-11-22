#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import logging
import time
from PIL import Image,ImageDraw,ImageFont
from datetime import datetime

picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
logging.basicConfig(level=logging.DEBUG)

days = ["Monday", "Tuesday", "Wednesday", 
        "Thursday", "Friday", "Saturday", "Sunday"] 
months = ["Januaray", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]

try:
    logging.info("start")
    logging.info("init and Clear")
    
    font24 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 24)
    font18 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 18)
    font35 = ImageFont.truetype(os.path.join(picdir, 'Font.ttc'), 35)
    
    # Drawing on the Horizontal image
    #logging.info("1.Drawing on the Horizontal image...")
    Himage = Image.new('1', (400, 300), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(Himage)
    time = datetime.now()
    draw.text((0, 0), f"{time.day} {months[time.month - 1]}", font = font35, fill = 0)
    draw.text((0, 40), f"{days[time.weekday()]}", font = font24, fill = 0)
    bmp = Image.open(os.path.join(picdir, 'sun.bmp'))
    Himage.paste(bmp, (272, 0))
    Himage.show()

except IOError as e:
    logging.info(e)
    
except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    exit()
