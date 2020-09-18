import spidev, time
import RPi.GPIO as GPIO

led = 18
pir = 25
GPIO.setmode(GPIO.BCM)
GPIO.setup(pir,GPIO.IN)
GPIO.setup(led,GPIO.OUT)

try :
    while True:
        if GPIO.input(pir) == True:
            print("Sensor ON")
            GPIO.output(led, GPIO.HIGH)
            time.sleep(0.2)
        if GPIO.input(pir) == False:
            print("Sensor OFF")
            GPIO.output(led, GPIO.LOW)
            time.sleep(0.2)
except KeyboardInterrupt:
    GPIO.cleanup()

