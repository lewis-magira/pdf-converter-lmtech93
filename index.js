const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const upload = multer();

const API_KEY = process.env.API_KEY;

app.post('/convert', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Arquivo não enviado' });

  const form = new FormData();
  form.append('file', req.file.buffer, req.file.originalname);
  form.append('name', req.file.originalname);
  form.append('async', 'false');

  try {
    const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/doc', {
      method: 'POST',
      headers: { 'x-api-key': API_KEY },
      body: form
    });
    const data = await response.json();
    return res.json({ url: data.url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Erro na conversão' });
  }
});

module.exports = app;
