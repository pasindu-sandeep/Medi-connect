package com.example.backend.models;

import java.util.Map;
import java.util.List;

public class DoctorWithSchedule {
    private Doctor doctor;
    private Map<String, List<Availability>> schedule;

    public static class Availability {
        private String hospitalName;
        private String timeSlot;

        // Getters and setters
        public String getHospitalName() {
            return hospitalName;
        }

        public void setHospitalName(String hospitalName) {
            this.hospitalName = hospitalName;
        }

        public String getTimeSlot() {
            return timeSlot;
        }

        public void setTimeSlot(String timeSlot) {
            this.timeSlot = timeSlot;
        }
    }

    // Getters and setters
    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Map<String, List<Availability>> getSchedule() {
        return schedule;
    }

    public void setSchedule(Map<String, List<Availability>> schedule) {
        this.schedule = schedule;
    }
}
