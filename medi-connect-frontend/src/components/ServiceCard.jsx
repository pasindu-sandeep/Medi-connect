import { Link } from "react-router-dom";

const ServiceCard = ({ title, subtitle, icon, isNew, link }) => (
  <Link
    to={link}
    className="relative w-36 p-4 border-2 border-red-500 rounded-md text-center bg-white m-2 block hover:shadow transition"
  >
    {isNew && (
      <div className="absolute top-0 left-0 -mt-2 -ml-2 bg-red-600 text-white text-xs px-2 py-1 rotate-[-45deg] origin-top-left shadow">
        NEW
      </div>
    )}
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-bold text-sm">{title}</div>
    <div className="text-xs text-gray-600">{subtitle}</div>
  </Link>
);

export default ServiceCard;
