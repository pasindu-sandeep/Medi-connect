package com.example.backend.models;

import java.util.List;

public class DoctorVisitReport {
    public String patientUsername;
    public String doctorUsername;
    public String visitDate;
    public String hospitalName;
    public String appointmentTime;

    // Clinical Details
    public String chiefComplaint;
    public String historyOfPresentIllness;
    public Vitals vitalSigns;
    public String clinicalFindings;
    public String diagnosis;

    // Treatment
    public List<Medication> prescription;
    public String advice;

    // Follow-up & Labs
    public List<String> testsToBeDone;
    public String nextVisitDate;

    public String notes;
    public String reportId;

    // Inner classes
    public static class Vitals {
        public String bp;
        public int pulse;
        public String temperature;
        public String oxygenSaturation;
    }

    public static class Medication {
        public String name;
        public String dose;
        public String duration;
        public String instructions;
    }
}
