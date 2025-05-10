package com.example.backend.servlets.doctor;

import com.example.backend.models.Doctor;
import com.example.backend.models.DoctorSchedule;
import com.google.gson.Gson;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@WebServlet("/api/doctors/filter")
public class DoctorFilterServlet extends HttpServlet {
    private String doctorDataPath;

    @Override
    public void init() {
        doctorDataPath = Paths.get(getServletContext().getInitParameter("dataFilePath"), "doctor_data").toString();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        resp.setContentType("application/json");

        // Allow cross-origin request from frontend
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type");

        String hospitalFilter = req.getParameter("hospital");
        String specializationFilter = req.getParameter("specialization");

        if ((hospitalFilter == null || hospitalFilter.isBlank()) &&
                (specializationFilter == null || specializationFilter.isBlank())) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Provide at least one filter: hospital or specialization.\"}");
            return;
        }

        Gson gson = new Gson();
        List<Map<String, Object>> matchingDoctors = new ArrayList<>();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(doctorDataPath), "*_schedule.txt")) {
            for (Path schedulePath : stream) {
                String username = schedulePath.getFileName().toString().replace("_schedule.txt", "");
                Path dataPath = Paths.get(doctorDataPath, username + "_data.txt");

                if (!Files.exists(dataPath)) continue;

                Doctor doctor = gson.fromJson(Files.readString(dataPath), Doctor.class);
                DoctorSchedule schedule = gson.fromJson(Files.readString(schedulePath), DoctorSchedule.class);

                boolean matchesHospital = false;

                // Null-safe collection of all day availabilities
                List<List<DoctorSchedule.Availability>> allDays = new ArrayList<>();
                if (schedule.availabilityList_Monday != null) allDays.add(schedule.availabilityList_Monday);
                if (schedule.availabilityList_Tuesday != null) allDays.add(schedule.availabilityList_Tuesday);
                if (schedule.availabilityList_Wednesday != null) allDays.add(schedule.availabilityList_Wednesday);
                if (schedule.availabilityList_Thurs != null) allDays.add(schedule.availabilityList_Thurs);
                if (schedule.availabilityList_Friday != null) allDays.add(schedule.availabilityList_Friday);
                if (schedule.availabilityList_Saturday != null) allDays.add(schedule.availabilityList_Saturday);
                if (schedule.availabilityList_Sunday != null) allDays.add(schedule.availabilityList_Sunday);

                for (List<DoctorSchedule.Availability> dayList : allDays) {
                    for (DoctorSchedule.Availability slot : dayList) {
                        if (hospitalFilter != null &&
                                slot.hospitalName != null &&
                                slot.hospitalName.toLowerCase().contains(hospitalFilter.toLowerCase())) {
                            matchesHospital = true;
                            break;
                        }
                    }
                    if (matchesHospital) break;
                }

                boolean matchesSpecialization = (specializationFilter == null) ||
                        (doctor.Specialization != null &&
                                doctor.Specialization.toLowerCase().contains(specializationFilter.toLowerCase()));

                if ((hospitalFilter == null || matchesHospital) && matchesSpecialization) {
                    Map<String, Object> result = new HashMap<>();
                    result.put("username", doctor.username);
                    result.put("name", doctor.name);
                    result.put("specialization", doctor.Specialization);
                    result.put("phoneNumber", doctor.phoneNumber);
                    result.put("profilePicture", doctor.profilePicture);
                    result.put("doctorID", doctor.doctorID);
                    matchingDoctors.add(result);
                }
            }
        }

        resp.getWriter().write(gson.toJson(matchingDoctors));
    }
}
