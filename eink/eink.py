import sys
import digitalio
import busio
import board
import requests
from adafruit_epd.epd import Adafruit_EPD
from adafruit_epd.ssd1680 import Adafruit_SSD1680
from PIL import Image, ImageDraw, ImageFont

import draw_utils

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

api_url = 'http://pixel-shelf.local:3000'

# Cache
cached_count = None

def getLibraryCount(draw):
    try:
        r = requests.get(url = api_url + '/api/library/size')
        data = r.json()
        count = data['size']
        cached_count = count
        print('Fetched ' + str(count) + ' games from server')
    except requests.exceptions.ConnectionError:
        print('Could not fetch size from server!')
        # TODO: Display warning indicator on screen
        if cached_count:
            print('Falling back to cached count of ' + str(cached_count))
            return cached_count
        else:
            return '?'
    return count

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
count = getLibraryCount(draw)
draw_utils.drawLibrarySize(draw, count)
image = image.convert("1").convert("L")

display.image(image)
display.display()