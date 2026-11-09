import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Camera, X } from "lucide-react";
import { Modal } from "./modal";

type UserRole = "Student" | "Faculty" | "CR" | "Admin";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
};

const roleOptions: UserRole[] = ["Student", "Faculty", "CR", "Admin"];

const commonFields = [
  { name: "fullName", label: "Full Name", type: "text" },
  { name: "collegeEmail", label: "College Email", type: "email" },
  { name: "personalEmail", label: "Personal Email", type: "email" },
  { name: "mobileNumber", label: "Mobile Number", type: "tel" },
  { name: "department", label: "Department", type: "select", options: ["CSE", "ECE", "MECH", "CIVIL", "MBA"] },
  { name: "academicYear", label: "Academic Year", type: "select", options: ["2024", "2025", "2026"] },
  { name: "semester", label: "Semester", type: "select", options: ["1", "2", "3", "4", "5", "6", "7", "8"] },
  { name: "className", label: "Class", type: "select", options: ["Data Structures", "Microprocessors", "Thermodynamics", "Concrete Design", "Operating Systems"] },
  { name: "section", label: "Section", type: "select", options: ["A", "B", "C"] },
  { name: "assignedSubjects", label: "Assigned Subjects", type: "text" },
  { name: "password", label: "Password", type: "password" },
  { name: "confirmPassword", label: "Confirm Password", type: "password" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
  { name: "permissions", label: "Permissions", type: "text" },
  { name: "notes", label: "Notes", type: "textarea" },
];

const roleSpecificFields: Record<UserRole, Array<{ name: string; label: string; type?: string; options?: string[] }>> = {
  Student: [
    { name: "rollNumber", label: "Roll Number", type: "text" },
  ],
  Faculty: [
    { name: "employeeId", label: "Employee ID", type: "text" },
  ],
  CR: [
    { name: "rollNumber", label: "Roll Number", type: "text" },
  ],
  Admin: [
    { name: "adminCode", label: "Admin Code", type: "text" },
  ],
};

const initialState = {
  fullName: "",
  collegeEmail: "",
  personalEmail: "",
  mobileNumber: "",
  department: "CSE",
  academicYear: "2025",
  semester: "5",
  className: "Data Structures",
  section: "A",
  assignedSubjects: "",
  password: "",
  confirmPassword: "",
  status: "Active",
  permissions: "Read & Write",
  notes: "",
  rollNumber: "",
  employeeId: "",
  adminCode: "",
};

export function AddUserModal({ isOpen, onClose, defaultRole = "Student" }: AddUserModalProps) {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [form, setForm] = useState(initialState);

  const fields = useMemo(() => {
    return [...commonFields, ...roleSpecificFields[role]];
  }, [role]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setForm(initialState);
    setRole(defaultRole);
  };

  const handleSave = () => {
    onClose();
    reset();
  };

  const handleSaveAndAddAnother = () => {
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-5xl rounded-[28px] border border-white/70 bg-white/95 p-0 shadow-2xl dark:border-slate-800 dark:bg-slate-950/95" showCloseButton>
      <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-500">User Management</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">Create {role} Account</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A single reusable creator for every user type with shared validation and role-specific fields.</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <X size={16} />
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] bg-slate-50/90 p-4 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/20">
                <Camera size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Profile Photo</p>
                <p className="text-sm text-slate-500">Upload a clear student or faculty image</p>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              Drag & drop image here or browse file
            </div>
            <div className="mt-4 rounded-[18px] bg-white p-3 dark:bg-slate-800">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                {roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {field.options?.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.name as keyof typeof form]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button onClick={onClose} className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Cancel</button>
          <button onClick={handleSaveAndAddAnother} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Save & Add Another</button>
          <button onClick={handleSave} className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
        </div>
      </div>
    </Modal>
  );
}
