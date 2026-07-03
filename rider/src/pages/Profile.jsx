import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRider } from "../context/RiderContext.jsx";
import {
  User,
  Phone,
  Mail,
  Bike,
  Lock,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const VEHICLE_TYPES = ["Bike", "Bicycle", "Scooter"];

const STATUS_UI = {
  approved: {
    label: "Verified",
    icon: <CheckCircle size={14} />,
    cls: "bg-green-100 text-green-700",
  },
  pending: {
    label: "Pending",
    icon: <Clock size={14} />,
    cls: "bg-yellow-100 text-yellow-700",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle size={14} />,
    cls: "bg-red-100 text-red-600",
  },
};

const Profile = () => {
  const { rider, BASE_URL, authHeader, fetchProfile } = useRider();
  const [editing, setEditing] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: rider?.name || "",
    phone: rider?.phone || "",
    vehicleType: rider?.vehicleType || "Bike",
    vehicleNumber: rider?.vehicleNumber || "",
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePwdChange = (e) =>
    setPwdForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rider/profile/update`,
        form,
        authHeader(),
      );
      if (res.data.success) {
        toast.success("Profile updated");
        await fetchProfile();
        setEditing(false);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setSaving(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rider/change-password`,
        {
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
        },
        authHeader(),
      );
      if (res.data.success) {
        toast.success("Password changed");
        setChangingPwd(false);
        setPwdForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Failed");
    } finally {
      setSaving(false);
    }
  };

  const status = STATUS_UI[rider?.verificationStatus] || STATUS_UI.pending;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-dark">My Profile</h2>

      {/* Avatar + Status */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
        <img
          src={
            rider?.profileImage ||
            "https://ui-avatars.com/api/?name=" + rider?.name
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-yellow-100 mb-3"
        />
        <h3 className="font-bold text-dark text-lg">{rider?.name}</h3>
        <p className="text-gray-400 text-sm">{rider?.email}</p>

        {/* Verification badge */}
        <div
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mt-2 ${status.cls}`}
        >
          {status.icon}
          {status.label}
        </div>

        {/* Stats row */}
        <div className="flex justify-around mt-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-lg font-bold text-dark">
              {rider?.lifetimeDeliveries ?? 0}
            </p>
            <p className="text-xs text-gray-400">Deliveries</p>
          </div>
          <div>
            <p className="text-lg font-bold text-dark">
              ₹{rider?.totalEarnings ?? 0}
            </p>
            <p className="text-xs text-gray-400">Earned</p>
          </div>
          <div>
            <p className="text-lg font-bold text-dark capitalize">
              {rider?.vehicleType}
            </p>
            <p className="text-xs text-gray-400">Vehicle</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-dark">Personal Info</p>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-brand font-semibold"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="space-y-3">
            {[
              { name: "name", label: "Full Name", type: "text" },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "vehicleNumber", label: "Vehicle Number", type: "text" },
            ].map(({ name, label, type }) => (
              <div key={name}>
                <label className="text-xs text-gray-400 font-semibold block mb-1">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-yellow-100 transition"
                />
              </div>
            ))}

            <div>
              <label className="text-xs text-gray-400 font-semibold block mb-1">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                value={form.vehicleType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-brand transition"
              >
                {VEHICLE_TYPES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="w-full py-2.5 bg-brand text-dark font-bold rounded-xl text-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {[
              { icon: <User size={15} />, label: "Name", value: rider?.name },
              { icon: <Mail size={15} />, label: "Email", value: rider?.email },
              {
                icon: <Phone size={15} />,
                label: "Phone",
                value: rider?.phone,
              },
              {
                icon: <Bike size={15} />,
                label: "Vehicle",
                value: `${rider?.vehicleType} • ${rider?.vehicleNumber}`,
              },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                  {icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-semibold text-dark">{value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock size={15} className="text-gray-400" />
            <p className="text-sm font-bold text-dark">Change Password</p>
          </div>
          <button
            onClick={() => setChangingPwd(!changingPwd)}
            className="text-xs text-brand font-semibold"
          >
            {changingPwd ? "Cancel" : "Change"}
          </button>
        </div>

        {changingPwd && (
          <form onSubmit={changePassword} className="space-y-3">
            {[
              { name: "currentPassword", label: "Current Password" },
              { name: "newPassword", label: "New Password" },
              { name: "confirmPassword", label: "Confirm New Password" },
            ].map(({ name, label }) => (
              <div key={name}>
                <label className="text-xs text-gray-400 font-semibold block mb-1">
                  {label}
                </label>
                <input
                  type="password"
                  name={name}
                  value={pwdForm[name]}
                  onChange={handlePwdChange}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-yellow-100 transition"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 bg-brand text-dark font-bold rounded-xl text-sm disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>

      {/* Document Status */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-sm font-bold text-dark mb-3">Documents</p>
        {[
          { label: "Profile Photo", value: rider?.profileImage },
          { label: "Aadhaar Card", value: rider?.aadhaarImage },
          { label: "Driving License", value: rider?.licenseImage },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <span className="text-sm text-gray-500">{label}</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${value ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
            >
              {value ? "Uploaded" : "Missing"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
