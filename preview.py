#!/usr/bin/python
# -*- coding:utf-8 -*-
import logging
from image import render

try:
    logging.info("start")
    render().save("preview.png")

except IOError as e:
    logging.info(e)
    
except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    exit()
