package com.hkr;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import static javax.ws.rs.core.MediaType.TEXT_PLAIN;
import javax.ws.rs.core.MediaType;

@Path("/helloworld")
public class App {
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String getMessage(){
        return "Hello World";
    }

    public static void main(){
        System.out.println("on");
    }




}
