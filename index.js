const express = require('express') // Falta esto
const fs = require('fs')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.static(__dirname))

const file = 'visitas.json'

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({ visitas: 0 }))
}

app.get('/visitas', (req, res) => {
  let datos = JSON.parse(fs.readFileSync(file))
  datos.visitas++
  fs.writeFileSync(file, JSON.stringify(datos))
  res.json({ total: datos.visitas })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))