package com.example.backend.models;

import java.util.List;

public class DoctorSchedule {
    public String doctorUserName;
    public List<Availability> availabilityList_Monday;
    public List<Availability> availabilityList_Tuesday;
    public List<Availability> availabilityList_Wednesday;
    public List<Availability> availabilityList_Thurs;
    public List<Availability> availabilityList_Friday;
    public List<Availability> availabilityList_Saturday;
    public List<Availability> availabilityList_Sunday;

    public static class Availability {
        public String hospitalName;
        public String timeSlot;
    }
}
