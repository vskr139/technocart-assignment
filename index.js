const express = require('express')

const app = express()

const MongoClient = require('mongodb').MongoClient

const connectionString =
  'mongodb+srv://vskratlas139:Vskr@139@vskr.oqztjnz.mongodb.net/invoice-db?retryWrites=true&w=majority'

MongoClient.connect(connectionString)
  .then(client => {
    console.log('connected to database')
    const db = client.db('invoice-db')
    const invoiceCollection = db.collection('to-create-invoice')

    // API endpoints

    // 1. Create a new invoice
    app.post('/invoices', (req, res) => {
      const {invoiceDate, invoiceNumber, invoiceAmount} = req.body
      const financialYear = calculateFinancialYear(invoiceDate)

      // Validate invoice date
      db.get(
        'SELECT * FROM invoices WHERE invoiceNumber = ? ORDER BY invoiceDate DESC',
        [invoiceNumber],
        (err, row) => {
          if (err) {
            console.error(err)
            return res.status(500).json({error: 'Server error'})
          }

          if (
            (row && invoiceDate <= row.invoiceDate) ||
            (row && invoiceDate >= row.invoiceDate)
          ) {
            return res.status(400).json({error: 'Invalid invoice date'})
          }

          db.run(
            'INSERT INTO invoices (invoiceDate, invoiceNumber, invoiceAmount, financialYear) VALUES (?, ?, ?, ?)',
            [invoiceDate, invoiceNumber, invoiceAmount, financialYear],
            function (err) {
              if (err) {
                console.error(err)
                return res.status(500).json({error: 'Server error'})
              }
              res.status(201).json({
                id: this.lastID,
                invoiceDate,
                invoiceNumber,
                invoiceAmount,
                financialYear,
              })
            },
          )
        },
      )
    })

    // 2. Update a specific invoice by invoice number
    app.put('/invoices/:invoiceNumber', (req, res) => {
      const {invoiceNumber} = req.params
      const {invoiceDate, invoiceAmount} = req.body
      const financialYear = calculateFinancialYear(invoiceDate)

      db.run(
        'UPDATE invoices SET invoiceDate = ?, invoiceAmount = ?, financialYear = ? WHERE invoiceNumber = ?',
        [invoiceDate, invoiceAmount, financialYear, invoiceNumber],
        function (err) {
          if (err) {
            console.error(err)
            return res.status(500).json({error: 'Server error'})
          }

          if (this.changes === 0) {
            return res.status(404).json({error: 'Invoice not found'})
          }

          res.json({
            id: this.lastID,
            invoiceDate,
            invoiceNumber,
            invoiceAmount,
            financialYear,
          })
        },
      )
    })

    // 3. Delete a specific invoice by invoice number
    app.delete('/invoices/:invoiceNumber', (req, res) => {
      const {invoiceNumber} = req.params

      db.run(
        'DELETE FROM invoices WHERE invoiceNumber = ?',
        [invoiceNumber],
        function (err) {
          if (err) {
            console.error(err)
            return res.status(500).json({error: 'Server error'})
          }

          if (this.changes === 0) {
            return res.status(404).json({error: 'Invoice not found'})
          }

          res.json({message: 'Invoice deleted successfully'})
        },
      )
    })

    // 4. Get all invoices stored in the database
    app.get('/invoices', (req, res) => {
      db.all('SELECT * FROM invoices', (err, rows) => {
        if (err) {
          console.error(err)
          return res.status(500).json({error: 'Server error'})
        }
        res.json(rows)
      })
    })

    // 5. Filter invoices based on financial year, invoice number, and date range
    app.get('/invoices/filter', (req, res) => {
      const {financialYear, invoiceNumber, startDate, endDate} = req.query
      const filters = []

      if (financialYear) {
        filters.push(`financialYear = '${financialYear}'`)
      }

      if (invoiceNumber) {
        filters.push(`invoiceNumber = ${invoiceNumber}`)
      }

      if (startDate && endDate) {
        filters.push(`invoiceDate BETWEEN '${startDate}' AND '${endDate}'`)
      }

      const whereClause =
        filters.length > 0 ? 'WHERE ' + filters.join(' AND ') : ''

      db.all(`SELECT * FROM invoices ${whereClause}`, (err, rows) => {
        if (err) {
          console.error(err)
          return res.status(500).json({error: 'Server error'})
        }
        res.json(rows)
      })
    })

    // Helper function to calculate financial year
    function calculateFinancialYear(invoiceDate) {
      const year = invoiceDate.substring(0, 4)
      const nextYear = parseInt(year, 10) + 1
      const financialYear = `${year}-${nextYear.toString().substring(2)}`
      return financialYear
    }

    const port = 3000
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`)
    })
  })
  .catch(error => console.error(error))
