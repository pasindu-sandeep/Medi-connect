package com.example.backend.servlets.doctor;

import com.example.backend.models.Doctor;
import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/doctors-details")
public class DoctorsWithDetails extends HttpServlet {

    private String doctorDataPath;

    // Response structure
    public static class DoctorDetailsResponse {
        public Doctor doctor;
        public Map<String, List<DoctorSchedule.Availability>> availability;

        public DoctorDetailsResponse(Doctor doctor, Map<String, List<DoctorSchedule.Availability>> availability) {
            this.doctor = doctor;
            this.availability = availability;
        }
    }

    @Override
    public void init() {
        doctorDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "doctor_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        Gson gson = new Gson();
        List<DoctorDetailsResponse> responseList = new ArrayList<>();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(doctorDataPath), "*_data.txt")) {
            for (Path doctorFile : stream) {
                String baseName = doctorFile.getFileName().toString().replace("_data.txt", "");
                Path scheduleFile = Paths.get(doctorDataPath, baseName + "_schedule.txt");

                Doctor doctor = gson.fromJson(Files.readString(doctorFile), Doctor.class);
                Map<String, List<DoctorSchedule.Availability>> groupedAvailability = new LinkedHashMap<>();

                if (Files.exists(scheduleFile)) {
                    DoctorSchedule schedule = gson.fromJson(Files.readString(scheduleFile), DoctorSchedule.class);

                    if (schedule.getAvailabilityList_Monday() != null)
                        groupedAvailability.put("Monday", schedule.getAvailabilityList_Monday());
                    if (schedule.getAvailabilityList_Tuesday() != null)
                        groupedAvailability.put("Tuesday", schedule.getAvailabilityList_Tuesday());
                    if (schedule.getAvailabilityList_Wednesday() != null)
                        groupedAvailability.put("Wednesday", schedule.getAvailabilityList_Wednesday());
                    if (schedule.getAvailabilityList_Thurs() != null)
                        groupedAvailability.put("Thursday", schedule.getAvailabilityList_Thurs());
                    if (schedule.getAvailabilityList_Friday() != null)
                        groupedAvailability.put("Friday", schedule.getAvailabilityList_Friday());
                    if (schedule.getAvailabilityList_Saturday() != null)
                        groupedAvailability.put("Saturday", schedule.getAvailabilityList_Saturday());
                    if (schedule.getAvailabilityList_Sunday() != null)
                        groupedAvailability.put("Sunday", schedule.getAvailabilityList_Sunday());
                }

                responseList.add(new DoctorDetailsResponse(doctor, groupedAvailability));
            }

            resp.getWriter().write(gson.toJson(responseList));
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Failed to read doctor data and schedules.\"}");
        }
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }
}
