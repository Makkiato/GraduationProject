import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(4,GPIO.OUT)

try:
    while True :
        GPIO.output(4, True)
        time.sleep(0.5)
        GPIO.output(4, False)
        time.sleep(0.5)

except Keyboardinterrupt :
    GPIO.cleanup()
