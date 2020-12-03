﻿# GraduationProject


오픈소스(FIWARE)를 활용한 Smart City Management Framework 구축
IoT network는 라즈베리파이 MCU를 이용해 구축.

Agent - Gateway - IoT 네트워크로 multiplex가능한 스마트시티 네트워크 구조


Agent - Fiware와 직접 연결, 하위 Gateway manage
Gateway - agent에 report, IoT Network(CoAP,MQTT) manage, HTTP 서버를 추가해서 Gateway-Gateway 연결 필요
IoT 네트워크(Raspberry) - MQTT,CoAP 클라이언트, python GPIO
AdminPage - express.js 웹서버, pug 이용해 Fiware로부터 취득한 데이터 렌더링 및 RDBMS 축적, 간단한 차트,리스트 제공




프로젝트 기간 종료로 개발 중단, 추후 프레임워크화 하여 재등록 예정
