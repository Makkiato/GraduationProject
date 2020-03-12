package com.company;

import org.json.simple.JSONObject;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;

public class Main {

    public static void main(String[] args) throws IOException {
        // write your code here
        URL fiwareAdd = new URL("http://localhost:1026/v2/entities");
        HttpURLConnection toFiwareDirect = (HttpURLConnection) fiwareAdd.openConnection();

        sendPost(toFiwareDirect,makeJSON());
    }


    private static void sendPost(HttpURLConnection conn, JSONObject body) throws IOException {
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setDoInput(true);
        conn.setDoOutput(true);
        conn.connect();

        String param = body.toJSONString();
        OutputStreamWriter outStream = new OutputStreamWriter(conn.getOutputStream(),"UTF-8");
        outStream.write(param);
        outStream.flush();
        BufferedReader inStream = new BufferedReader(new InputStreamReader(conn.getInputStream(),"UTF-8"));
        String iter = null;
        while((iter = inStream.readLine()) != null){
            System.out.println(iter);
        }

        outStream.close();
        inStream.close();

    }

    private static JSONObject makeJSON(){
        JSONObject body = new JSONObject();
        body.put("id", "fromJava");
        body.put("type", "testrunning");
        JSONObject value = new JSONObject();
        value.put("type", "string");
        value.put("value", "JavaCaptured?");
        JSONObject metadata = new JSONObject();
        value.put("metadata", metadata);
        body.put("value", value);
        /*
        {
            "id": "fromJava",
                "type": "testrunning",
                "value": {
                    "type": "string",
                    "value": "JavaCaptured?",
                    "metadata": {}
        }
        */

        return body;
    }
}
