import spidev, time, socketio, json
import RPi.GPIO as GPIO
import threading
from collections import OrderedDict

led = 18
pir = 25
GPIO.setmode(GPIO.BCM)
GPIO.setup(pir,GPIO.IN)
GPIO.setup(led,GPIO.OUT)

sio = socketio.Client()

json_sensordata = OrderedDict()

def ledblink():

    if GPIO.input(pir) == True:
        #print("Sensor ON")
        GPIO.output(led, GPIO.HIGH)
            
    if GPIO.input(pir) == False:
        #print("Sensor OFF")
        GPIO.output(led, GPIO.LOW)


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


set_interval(ledblink,0.2)

@sio.on('connect')
def handler():
    print("socket connected")

@sio.on('connection_error')
def handler():
    print("connection fail")

@sio.on('order')
def hadler(data):
    #if(data.value = "some order"){}
    #elif(data.value = "other order"){}
    print("recieved order")
    json_sensordata["value"] = GPIO.input(pir)
    sio.emit('order', json_sensordata)      
    print("send data")
    sio.emit('disconnect')

sio.connect('http://localhost:3000')
