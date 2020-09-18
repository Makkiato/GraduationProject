import socketio

sio = socketio.Client()
@sio.on('connect')
def handler():
    print("socket connected")

@sio.on('connection_error')
def handler():
    print("connection fail")

@sio.on('order')
def hadler(data):
    print("recieved order")
    print(data)
    print("and do what you want here")
    sio.emit('disconnect')



sio.connect('http://localhost:3000')

