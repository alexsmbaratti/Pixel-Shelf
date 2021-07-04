import sys
import digitalio
import busio
import board
from adafruit_epd.epd import Adafruit_EPD
from adafruit_epd.ssd1680 import Adafruit_SSD1680
from PIL import Image, ImageDraw, ImageFont

spi = busio.SPI(board.SCK, MOSI=board.MOSI, MISO=board.MISO)
ecs = digitalio.DigitalInOut(board.CE0)
dc = digitalio.DigitalInOut(board.D22)
rst = digitalio.DigitalInOut(board.D27)
busy = digitalio.DigitalInOut(board.D17)

# Logo setup
logo = Image.open("logo.png") # This should be a 1x1 image for proper scaling
logo = logo.resize((11, 11), Image.BICUBIC)

small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 10)
medium_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
large_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

display = Adafruit_SSD1680(122, 250, spi, cs_pin=ecs, dc_pin=dc, sramcs_pin=None, rst_pin=rst, busy_pin=busy, )

display.rotation = 1

display.fill(Adafruit_EPD.WHITE)
image = Image.new("RGB", (display.width, display.height), color=WHITE)
draw = ImageDraw.Draw(image)
draw.text((5, 5), 'My Game Collection', font=medium_font, fill=BLACK,)
draw.text((5, 112), 'Powered by Pixel Shelf', font=small_font, fill=BLACK,)
draw.text((5, 25), sys.argv[1] + ' Games',font=large_font,fill=BLACK,)

display.image(image)
display.image(logo)
display.display()
