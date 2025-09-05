package com.lafosse;

import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Logger {
    @PostMapping("/log")
    public void logRequest(@RequestBody Map<String, String> body) {
        String method = body.get("method");
        String url = body.get("originalUrl");
        String message = "Logged: " + method + " " + url;

        System.out.println(message);

        try (PrintWriter writer = new PrintWriter(new FileWriter("log.txt", true))){
            writer.println(message);
        } catch (Exception e) {
            System.out.println("Error");
        }
    }
}