package com.example.backend.servlets.appointment;

import com.example.backend.models.Appointment;
import com.google.gson.*;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import java.nio.file.*;
import java.time.*;
import java.util.ArrayList;
import java.util.List;

@WebServlet("/api/appointments/delete")
public class DeleteAppointmentServlet extends HttpServlet {
    private String apptPath;

    @Override
    public void init() {
        String baseDir = getServletContext().getInitParameter("dataFilePath");
        apptPath = Paths.get(baseDir, "appointments").toString();
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCors(resp);
        Gson gson = new Gson();
        Appointment appt = gson.fromJson(req.getReader(), Appointment.class);

        Path file = Paths.get(apptPath, appt.patientUsername + "_appointment.txt");
        if (!Files.exists(file)) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"No appointments found\"}");
            return;
        }

        List<Appointment> list = new ArrayList<>(List.of(
                gson.fromJson(Files.readString(file), Appointment[].class)
        ));

        boolean removed = list.removeIf(a ->
                a.date.equals(appt.date)
                        && a.doctorUsername.equals(appt.doctorUsername)
                        && a.timeSlot.equals(appt.timeSlot)
        );

        if (!removed) {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Appointment not found\"}");
        } else {
            Files.writeString(file, gson.toJson(list));
            resp.getWriter().write("{\"status\":\"deleted\"}");
        }
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
