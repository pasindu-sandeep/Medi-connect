package com.example.backend.models;

public class Appointment {
    private String doctorUsername;
    private String patientUsername;
    private String hospitalName;
    private String date;
    private String timeSlot;
    private int urgency;

    public String getDoctorUsername() {
        return doctorUsername;
    }
    public void setDoctorUsername(String doctorUsername) {
        this.doctorUsername = doctorUsername;
    }

    public String getPatientUsername() {
        return patientUsername;
    }
    public void setPatientUsername(String patientUsername) {
        this.patientUsername = patientUsername;
    }

    public String getHospitalName() {
        return hospitalName;
    }
    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    public String getTimeSlot() {
        return timeSlot;
    }
    public void setTimeSlot(String timeSlot) {
        this.timeSlot = timeSlot;
    }

    public int getUrgency() {
        return urgency;
    }
    public void setUrgency(int urgency) {
        this.urgency = urgency;
    }
}