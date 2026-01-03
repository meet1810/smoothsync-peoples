"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import styles from "@/styles/auth.module.css";
import { useRouter } from "next/router";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState(null);

  const validateEmail = (email) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMessage(null);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data?.success) {
        setResponseMessage({
          type: "success",
          text: res.data.message || "Login successful",
        });

        // store token
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // redirect
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      } else {
        setResponseMessage({
          type: "error",
          text: res.data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      setResponseMessage({
        type: "error",
        text:
          error?.response?.data?.message || "Login failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          {/* Header */}
          <div className={styles.authHeader}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to continue to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {/* Response Message */}
            {responseMessage && (
              <div
                className={`${styles.responseMessage} ${
                  responseMessage.type === "success"
                    ? styles.responseSuccess
                    : styles.responseError
                }`}
              >
                {responseMessage.type === "success" ? (
                  <CheckCircle className={styles.responseIcon} />
                ) : (
                  <AlertCircle className={styles.responseIcon} />
                )}
                <span>{responseMessage.text}</span>
              </div>
            )}

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6F7682",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Mail size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${
                    errors.email ? styles.inputError : ""
                  }`}
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
              {errors.email && (
                <div className={styles.errorMessage}>
                  <span>⚠</span>
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <div
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6F7682",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                >
                  <Lock size={20} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput} ${
                    errors.password ? styles.inputError : ""
                  }`}
                  style={{ paddingLeft: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.eyeButton}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className={styles.eyeIcon} />
                  ) : (
                    <Eye className={styles.eyeIcon} />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className={styles.errorMessage}>
                  <span>⚠</span>
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.submitButton} ${
                isSubmitting ? styles.buttonLoading : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className={styles.spinner} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className={styles.authFooter}>
            <p className={styles.footerText}>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className={styles.footerLink}>
                Create one now
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6F7682",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Lock size={12} />
              <span>Your data is secure and encrypted</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
