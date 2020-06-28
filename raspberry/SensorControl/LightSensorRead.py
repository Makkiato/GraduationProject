import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(21,GPIO.OUT)

pin_to_circuit = 21

def rc_time (pin_to_circuit):
    count = 0
  
    #Output on the pin for 
    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)
    # 1, GPIO.HIGH, True 같은맥락
    # 0, GPIO.LOW, False 같은맥락

    
    time.sleep(0.1) # 0.1sec sleep

    #Change the pin back to input
    GPIO.setup(pin_to_circuit, GPIO.IN)
  
    #Count until the pin goes high
    while (GPIO.input(pin_to_circuit) == GPIO.LOW):
        count += 1

    return count

try:
    while True:
        print(rc_time(pin_to_circuit))
        
except KeyboardInterrupt:
    pass

finally:
    GPIO.cleanup()


