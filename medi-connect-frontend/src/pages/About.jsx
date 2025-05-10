import { useEffect, useState } from "react";
import { CalendarCheck, Stethoscope, Smartphone } from "lucide-react";
import { ArrowUp } from "lucide-react";

const About = () => {
  const [scrollLevel, setScrollLevel] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    const handleScroll = () => {
      setScrollLevel(window.scrollY);
      toggleVisibility();
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0); // Ensure scroll starts at top
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed z-10 bottom-6 right-6 bg-black text-white p-3 rounded-full shadow-lg transition-transform duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      >
        <ArrowUp size={24} />
      </button>

      {/* Background Image with Parallax */}
      <div
        className="fixed top-0 left-0 w-full h-screen z-[-10]"
        style={{ transform: `translateY(-${scrollLevel * 0.3}px)` }}
      >
        <img
          src="wallpapers/slide_image3.jpg"
          alt="Medi-Connect Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="relative z-5 bg-white min-h-screen mt-[95vh] px-6 pt-10 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              About Medi-Connect
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Seamless Healthcare at Your Fingertips
            </p>
          </div>

          {/* Features Section */}
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <CalendarCheck className="h-6 w-6" />,
                title: "Online Appointments",
                desc: "Book appointments with doctors at your convenience—anytime, anywhere.",
              },
              {
                icon: <Stethoscope className="h-6 w-6" />,
                title: "Trusted Professionals",
                desc: "Find certified doctors and specialists across multiple medical fields.",
              },
              {
                icon: <Smartphone className="h-6 w-6" />,
                title: "User-Friendly App",
                desc: "Manage your medical schedule easily with a clean and responsive interface.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm p-6 text-center"
              >
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mx-auto">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Our Story Section */}
          <div className="mt-16">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
              <p className="mt-4 text-gray-600">
                Medi-Connect was developed to bridge the gap between patients
                and healthcare providers. In a world where time and
                accessibility matter, we aimed to create a platform that
                simplifies the process of finding the right doctor and securing
                timely appointments.
              </p>
              <p className="mt-4 text-gray-600">
                Whether you're scheduling a consultation, checking availability,
                or managing your medical visits, Medi-Connect provides a
                centralized, user-friendly experience. Our vision is to digitize
                healthcare access across the country and beyond, enabling
                faster, safer, and more convenient care for everyone.
              </p>
              <p className="mt-4 text-gray-600">
                With continued updates and integration of advanced features,
                Medi-Connect is on a mission to become your go-to healthcare
                companion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
