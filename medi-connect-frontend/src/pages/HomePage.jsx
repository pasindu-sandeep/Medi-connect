import { useState, useEffect, useRef } from "react";
import { Search, Calendar, User, Hospital } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ServiceCard from "../components/ServiceCard";
import {
  getDoctorList,
  getDoctorByName,
  getDoctorsByHospitalsAnsSpecialization,
} from "../services/doctorInfoAPI";
import { getHospitalList } from "../services/hospitalInfoAPI";
import { bookAppointment } from "../services/appointmentAPI";

const HomePage = () => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [hospital, setHospital] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [date, setDate] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [doctorByNameResult, setdoctorByNameResult] = useState([]);

  const [index, setIndex] = useState(0);

  const [showUrgencyModal, setShowUrgencyModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [urgency, setUrgency] = useState(1);
  const [user, setUser] = useState(null);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  const images = [
    "wallpapers/slide_image1.jpg",
    "wallpapers/slide_image2.jpg",
    "wallpapers/slide_image3.jpg",
  ];

  const doctorRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleDoctorSelect = async (name) => {
    console.log("doctor selected :", name);
    if (!name?.trim()) return;

    setInputValue(name);
    setShowSuggestions(false);

    try {
      const doctorInfo = await getDoctorByName(name);
      setdoctorByNameResult(doctorInfo);

      setTimeout(() => {
        doctorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 200);
    } catch (error) {
      console.error("Failed to fetch selected doctor info:", error);
    }
  };

  const services = [
    {
      title: "Health Mart",
      subtitle: "OTC Medicine",
      icon: "🛒",
      isNew: true,
      link: "/health-mart",
    },
    {
      title: "Lab Tests",
      subtitle: "at Your Fingertips",
      icon: "🧪",
      link: "/lab-tests",
    },
    {
      title: "Audio/Video",
      subtitle: "Consultation",
      icon: "📞",
      link: "/online-consultation",
    },
    {
      title: "Medicines",
      subtitle: "to Your Doorstep",
      icon: "💊",
      link: "/health-mart",
    },
    { title: "Doctor Near Me", subtitle: "General Doctors", icon: "👨‍⚕️" },
    { title: "Marketplace", subtitle: "Health Packages", icon: "🛍️" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const doctorData = await getDoctorList();
        setDoctors(doctorData);
        const uniqueSpecializations = [
          ...new Set(doctorData.map((doc) => doc.specialization)),
        ];
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
      }
    };

    const fetchHospitals = async () => {
      try {
        const hospitalData = await getHospitalList();
        setHospitals(hospitalData);
      } catch (error) {
        console.error("Failed to fetch hospitals:", error);
      }
    };

    fetchDoctors();
    fetchHospitals();
  }, []);

  const filteredDoctors_ = inputValue
    ? doctors.filter((doc) =>
        doc.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      if (hospital || specialization) {
        const results = await getDoctorsByHospitalsAnsSpecialization(
          hospital === "Any Hospital" ? "" : hospital,
          specialization
        );
        setFilteredDoctors(results);
        setdoctorByNameResult(null);
      } else if (inputValue) {
        const doctorInfo = await getDoctorByName(inputValue);
        setdoctorByNameResult(doctorInfo);
        setFilteredDoctors([]);
        setTimeout(() => {
          doctorRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 200);
      } else {
        alert("Please enter a doctor name or choose a filter.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Failed to fetch doctor data.");
    }
  };

  const getNextDateForWeekday = (weekdayName) => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const today = new Date();
    const todayIndex = today.getDay();
    const targetIndex = weekdays.indexOf(weekdayName);

    let daysToAdd = (targetIndex - todayIndex + 7) % 7;
    if (daysToAdd === 0) daysToAdd = 7;

    const nextDate = new Date();
    nextDate.setDate(today.getDate() + daysToAdd);

    return nextDate.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow w-full">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center text-center overflow-hidden text-white">
          <AnimatePresence>
            <motion.div
              key={images[index]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${images[index]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </section>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="max-w-[40%] mx-auto -mt-110 bg-white/60 rounded-2xl shadow-lg p-6 px-8 relative z-10"
        >
          <h2 className="text-center text-2xl font-semibold mb-4 text-red-500">
            Channel Your Doctor
          </h2>

          <div className="flex flex-col gap-4">
            <div className="relative items-center border rounded-lg bg-gray-50">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                placeholder="Type doctor name..."
                className="w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none"
                disabled={
                  (hospital && hospital !== "Any Hospital") ||
                  (specialization && specialization !== "")
                }
              />
              {inputValue && showSuggestions && (
                <ul className="absolute w-full bg-white shadow-md rounded mt-1 z-20 max-h-60 overflow-auto">
                  {filteredDoctors_.length > 0 ? (
                    filteredDoctors_.map((doc, idx) => (
                      <li
                        key={idx}
                        // Use onMouseDown instead of onClick to ensure it triggers BEFORE onBlur
                        onMouseDown={() => handleDoctorSelect(doc.name)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-gray-500">
                          {doc.specialization}
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-gray-400">
                      No matches found
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Hospital Dropdown */}
            <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
              <Hospital className="ml-2 text-gray-400" size={18} />
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full p-2 outline-none bg-transparent"
              >
                <option>Any Hospital</option>
                {hospitals.map((h, idx) => (
                  <option key={idx} value={h.name || h}>
                    {h.name || h}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialization Dropdown */}
            <div className="flex items-center border rounded-lg overflow-hidden bg-gray-50">
              <Search className="ml-2 text-gray-400" size={18} />
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full p-2 outline-none bg-transparent"
              >
                <option value="">Any Specialization</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:brightness-110 transition shadow"
          >
            Search
          </button>
        </form>

        {/* Services Section */}
        <div className="flex flex-wrap justify-center bg-transparent py-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {doctorByNameResult?.doctor && (
          <div
            ref={doctorRef}
            className="max-w-4xl mx-auto mt-12 bg-white border border-gray-400 shadow-lg rounded-xl overflow-hidden"
          >
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 border-b">
              <img
                src={doctorByNameResult.doctor.profilePicture}
                alt={doctorByNameResult.doctor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 shadow-sm"
              />
              <div className="text-center md:text-left space-y-1">
                <h3 className="text-2xl font-bold text-gray-800">
                  {doctorByNameResult.doctor.name}
                </h3>
                <p className="text-lg text-yellow-600 font-semibold">
                  {doctorByNameResult.doctor.Specialization}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Phone:</strong>{" "}
                  {doctorByNameResult.doctor.phoneNumber}
                </p>
              </div>
            </div>

            {/* Availability Section */}
            <div className="p-6">
              <h4 className="text-xl font-semibold text-gray-700 mb-4">
                Weekly Availability
              </h4>

              <div className="space-y-4">
                {Object.entries(doctorByNameResult.availability).map(
                  ([day, slots]) => (
                    <div key={day}>
                      <p className="font-semibold text-gray-800 mb-1">
                        {day}{" "}
                        <span className="text-sm text-gray-500">
                          ({getNextDateForWeekday(day)})
                        </span>
                      </p>
                      {slots.length > 0 ? (
                        <ul className="space-y-2">
                          {slots.map((slot, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded border"
                            >
                              <span className="text-sm text-gray-700">
                                <strong>{slot.hospitalName}</strong> —{" "}
                                {slot.timeSlot}
                              </span>
                              <button
                                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
                                onClick={() => {
                                  setSelectedSlot({
                                    ...slot,
                                    date: getNextDateForWeekday(day),
                                  });
                                  setShowUrgencyModal(true);
                                }}
                              >
                                Channel
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 ml-4">
                          No availability
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {showUrgencyModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                  <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Select Urgency Level
                  </h2>

                  <div className="flex justify-center gap-3 mb-6">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        className={`w-10 h-10 rounded-full border-2 ${
                          urgency === num
                            ? "bg-blue-600 text-white border-blue-700"
                            : "bg-white text-blue-600 border-blue-300 hover:bg-blue-100"
                        }`}
                        onClick={() => setUrgency(num)}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      onClick={() => {
                        setShowUrgencyModal(false);
                        setUrgency(1);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={async () => {
                        try {
                          const patientUsername = JSON.parse(
                            localStorage.getItem("profile")
                          )?.username;

                          await bookAppointment({
                            doctorUsername: doctorByNameResult.doctor.username,
                            patientUsername: user.username,
                            hospitalName: selectedSlot.hospitalName,
                            date: selectedSlot.date, // ✅ use dynamic date
                            timeSlot: selectedSlot.timeSlot,
                            urgency,
                          });

                          alert("Appointment booked successfully!");
                          setShowUrgencyModal(false);
                          setUrgency(1);
                        } catch (err) {
                          console.error(err);
                          alert(err.message || "Failed to book appointment");
                        }
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {filteredDoctors.length > 0 && (
          <div className="max-w-4xl mx-auto mt-12 bg-white border border-gray-400 shadow-lg rounded-xl overflow-hidden p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Available Doctors
            </h2>
            <div className="space-y-4">
              {filteredDoctors.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded hover:shadow-md transition"
                >
                  <div>
                    <p className="text-lg font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.specialization}
                    </p>
                    <p className="text-sm text-gray-500">{doc.phoneNumber}</p>
                  </div>
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleDoctorSelect(doc.name)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
