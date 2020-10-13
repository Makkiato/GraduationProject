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

    if GPIO.input(pir) == True: #센서 ON
        #print("Sensor ON")
        GPIO.output(led, GPIO.HIGH)
            
    if GPIO.input(pir) == False: #센서 OFF
        #print("Sensor OFF")
        GPIO.output(led, GPIO.LOW)


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


set_interval(ledblink,0.2) #0.2초 간격으로 Led Blink 함수 실행

@sio.on('connect')
def handler():
    print("socket connected")

@sio.on('connection_error')
def handler():
    print("connection fail")

@sio.on('order')
def handler(data):
    #if(data.value = "some order"){}
    #elif(data.value = "other order"){}
    print("recieved order")
    json_sensordata["value"] = GPIO.input(pir)
    sio.emit('order', json_sensordata)      
    print("send data")
    sio.emit('disconnect')

sio.connect('http://localhost:3000')


