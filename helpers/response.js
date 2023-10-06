class Response {
  // Método para respuestas de éxito
  success(res, msg, data, status = 200) {
    return res.status(status).json({
      ok: true,
      msg,
      data,
    });
  }

  // Método para respuestas de error
  error(res, msg, status = 500) {
    return res.status(status).json({
      ok: false,
      msg,
      data: "",
    });
  }
  
  // Método para respuestas con datos y mensaje personalizado
  custom(res, msg, data, status = 200) {
    return res.status(status).json({
      ok: true,
      msg,
      data,
    });
  }

  // Método para respuestas de redirección
  redirect(res, url, status = 302) {
    return res.redirect(status, url);
  }
}

module.exports = Response;
