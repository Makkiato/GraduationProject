import spidev, time, socketio, json
import RPi.GPIO as GPIO
import threading
from collections import OrderedDict

pir = 25
beep = 12
GPIO.setmode(GPIO.BCM)
GPIO.setup(pir,GPIO.IN)
GPIO.setup(beep,GPIO.OUT)

sio = socketio.Client()
PIR_status = GPIO.input(pir)

json_sensordata = OrderedDict()

def beep():
    PIR_status = GPIO.input(pir)
    if PIR_status == True: #센서 ON
        #print("Sensor ON")
        GPIO.output(beep, GPIO.HIGH)
            
    elif PIR_status == False: #센서 OFF
        #print("Sensor OFF")
        GPIO.output(beep, GPIO.LOW)


def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


set_interval(beep,0.05) #0.05초 간격으로 beep 함수 실행


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
    PIR_status = GPIO.input(pir)
    json_sensordata["value"] = PIR_status
    sio.emit('order', json_sensordata)      
    print("send data")
    sio.emit('disconnect')

sio.connect('http://localhost:3000')


