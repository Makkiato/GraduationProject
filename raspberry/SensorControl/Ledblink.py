import sys
import RPi.GPIO as GPIO
import time

## 인자받기
#print('sys.argv 길이', len(sys.argv))

#for arg in sys.argv :
    print('arg value = ', arg)

#if len(sys.argv) != 2:
    print("Set default term : 0.5")
    term = 0.5


else:
    try :
        term = int(sys.argv[1])
    except : 
        print("Wrong argument. You should input INT blink term (0.5~)")
        print("Set default term : 0.5")
        term = 0.5



GPIO.setmode(GPIO.BCM)
GPIO.setup(4,GPIO.OUT)

try:
    while True :
        GPIO.output(4, True)
        time.sleep(term)
        GPIO.output(4, False)
        time.sleep(term)

except KeyboardInterrupt :
    GPIO.cleanup()
