package com.example.backend.models;

public class Doctor extends User {
    private String Specialization;
    private String doctorID;

    public void Doctor(String username, String password, String name, String phoneNumber, String specialization, String profilePicture, String doctorID) {
      this.setUsername(username);
      this.setPassword(password);
      this.setName(name);
      this.setPhoneNumber(phoneNumber);
      this.Specialization = specialization;
      this.setProfilePicture(profilePicture);
      this.doctorID = doctorID;
    }

    public String getSpecialization() {
        return Specialization;
    }
    public void setSpecialization(String specialization) {
        Specialization = specialization;
    }
    public String getDoctorID() {
        return doctorID;
    }
    public void setDoctorID(String doctorID) {
        this.doctorID = doctorID;
    }
}
