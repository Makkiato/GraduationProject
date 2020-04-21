

notes for test version

need nodejs, npm

apt-get install nodejs npm (on Windows, just download it from nodejs.org, npm included)

node --version
npm --version


modify config.js to find your mqtt broker


run your mqtt broker
run your other mqtt sub with topic of "/device/#"

run
node ./mqttclient.js

then

0
1
2
3
4
5
6
7
8
9

appear

then publish JSON string contains "id" element with other mqtt publisher on topic "/device/echo"
ex)
{
    "id" : "asjfdiajasijf",
    "status" : "on"
}


mqttclient.js and your own mqtt sub will take message on topic "/device/reply"


--------UPDATE 2020 04 21----------

subscribing new topic "/mymind/#"
sending any message to this topic causes play special voice record via omxplayer
before test this handler, make sure you speaker or headphone is connected to raspberrypi