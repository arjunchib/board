#!/usr/bin/python
# -*- coding:utf-8 -*-
import sys
import os
import logging
from waveshare_epd import epd4in2
from PIL import Image,ImageDraw,ImageFont
import traceback
from datetime import datetime

picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
logging.basicConfig(level=logging.DEBUG)

try:
    logging.info("start")
    
    epd = epd4in2.EPD()
    logging.info("init and Clear")
    epd.init()
    epd.Clear()
    
    Himage2 = Image.new('1', (epd.height, epd.width), 255)  # 255: clear the frame
    bmp = Image.open(os.path.join(picdir, 'download.png'))
    bmp_resized = bmp.resize((400, 300))
    Himage2.paste(bmp_resized, (0,0))
    epd.display(epd.getbuffer(Himage2))
    
    logging.info("Goto Sleep...")
    epd.sleep()
    
except IOError as e:
    logging.info(e)
    
except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    epd4in2.epdconfig.module_exit()
    exit()
