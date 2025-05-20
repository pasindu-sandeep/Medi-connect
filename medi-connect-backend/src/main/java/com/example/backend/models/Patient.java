package com.example.backend.models;

public class Patient extends User {
    private String nameWithInitials;
    private int age;
    private String gender;
    private String address;

    public Patient(String username, String password, String nameWithInitials, int age, String phoneNumber, String gender, String address, String profilePicture) {
        this.setUsername(username);
        this.setPassword(password);
        this.nameWithInitials = nameWithInitials;
        this.age = age;
        this.setPhoneNumber(phoneNumber);
        this.gender = gender;
        this.address = address;
        this.setProfilePicture(profilePicture);
    }

    public String getNameWithInitialsPatient() {
        return nameWithInitials;
    }
    public int getAgePatient() {
        return age;
    }
    public String getGenderPatient() {
        return gender;
    }
    public String getAddressPatient() {
        return address;
    }
    public void setNameWithInitials(String nameWithInitials) {
        this.nameWithInitials = nameWithInitials;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public void setGender(String gender) {
        this.gender = gender;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}
