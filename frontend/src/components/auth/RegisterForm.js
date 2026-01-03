/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "../../styles/auth.module.css";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  console.log("logoFile: ", logoFile);
  const [logoPreview, setLogoPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Password strength calculator
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return Math.min(strength, 3);
  };

  // Handle file drag
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove file
  const removeFile = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setResponseMessage(null);

    try {
      const formData = new FormData();
      formData.append("company_name", data.company_name);
      formData.append("full_name", data.name);
      formData.append("email", data.email);
      formData.append("phone_number", data.phone_number);
      formData.append("password", data.password);
      formData.append("confirm_password", data.confirm_password);
      if (logoFile) {
        formData.append("company_logo", logoFile);
      }

      console.log("formData: ", ...formData);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("response: ", response);

      if (response.data?.status === "success") {
        setResponseMessage({
          type: "success",
          text: response.data.message || "Registration successful!",
        });

        if (response.data.data) {
          localStorage.setItem("userData", JSON.stringify(response.data.data));
        }

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } else {
        setResponseMessage({
          type: "error",
          text:
            response.data.message || "Registration failed. Please try again.",
        });
      }
    } catch (error) {
      console.log("[v0] Registration error:", error);
      setResponseMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.authWrapper}>
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <h1 className={styles.title}>Create Account</h1>
              <p className={styles.subtitle}>
                Start your journey with us today
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.authForm}>
              <div className={styles.formRow}>
                {/* Company Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="company_name" className={styles.label}>
                    Company Name
                  </label>
                  <input
                    id="company_name"
                    type="text"
                    placeholder="Enter company name"
                    className={`${styles.input} ${
                      errors.company_name ? styles.inputError : ""
                    }`}
                    {...register("company_name", {
                      required: "Company name is required",
                      minLength: {
                        value: 2,
                        message: "Company name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.company_name && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.company_name.message}
                    </span>
                  )}
                </div>
                {/* Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`${styles.input} ${
                      errors.name ? styles.inputError : ""
                    }`}
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.name.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    className={`${styles.input} ${
                      errors.email ? styles.inputError : ""
                    }`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.email.message}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone_number" className={styles.label}>
                    Phone Number
                  </label>
                  <input
                    id="phone_number"
                    type="tel"
                    placeholder="+1234567890"
                    className={`${styles.input} ${
                      errors.phone_number ? styles.inputError : ""
                    }`}
                    {...register("phone_number", {
                      required: "Phone number is required",
                      pattern: {
                        value:
                          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
                        message: "Invalid phone number",
                      },
                    })}
                  />
                  {errors.phone_number && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.phone_number.message}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formRow}>
                {/* Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="password" className={styles.label}>
                    Password
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className={`${styles.input} ${styles.passwordInput} ${
                        errors.password ? styles.inputError : ""
                      }`}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message:
                            "Password must contain uppercase, lowercase and number",
                        },
                      })}
                      onChange={(e) => {
                        setPasswordStrength(
                          calculatePasswordStrength(e.target.value)
                        );
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.eyeButton}
                    >
                      <svg
                        className={styles.eyeIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                        {!showPassword && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                  {password && (
                    <div className={styles.strengthMeter}>
                      <div
                        className={`${styles.strengthBar} ${
                          passwordStrength === 1
                            ? styles.strengthWeak
                            : passwordStrength === 2
                            ? styles.strengthMedium
                            : passwordStrength === 3
                            ? styles.strengthStrong
                            : ""
                        }`}
                      />
                    </div>
                  )}
                  {password && (
                    <div
                      className={styles.strengthText}
                      style={{
                        color:
                          passwordStrength === 1
                            ? "#ff6b6b"
                            : passwordStrength === 2
                            ? "#f5b24a"
                            : "#b9f27c",
                      }}
                    >
                      {passwordStrength === 1
                        ? "Weak password"
                        : passwordStrength === 2
                        ? "Medium password"
                        : "Strong password"}
                    </div>
                  )}
                  {errors.password && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="confirm_password" className={styles.label}>
                    Confirm Password
                  </label>
                  <div className={styles.passwordWrapper}>
                    <input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className={`${styles.input} ${styles.passwordInput} ${
                        errors.confirm_password ? styles.inputError : ""
                      }`}
                      {...register("confirm_password", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={styles.eyeButton}
                    >
                      <svg
                        className={styles.eyeIcon}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showConfirmPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        )}
                        {!showConfirmPassword && (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <span className={styles.errorMessage}>
                      ⚠ {errors.confirm_password.message}
                    </span>
                  )}
                </div>
              </div>

              {/* Logo Upload */}
              <div className={styles.formGroup}>
                <label className={styles.label}>Company Logo</label>
                <div className={styles.fileUploadWrapper}>
                  <div
                    className={`${styles.fileUploadContainer} ${
                      dragActive ? styles.dragActive : ""
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) =>
                        e.target.files[0] && handleFileChange(e.target.files[0])
                      }
                    />
                    {!logoPreview ? (
                      <>
                        <svg
                          className={styles.uploadIcon}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <p className={styles.uploadText}>
                          <span className={styles.uploadHighlight}>Upload</span>
                        </p>
                      </>
                    ) : (
                      <div className={styles.filePreview}>
                        <img
                          src={logoPreview || "/placeholder.svg"}
                          alt="Logo preview"
                          className={styles.previewImage}
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className={styles.removeButton}
                        >
                          <svg
                            width="16"
                            height="16"
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
                    )}
                  </div>
                </div>
              </div>

              {/* Response Message */}
              {responseMessage && (
                <div
                  className={`${styles.responseMessage} ${
                    responseMessage.type === "success"
                      ? styles.responseSuccess
                      : styles.responseError
                  }`}
                >
                  <svg
                    className={styles.responseIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {responseMessage.type === "success" ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    )}
                  </svg>
                  <span>{responseMessage.text}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} ${
                  isSubmitting ? styles.buttonLoading : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className={styles.spinner}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        style={{ opacity: 0.25 }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        style={{ opacity: 0.75 }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className={styles.authFooter}>
              <p className={styles.footerText}>
                Already have an account?{" "}
                <a href="/auth/login" className={styles.footerLink}>
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <svg
              className={styles.loadingSpinner}
              fill="none"
              viewBox="0 0 24 24"
              style={{ color: "#b9f27c" }}
            >
              <circle
                style={{ opacity: 0.25 }}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                style={{ opacity: 0.75 }}
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className={styles.loadingText}>Processing registration...</p>
          </div>
        </div>
      )}
    </>
  );
}
