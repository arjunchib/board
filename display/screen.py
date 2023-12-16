#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import logging
from waveshare_epd import epd4in2
from PIL import Image
import requests

picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
logging.basicConfig(level=logging.DEBUG)

def display(image="latest.png"):
    try:
        logging.info("download image")
        r = requests.get("http://r2.ollie.arjunchib.com/" + image)
        file = os.path.join(picdir, 'download.png')
        with open(file, 'wb') as outfile:
            outfile.write(r.content)
        
        logging.info("start")
        epd = epd4in2.EPD()

        logging.info("init and Clear")
        epd.init()
        epd.Clear()
        img = Image.new('1', (epd.width, epd.height), 255)  # 255: clear the frame
        png = Image.open(os.path.join(picdir, 'download.png'))
        png_resized = png.resize((epd.width, epd.height))
        img.paste(png_resized, (0,0))
        epd.display(epd.getbuffer(img))
        
        logging.info("Goto Sleep...")
        epd.sleep()
        
    except IOError as e:
        logging.info(e)
        
    except KeyboardInterrupt:    
        logging.info("ctrl + c:")
        epd4in2.epdconfig.module_exit()
        exit()
