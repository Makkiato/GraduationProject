import sys
import RPi.GPIO as GPIO
import time

## input argument
#print('sys.argv length', len(sys.argv))

#for arg in sys.argv :
#    print('arg value = ', arg)

LED = 18

GPIO.setmode(GPIO.BCM)
GPIO.setup(LED, GPIO.OUT, initial=False)

if len(sys.argv) != 2:
    print("Set default term : 0.5")
    term = 0.5


else:
    try :
        term = int(sys.argv[1])
    except : 
        print("Wrong argument. You should input INT blink term (0.5~)")
        print("Set default term : 0.5")
        term = 0.5




try:
    while True :
        GPIO.output(LED, True)
        time.sleep(term)
        GPIO.output(LED, False)
        time.sleep(term)

except KeyboardInterrupt :
    GPIO.cleanup()
