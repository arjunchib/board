#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import logging
from waveshare_epd import epd4in2
from PIL import Image
import requests

current_dir = os.path.dirname(os.path.realpath(__file__))
picdir = os.path.join(current_dir, 'pic')
image_file = os.path.join(picdir, 'download.png')
etag_file = os.path.join(current_dir, 'etag')
logging.basicConfig(level=logging.DEBUG)

def display():
    try:
        logging.info("download image")
        new_image = download_image()
        if not new_image:
            return

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

def download_image(image):
    try:
        with open(etag_file) as f:
            etag = f.read().splitlines()[0]
    except:
        etag = ""
    headers = { 'If-None-Match': etag }
    r = requests.get("https://board.arjunchib.com/latest", headers=headers)
    if r.status_code == 200:
        with open(etag_file, 'w') as outfile:
            outfile.write(r.headers.get('etag'))
        with open(image_file, 'wb') as outfile:
            outfile.write(r.content)
        return True
    elif r.status_code == 304:
        return False
