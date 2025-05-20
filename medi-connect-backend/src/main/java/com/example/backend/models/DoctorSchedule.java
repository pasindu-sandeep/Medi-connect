package com.example.backend.models;

import java.util.List;

public class DoctorSchedule {
    private String doctorUserName;
    private List<Availability> availabilityList_Monday;
    private List<Availability> availabilityList_Tuesday;
    private List<Availability> availabilityList_Wednesday;
    private List<Availability> availabilityList_Thurs;
    private List<Availability> availabilityList_Friday;
    private List<Availability> availabilityList_Saturday;
    private List<Availability> availabilityList_Sunday;

    public void setDoctorUserName(String doctorUserName) {
        this.doctorUserName = doctorUserName;
    }
    public String getDoctorUserName() {
        return doctorUserName;
    }

    public void setAvailabilityList_Monday(List<Availability> availabilityList_Monday) {
        this.availabilityList_Monday = availabilityList_Monday;
    }
    public List<Availability> getAvailabilityList_Monday() {
        return availabilityList_Monday;
    }

    public void setAvailabilityList_Tuesday(List<Availability> availabilityList_Tuesday) {
        this.availabilityList_Tuesday = availabilityList_Tuesday;
    }
    public List<Availability> getAvailabilityList_Tuesday() {
        return availabilityList_Tuesday;
    }

    public void setAvailabilityList_Wednesday(List<Availability> availabilityList_Wednesday) {
        this.availabilityList_Wednesday = availabilityList_Wednesday;
    }
    public List<Availability> getAvailabilityList_Wednesday() {
        return availabilityList_Wednesday;
    }

    public void setAvailabilityList_Thurs(List<Availability> availabilityList_Thurs) {
        this.availabilityList_Thurs = availabilityList_Thurs;
    }
    public List<Availability> getAvailabilityList_Thurs() {
        return availabilityList_Thurs;
    }

    public void setAvailabilityList_Thursday(List<Availability> availabilityList_Thursday) {
        this.availabilityList_Thurs = availabilityList_Thursday;
    }
    public List<Availability> getAvailabilityList_Thursday() {
        return availabilityList_Thurs;
    }

    public void setAvailabilityList_Friday(List<Availability> availabilityList_Friday) {
        this.availabilityList_Friday = availabilityList_Friday;
    }
    public List<Availability> getAvailabilityList_Friday() {
        return availabilityList_Friday;
    }

    public void setAvailabilityList_Saturday(List<Availability> availabilityList_Saturday) {
        this.availabilityList_Saturday = availabilityList_Saturday;
    }
    public List<Availability> getAvailabilityList_Saturday() {
        return availabilityList_Saturday;
    }

    public void setAvailabilityList_Sunday(List<Availability> availabilityList_Sunday) {
        this.availabilityList_Sunday = availabilityList_Sunday;
    }
    public List<Availability> getAvailabilityList_Sunday() {
        return availabilityList_Sunday;
    }

    public static class Availability {
        public String hospitalName;
        public String timeSlot;
    }
}
