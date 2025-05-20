package com.example.backend.models;

public class DoctorRegistrationRequest {
    private Doctor doctor;
    private DoctorSchedule schedule;

    public DoctorRegistrationRequest(Doctor doctor, DoctorSchedule schedule) {
        this.doctor = doctor;
    }
    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
    public DoctorSchedule getSchedule() {
        return schedule;
    }
}
