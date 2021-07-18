import sys
import time
import schedule
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

LIBRARY_SIZE = 0

screen = LIBRARY_SIZE

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
ecs = digitalio.DigitalInOut(board.CE0)
dc = digitalio.DigitalInOut(board.D22)
rst = digitalio.DigitalInOut(board.D27)
busy = digitalio.DigitalInOut(board.D17)

display = Adafruit_SSD1680(122, 250, spi, cs_pin=ecs, dc_pin=dc, sramcs_pin=None, rst_pin=rst, busy_pin=busy, )

display.rotation = 1
display.fill(Adafruit_EPD.WHITE)
image = Image.new("RGB", (display.width, display.height), color=WHITE)
draw = ImageDraw.Draw(image)

def update():
    global draw
    if screen == LIBRARY_SIZE:
        connected, count = api_utils.getLibraryCount()
        display.rotation = 1
        display.fill(Adafruit_EPD.WHITE)
        image = Image.new("RGB", (display.width, display.height), color=WHITE)
        draw = ImageDraw.Draw(image)
        if draw_utils.drawLibrarySize(draw, connected, count):
            image = image.convert("1").convert("L")
            display.image(image)
            display.display()

update()

schedule.every(10).minutes.do(update)

while True:
    schedule.run_pending()
    time.sleep(1)