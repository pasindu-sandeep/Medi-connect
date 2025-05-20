package com.example.backend.models;

import java.util.List;

public class Hospital {
    private String hospitalName;
    private String address;
    private String contact;
    private String coverPhoto;

    private List<LabService> labServices;
    private List<HealthPackage> healthPackages;

    // Getters and Setters
    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public String getCoverPhoto() {
        return coverPhoto;
    }

    public void setCoverPhoto(String coverPhoto) {
        this.coverPhoto = coverPhoto;
    }

    public List<LabService> getLabServices() {
        return labServices;
    }

    public void setLabServices(List<LabService> labServices) {
        this.labServices = labServices;
    }

    public List<HealthPackage> getHealthPackages() {
        return healthPackages;
    }

    public void setHealthPackages(List<HealthPackage> healthPackages) {
        this.healthPackages = healthPackages;
    }

    // Nested classes
    public static class HealthPackage {
        private String name;
        private String description;
        private double price;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }

    public static class LabService {
        private String name;
        private String description;
        private double price;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }
}
