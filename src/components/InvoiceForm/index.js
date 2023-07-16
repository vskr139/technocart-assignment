// Write your code here
import React, {useState} from 'react'

import axios from 'axios'

const InvoiceForm = () => {
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: '',
    invoiceNumber: '',
    invoiceAmount: '',
  })

  const handleInputChange = e => {
    const {name, value} = e.target
    setInvoiceData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const response = await axios.post('/invoices', invoiceData)
      console.log('Invoice created:', response.data)
      // Reset the form after successful creation
      setInvoiceData({
        invoiceDate: '',
        invoiceNumber: '',
        invoiceAmount: '',
      })
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  return (
    <div className="form-container">
      <h2>Enter New Invoice Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="invoiceDate">Invoice Date:</label>
          <input
            type="date"
            id="invoiceDate"
            value={invoiceData.invoiceDate}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="invoiceNumber">Invoice Number:</label>
          <input
            type="text"
            id="invoiceNumber"
            value={invoiceData.invoiceNumber}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="invoiceAmount">Invoice Amount:</label>
          <input
            type="number"
            id="invoiceAmount"
            value={invoiceData.invoiceAmount}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  )
}

export default InvoiceForm
