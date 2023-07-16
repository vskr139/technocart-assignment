// Write your code here
import React, {useState, useEffect} from 'react'

import axios from 'axios'

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([])
  const [filters, setFilters] = useState({
    financialYear: '',
    invoiceNumber: '',
    startDate: '',
    endDate: '',
  })

  const fetchInvoices = async () => {
    try {
      const response = await axios.get('/invoices')
      setInvoices(response.data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleFilterChange = e => {
    const {name, value} = e.target
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }))
  }

  const handleFilterSubmit = async e => {
    e.preventDefault()
    try {
      const response = await axios.get('/invoices/filter', {
        params: filters,
      })
      setInvoices(response.data)
    } catch (error) {
      console.error('Error filtering invoices:', error)
    }
  }

  return (
    <div className="dashboard-container">
      <h2>Invoice Dashboard</h2>
      {/* Render filters */}
      <form onSubmit={handleFilterSubmit}>
        <div className="form-group">
          <label htmlFor="financialYear">Financial Year:</label>
          <input
            type="text"
            id="financialYear"
            value={filters.financialYear}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number:</label>
          <input
            type="text"
            id="invoiceNumber"
            value={filters.invoiceNumber}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <button type="submit">Filter</button>
      </form>
      <h3>Invoices:</h3>
      {/* Render invoices */}
    </div>
  )
}

export default InvoiceDashboard
