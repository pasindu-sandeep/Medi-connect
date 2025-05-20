package com.example.backend.models;

import java.util.List;

public class DoctorVisitReport {
    private String patientUsername;
    private String doctorUsername;
    private String visitDate;
    private String hospitalName;
    private String appointmentTime;

    // Clinical Details
    private String chiefComplaint;
    private String historyOfPresentIllness;
    private Vitals vitalSigns;
    private String clinicalFindings;
    private String diagnosis;

    // Treatment
    private List<Medication> prescription;
    private String advice;

    // Follow-up & Labs
    private List<String> testsToBeDone;
    private String nextVisitDate;

    private String notes;
    private String reportId;

    // Getters and Setters
    public String getPatientUsername() {
        return patientUsername;
    }

    public void setPatientUsername(String patientUsername) {
        this.patientUsername = patientUsername;
    }

    public String getDoctorUsername() {
        return doctorUsername;
    }

    public void setDoctorUsername(String doctorUsername) {
        this.doctorUsername = doctorUsername;
    }

    public String getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(String visitDate) {
        this.visitDate = visitDate;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getChiefComplaint() {
        return chiefComplaint;
    }

    public void setChiefComplaint(String chiefComplaint) {
        this.chiefComplaint = chiefComplaint;
    }

    public String getHistoryOfPresentIllness() {
        return historyOfPresentIllness;
    }

    public void setHistoryOfPresentIllness(String historyOfPresentIllness) {
        this.historyOfPresentIllness = historyOfPresentIllness;
    }

    public Vitals getVitalSigns() {
        return vitalSigns;
    }

    public void setVitalSigns(Vitals vitalSigns) {
        this.vitalSigns = vitalSigns;
    }

    public String getClinicalFindings() {
        return clinicalFindings;
    }

    public void setClinicalFindings(String clinicalFindings) {
        this.clinicalFindings = clinicalFindings;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public List<Medication> getPrescription() {
        return prescription;
    }

    public void setPrescription(List<Medication> prescription) {
        this.prescription = prescription;
    }

    public String getAdvice() {
        return advice;
    }

    public void setAdvice(String advice) {
        this.advice = advice;
    }

    public List<String> getTestsToBeDone() {
        return testsToBeDone;
    }

    public void setTestsToBeDone(List<String> testsToBeDone) {
        this.testsToBeDone = testsToBeDone;
    }

    public String getNextVisitDate() {
        return nextVisitDate;
    }

    public void setNextVisitDate(String nextVisitDate) {
        this.nextVisitDate = nextVisitDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getReportId() {
        return reportId;
    }

    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    // Inner classes
    public static class Vitals {
        private String bp;
        private int pulse;
        private String temperature;
        private String oxygenSaturation;

        public String getBp() {
            return bp;
        }

        public void setBp(String bp) {
            this.bp = bp;
        }

        public int getPulse() {
            return pulse;
        }

        public void setPulse(int pulse) {
            this.pulse = pulse;
        }

        public String getTemperature() {
            return temperature;
        }

        public void setTemperature(String temperature) {
            this.temperature = temperature;
        }

        public String getOxygenSaturation() {
            return oxygenSaturation;
        }

        public void setOxygenSaturation(String oxygenSaturation) {
            this.oxygenSaturation = oxygenSaturation;
        }
    }

    public static class Medication {
        private String name;
        private String dose;
        private String duration;
        private String instructions;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDose() {
            return dose;
        }

        public void setDose(String dose) {
            this.dose = dose;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public String getInstructions() {
            return instructions;
        }

        public void setInstructions(String instructions) {
            this.instructions = instructions;
        }
    }
}
