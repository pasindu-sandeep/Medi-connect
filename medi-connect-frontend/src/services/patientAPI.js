import apiClient from "./apiClient";

export const getPatientsListWithDetails = async () => {
  try {
    const response = await apiClient.get("/patients-details");
    console.log("patient list response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient list:", error);
    throw error;
  }
};

export const getPatientsProfileInfo = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    const response = await apiClient.get(
      `/profile/${user.role}/${user.username}`
    );
    console.log("patient profile response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    throw error;
  }
};

export const handleSave = async () => {
  try {
    const response = await apiClient.put(
      `/profile/${profile.role}/update`,
      profile
    );

    alert("Profile updated");
    localStorage.setItem("user", JSON.stringify(profile));
    setEditable(false);
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("An error occurred while updating the profile.");
  }
};

export const handleDelete = async () => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this account?"
  );
  if (!confirmed) return;

  try {
    await apiClient.delete(
      `/profile/${profile.role}/delete/${profile.username}`
    );
    localStorage.removeItem("user");
    alert("Profile deleted");
    window.location.href = "/";
  } catch (error) {
    console.error("Error deleting profile:", error);
    alert("An error occurred while deleting the profile.");
  }
};

export const registerPatient = async (formData) => {
  const payload = {
    username: formData.username,
    password: formData.password,
    nameWithInitials: formData.nameWithInitials,
    age: parseInt(formData.age),
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    address: formData.address,
    profilePicture: formData.profilePicture,
  };

  try {
    const response = await apiClient.post("/patient-register", payload);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};
