package com.example.backend.servlets.patient;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.stream.Collectors;


@WebServlet("/api/profile/*")
public class ProfileServlet extends HttpServlet {
    private String doctorPath;
    private String patientPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        doctorPath = Paths.get(baseDir, "doctor_data").toString();
        patientPath = Paths.get(baseDir, "patient_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        String[] path = req.getPathInfo().split("/");
        String role = path[1];
        String username = path[2];

        Path filePath = Paths.get(role.equals("doctor") ? doctorPath : patientPath, username + "_data.txt");

        if (!Files.exists(filePath)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"User not found\"}");
            return;
        }

        resp.setContentType("application/json");
        resp.getWriter().write(Files.readString(filePath));
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        String[] path = req.getPathInfo().split("/");
        String role = path[1];

        BufferedReader reader = req.getReader();
        String body = reader.lines().collect(Collectors.joining());
        Path filePath = Paths.get(role.equals("doctor") ? doctorPath : patientPath,
                new Gson().fromJson(body, JsonObject.class).get("username").getAsString() + "_data.txt");

        Files.writeString(filePath, body, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
        resp.getWriter().write("{\"status\":\"updated\"}");
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        String[] path = req.getPathInfo().split("/");
        String role = path[1];
        String username = path[3];

        Path filePath = Paths.get(role.equals("doctor") ? doctorPath : patientPath, username + "_data.txt");

        if (Files.exists(filePath)) {
            Files.delete(filePath);
            resp.getWriter().write("{\"status\":\"deleted\"}");
        } else {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"User not found\"}");
        }
    }

    private void setCors(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
