"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "../../styles/employee-modal.module.css";

export default function EmployeeModal({ employee, onClose, onSuccess }) {
  console.log("employee: ", employee);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditMode = !!employee;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: employee || {},
  });

  const password = watch("password");

  useEffect(() => {
    if (employee) {
      Object.keys(employee).forEach((key) => {
        setValue(key, employee[key]);
      });
    }
  }, [employee, setValue]);

  const onSubmit = async (data) => {
    console.log("data: ", data);
      const storedUser = localStorage.getItem("userData")
      const u_id = storedUser ? JSON.parse(storedUser)?.id : null

    data.reporting_manager_id = u_id || null;
    try {
      setLoading(true);
      setError("");

      const url = isEditMode
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/employees/${employee.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/employees`;

      const method = isEditMode ? "put" : "post";

      //   await axios[method](url, data)

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEditMode ? "Update Employee" : "Add New Employee"}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.scrollArea}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    First Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("first_name", {
                      required: "First name is required",
                    })}
                    className={styles.input}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <span className={styles.fieldError}>
                      {errors.first_name.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Last Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("last_name", {
                      required: "Last name is required",
                    })}
                    className={styles.input}
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <span className={styles.fieldError}>
                      {errors.last_name.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={styles.input}
                    placeholder="email@company.com"
                  />
                  {errors.email && (
                    <span className={styles.fieldError}>
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Phone <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone is required",
                      pattern: {
                        value:
                          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    className={styles.input}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <span className={styles.fieldError}>
                      {errors.phone.message}
                    </span>
                  )}
                </div>

                {!isEditMode && (
                  <>
                    <div className={styles.field}>
                      <label className={styles.label}>
                        Password <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        className={styles.input}
                        placeholder="Enter password"
                      />
                      {errors.password && (
                        <span className={styles.fieldError}>
                          {errors.password.message}
                        </span>
                      )}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label}>
                        Confirm Password{" "}
                        <span className={styles.required}>*</span>
                      </label>
                      <input
                        type="password"
                        {...register("confirm_password", {
                          required: "Please confirm password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className={styles.input}
                        placeholder="Confirm password"
                      />
                      {errors.confirm_password && (
                        <span className={styles.fieldError}>
                          {errors.confirm_password.message}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Date of Birth <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                    className={styles.input}
                  />
                  {errors.dob && (
                    <span className={styles.fieldError}>
                      {errors.dob.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Gender <span className={styles.required}>*</span>
                  </label>
                  <select
                    {...register("gender", { required: "Gender is required" })}
                    className={styles.select}
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && (
                    <span className={styles.fieldError}>
                      {errors.gender.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Marital Status <span className={styles.required}>*</span>
                  </label>
                  <select
                    {...register("marital_status", {
                      required: "Marital status is required",
                    })}
                    className={styles.select}
                  >
                    <option value="">Select status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                  </select>
                  {errors.marital_status && (
                    <span className={styles.fieldError}>
                      {errors.marital_status.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Nationality <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("nationality", {
                      required: "Nationality is required",
                    })}
                    className={styles.input}
                    placeholder="Enter nationality"
                  />
                  {errors.nationality && (
                    <span className={styles.fieldError}>
                      {errors.nationality.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Personal Email <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    {...register("personal_email", {
                      required: "Personal email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={styles.input}
                    placeholder="personal@email.com"
                  />
                  {errors.personal_email && (
                    <span className={styles.fieldError}>
                      {errors.personal_email.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Address Information</h3>
              <div className={styles.grid}>
                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    Present Address <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    {...register("present_address", {
                      required: "Present address is required",
                    })}
                    className={styles.textarea}
                    placeholder="Enter present address"
                    rows={3}
                  />
                  {errors.present_address && (
                    <span className={styles.fieldError}>
                      {errors.present_address.message}
                    </span>
                  )}
                </div>

                <div className={styles.fieldFull}>
                  <label className={styles.label}>
                    Permanent Address <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    {...register("permanent_address", {
                      required: "Permanent address is required",
                    })}
                    className={styles.textarea}
                    placeholder="Enter permanent address"
                    rows={3}
                  />
                  {errors.permanent_address && (
                    <span className={styles.fieldError}>
                      {errors.permanent_address.message}
                    </span>
                  )}
                </div>
              </div>
            </div>


            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Bank Details</h3>
              <div className={styles.grid}>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Account Number <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("account_number", {
                      required: "Account number is required",
                    })}
                    className={styles.input}
                    placeholder="Enter account number"
                  />
                  {errors.account_number && (
                    <span className={styles.fieldError}>
                      {errors.account_number.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    Bank Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("bank_name", {
                      required: "Bank name is required",
                    })}
                    className={styles.input}
                    placeholder="Enter bank name"
                  />
                  {errors.bank_name && (
                    <span className={styles.fieldError}>
                      {errors.bank_name.message}
                    </span>
                  )}
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>
                    IFSC Code <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("ifsc_code", {
                      required: "IFSC code is required",
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC code",
                      },
                    })}
                    className={styles.input}
                    placeholder="ABCD0123456"
                  />
                  {errors.ifsc_code && (
                    <span className={styles.fieldError}>
                      {errors.ifsc_code.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Employee"
              ) : (
                "Create Employee"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
