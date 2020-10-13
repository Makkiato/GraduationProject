import time
import Adafruit_DHT
import spidev, time, socketio, json
import RPi.GPIO as GPIO
import threading
from collections import OrderedDict

sensor = Adafruit_DHT.DHT11

led = 18
temp = 4

GPIO.setmode(GPIO.BCM)
#GPIO.setup(pir,GPIO.IN)
GPIO.setup(led,GPIO.OUT)

sio = socketio.Client()
json_sensordata = OrderedDict()

#set_interval(ledblink,0.05) #0.2초 간격으로 Led Blink 함수 실행

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
    
    h, t = Adafruit_DHT.read_retry(sensor, temp)
    print("send data")
    print("Temperature = {0:0.1f}*C Humidity = {1:0.1f}%".format(t, h))

    json_sensordata["temp"] = {0:0.1f}.format(t)
    json_sensordata["hum"] = {1:0.1f}.format(h)
    
    sio.emit('order', json_sensordata)      
    print("send data")
    sio.emit('disconnect')

sio.connect('http://localhost:3000')


