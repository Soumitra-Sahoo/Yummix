import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Bike, Upload } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const VEHICLE_TYPES = ["Bike", "Bicycle", "Scooter"];

const formatFileName = (fileName, maxLength = 18) => {
  if (!fileName) return "";
  const lastDot = fileName.lastIndexOf(".");
  const extension = lastDot !== -1 ? fileName.slice(lastDot) : "";
  const name = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;

  if (name.length <= maxLength) {
    return fileName;
  }
  return `${name.slice(0, maxLength)}...${extension}`;
};

const FileField = ({
  label,
  name,
  onChange,
  file,
  accept = "image/*,.pdf",
}) => (
  <div>
    <label className="text-sm font-semibold text-gray-700 block mb-1.5">
      {label}
    </label>
    <label
      className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition
      ${
        file
          ? "border-green-300 bg-green-50"
          : "border-gray-200 bg-gray-50 hover:border-yellow-400"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Upload size={16} className={file ? "text-green-600" : "text-gray-400"} />
        <span
          className={`text-sm truncate ${
            file ? "text-green-700 font-medium" : "text-gray-400"
          }`}
        >
          {file ? formatFileName(file.name) : "Click to upload (image or PDF)"}
        </span>
      </div>

      {file && (
        <span className="shrink-0 text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
          Uploaded
        </span>
      )}

      <input type="file" name={name} onChange={onChange} accept={accept} hidden required/>
    </label>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    vehicleType: "Bike",
    vehicleNumber: "",
  });
  const [files, setFiles] = useState({
    profileImage: null,
    aadhaarImage: null,
    licenseImage: null,
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (e) =>
    setFiles((prev) => ({ ...prev, [e.target.name]: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.profileImage) {
      return toast.error("Profile photo is required");
    }
    if (!files.aadhaarImage) {
      return toast.error("Aadhaar card document is required");
    }
    if (!files.licenseImage) {
      return toast.error("Driving license document is required");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      Object.entries(files).forEach(([k, v]) => formData.append(k, v));

      const res = await axios.post(`${BASE_URL}/api/rider/register`, formData);
      if (res.data.success) {
        toast.success("Registration submitted! Awaiting admin approval.");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-yellow-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-50 rounded-2xl mb-2">
            <Bike size={28} className="text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-black">Join as Rider</h1>
          <p className="text-gray-400 text-sm mt-1">
            Delivery Partner Registration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="text-center text-lg font-bold text-gray-900 mb-5">
              Personal Information
            </h3>

            <div className="space-y-4">
              {[
                {
                  name: "name",
                  label: "Full Name",
                  type: "text",
                  placeholder: "Your Name",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  placeholder: "example@email.com",
                },
                {
                  name: "phone",
                  label: "Phone Number",
                  type: "tel",
                  placeholder: "9876543210",
                },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  placeholder: "Minimum 6 characters",
                },
              ].map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    {label}
                  </label>

                  <input
                    type={type}
                    name={name}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="text-center text-lg font-bold text-gray-900 mb-5">
              Vehicle Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  name="vehicleNumber"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="XX12AB1234"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                  Vehicle Type
                </label>

                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-yellow-500"
                >
                  {VEHICLE_TYPES.map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <div className="text-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Upload Documents
              </h3>
            </div>

            <div className="space-y-4">
              <FileField
                label="Profile Photo"
                name="profileImage"
                file={files.profileImage}
                onChange={handleFile}
                accept="image/*"
              />
              <FileField
                label="Aadhaar Card"
                name="aadhaarImage"
                file={files.aadhaarImage}
                onChange={handleFile}
              />
              <FileField
                label="Driving License"
                name="licenseImage"
                file={files.licenseImage}
                onChange={handleFile}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full mx-auto block py-3.5 rounded-2xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base shadow-lg shadow-yellow-200 transition-all disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Register as Rider"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8">
          Already registered?{" "}
          <Link to="/login" className="text-brand font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
