package com.example.backend.models;

public class Patient extends User {
    public String nameWithInitials;
    public int age;
    public String gender;
    public String address;

    public Patient(String username, String password, String nameWithInitials, int age, String phoneNumber, String gender, String address, String profilePicture) {
        this.username = username;
        this.password = password;
        this.nameWithInitials = nameWithInitials;
        this.age = age;
        this.phoneNumber = phoneNumber;
        this.gender = gender;
        this.address = address;
        this.profilePicture = profilePicture;
    }
}
