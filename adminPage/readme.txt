2020 05 07
pm 10 45

functions related to fiware connection are moved to fiwareConnector.js
you need to put parameter "orionCB" after it is copied to prevent from being corrupted
orionCB.path is needed to use functions correctly

route "/version" added. simply response the version of fiware-orionCB




2020 05 05
pm 10 56

additional query on '/main'

server will handle the value of query 'type'
put any value of type in the field 'type' to ask fiware to response specific type you asked
if you dont put anything in the query 'type', server will ask fiware to response all data stored in mongodb connected to fiware

sadly, you can still only change the value among 'on' and 'off'

ex) http://localhost:7777/main?type=sound