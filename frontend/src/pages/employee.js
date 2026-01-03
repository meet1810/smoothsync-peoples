/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import styles from "../styles/employee.module.css"
import EmployeeModal from "@/components/Dashboard/employee"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  console.log("employees: ", employees)
  const [filteredEmployees, setFilteredEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      const storedUser = localStorage.getItem("userData")
      const token = storedUser ? JSON.parse(storedUser)?.token : null

      if (!token) {
        console.error("Token not found")
        return
      }

      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log("response: ", response)
      setEmployees(response.data.data || [])
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees)
      return
    }
    const filtered = employees.filter(
      (emp) =>
        `${emp.name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setIsModalOpen(true)
  }

  const handleEditEmployee = async (employeeId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/employees/${employeeId}`)
      setSelectedEmployee(response.data)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error fetching employee details:", error)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  const handleSubmitSuccess = () => {
    fetchEmployees()
    handleCloseModal()
  }

  useEffect(() => {
    handleSearch()
  }, [searchQuery, employees])

  useEffect(() => {
    fetchEmployees()
  }, [])

  const getStatusColor = (status) => {
    const statusMap = {
      PRESENT: styles.statusPresent,
      ABSENT: styles.statusAbsent,
      HALF_DAY: styles.statusHalfDay,
      LEAVE: styles.statusLeave,
    }
    return statusMap[status] || styles.statusAbsent
  }

  const getStatusText = (status) => {
    const statusMap = {
      PRESENT: "Present",
      ABSENT: "Absent",
      HALF_DAY: "Half Day",
      LEAVE: "On Leave",
    }
    return statusMap[status] || status
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Employee Management</h1>
          <p className={styles.subtitle}>Manage your team members</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchWrapper}>
          <svg
            className={styles.searchIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search employees by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button onClick={handleAddEmployee} className={styles.addButton}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading employees...</p>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {filteredEmployees?.map((employee) => (
              <div key={employee.id} className={styles.card} onClick={() => handleEditEmployee(employee.id)}>
                <div className={styles.cardHeader}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={employee.profile_image || "/userimage.png" || "/placeholder.svg"}
                      alt={`${employee.name}`}
                      className={styles.image}
                    />
                  </div>
                  <span className={`${styles.status} ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </span>
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.name}>
                    {employee.first_name} {employee.last_name}
                  </h3>
                  <p className={styles.email}>{employee.email}</p>
                  <p className={styles.phone}>{employee.phone}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className={styles.empty}>
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p>No employees found</p>
            </div>
          )}
        </>
      )}

      {isModalOpen && (
        <EmployeeModal employee={selectedEmployee} onClose={handleCloseModal} onSuccess={handleSubmitSuccess} />
      )}
    </div>
  )
}
