package com.example.backend.models;

import java.util.List;

public class Hospital {
    public String hospitalName;
    public String address;
    public String contact;
    public String coverPhoto;

    public List<LabService> labServices;
    public List<HealthPackage> healthPackages;

    public static class HealthPackage {
        public String packageName;
        public String description;
        public double price;
    }

    public static class LabService {
        public String name;
        public String description;
        public double price;
    }
}
