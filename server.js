import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Servir archivos estáticos como index.html
app.use(express.static(__dirname))

// Ruta raíz
app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`)
})
