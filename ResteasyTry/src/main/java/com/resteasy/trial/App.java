
package com.resteasy.trial;

import javax.ws.rs.*;

@Path("tutorial")
public class App {


    @GET
    @Path("helloworld")
    public String helloworld() {
        return "Hello World!";
    }
}

