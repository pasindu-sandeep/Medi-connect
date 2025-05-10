package com.example.backend.models;

public class Doctor extends User {
    public String Specialization;
    public String doctorID;

    public void Doctor(String username, String password, String name, String phoneNumber, String specialization, String profilePicture, String doctorID) {
      this.username = username;
      this.password = password;
      this.name = name;
      this.phoneNumber = phoneNumber;
      this.Specialization = specialization;
      this.profilePicture = profilePicture;
      this.doctorID = doctorID;
    }
}
