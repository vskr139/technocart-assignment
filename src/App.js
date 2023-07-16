import React from 'react'
import InvoiceForm from './components/InvoiceForm'
import InvoiceDashboard from './components/InvoiceDashboard'
import './styles.css'

function App() {
  return (
    <div>
      <h1 className="app-title">Invoice Management System</h1>
      <InvoiceForm />
      <InvoiceDashboard />
    </div>
  )
}

export default App
