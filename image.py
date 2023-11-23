#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import logging
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime

picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "pic")
logging.basicConfig(level=logging.DEBUG)

days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

font24 = ImageFont.truetype(os.path.join(picdir, "Font.ttc"), 24)
font18 = ImageFont.truetype(os.path.join(picdir, "Font.ttc"), 18)
font35 = ImageFont.truetype(os.path.join(picdir, "Font.ttc"), 35)


def render():
    image = Image.new("1", (400, 300), 255)  # 255: clear the frame
    draw = ImageDraw.Draw(image)
    time = datetime.now()
    draw.text((0, 0), f"{time.day} {months[time.month - 1]}", font=font35, fill=0)
    draw.text((0, 40), f"{days[time.weekday()]}", font=font24, fill=0)
    draw.text((0, 64), f"{}", font=font24, fill=0)
    return image
