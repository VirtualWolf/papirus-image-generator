#!/usr/bin/env python3

import os
import requests
from papirus import PapirusImage

result = requests.get(os.environ['URL'], stream=True)
image = result.raw

screen = PapirusImage()

screen.write(image)
