import sys
import time
import digitalio
import busio
import board
from adafruit_epd.epd import Adafruit_EPD
from adafruit_epd.ssd1680 import Adafruit_SSD1680
from PIL import Image, ImageDraw, ImageFont

import draw_utils
import api_utils

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
ecs = digitalio.DigitalInOut(board.CE0)
dc = digitalio.DigitalInOut(board.D22)
rst = digitalio.DigitalInOut(board.D27)
busy = digitalio.DigitalInOut(board.D17)

while True:
    connected, count = api_utils.getLibraryCount()
    if draw_utils.drawLibrarySize(draw, connected, count):
        display = Adafruit_SSD1680(122, 250, spi, cs_pin=ecs, dc_pin=dc, sramcs_pin=None, rst_pin=rst, busy_pin=busy, )
        display.rotation = 1
        display.fill(Adafruit_EPD.WHITE)
        image = Image.new("RGB", (display.width, display.height), color=WHITE)
        draw = ImageDraw.Draw(image)

        image = image.convert("1").convert("L")
        display.image(image)
        display.display()

    time.sleep(600) # Refresh every 10 minutes