package com.example.backend.servlets.appointment;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;

@WebServlet("/api/appointments/user/*")
public class UserAppointmentsServlet extends HttpServlet {
    private String apptPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        apptPath = Paths.get(baseDir, "appointments").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        String username = req.getPathInfo().substring(1); // skip initial '/'
        Path file = Paths.get(apptPath, username + "_appointment.txt");

        if (!Files.exists(file)) {
            resp.getWriter().write("[]");
            return;
        }

        resp.setContentType("application/json");
        resp.getWriter().write(Files.readString(file));
    }

    private void setCors(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
