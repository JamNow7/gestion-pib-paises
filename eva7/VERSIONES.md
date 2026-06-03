# 📚 Versiones de la API

Documentación de las diferentes versiones disponibles en la API de Gestión de Países.

---

## 🔗 **Endpoints Disponibles**

### **Versión 1 (v1)** - Estable y Probada
- `GET /api/v1/paises` - Listado de países
- `POST /api/v1/paises` - Crear país
- `DELETE /api/v1/paises/:nombre` - Eliminar país

### **Versión 2 (v2)** - Nueva con Mejoras ✨
- `GET /api/v2/paises` - Listado con metadata mejorada
- `POST /api/v2/paises` - Crear país con respuesta detallada
- `DELETE /api/v2/paises/:nombre` - Eliminar con confirmación
- `GET /api/v2/paises/continente/:continente` - **NUEVO: Búsqueda por continente**

---

## 🆚 **Diferencias Entre Versiones**

### **Formato de Respuesta**

**V1 - Formato simple:**
```json
{
  "ok": true,
  "data": [
    {
      "nombre": "Chile",
      "continente": "América",
      "poblacion": 19000000,
      "pib_2019": 280000,
      "pib_2020": 270000
    }
  ]
}
```

**V2 - Formato mejorado con metadata:**
```json
{
  "success": true,
  "result": {
    "countries": [
      {
        "nombre": "Chile",
        "continente": "América", 
        "poblacion": 19000000,
        "pib_2019": 280000,
        "pib_2020": 270000
      }
    ],
    "pagination": {
      "total": 5,
      "limit": 10,
      "offset": 0,
      "hasMore": false
    },
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "2.0"
  }
}
```

### **Manejo de Errores**

**V1 - Errores simples:**
```json
{
  "ok": false,
  "message": "Error al obtener países"
}
```

**V2 - Errores detallados:**
```json
{
  "success": false,
  "error": "Error interno del servidor",
  "details": "Descripción detallada del error (solo en desarrollo)"
}
```

### **Nuevas Funcionalidades en V2**

1. **Metadata de paginación mejorada** - Incluye `total` y `hasMore`
2. **Timestamp en respuestas** - Marca temporal de cada consulta
3. **Datos de confirmación** - Al crear/eliminar devuelve los datos afectados
4. **Búsqueda por continente** - Nuevo endpoint especializado
5. **Respuestas más descriptivas** - Mejor estructura de datos

---

## 🚀 **Migración de V1 a V2**

### **Cambios Requeridos**

1. **Actualizar URLs:**
   ```javascript
   // Antes (V1)
   fetch('http://localhost:4000/api/v1/paises')
   
   // Después (V2)
   fetch('http://localhost:4000/api/v2/paises')
   ```

2. **Adaptar formato de respuesta:**
   ```javascript
   // V1
   response.data  // Array directo
   
   // V2
   response.result.countries  // Array anidado
   response.result.pagination  // Metadata adicional
   ```

3. **Aprovechar nuevas funcionalidades:**
   ```javascript
   // Búsqueda por continente (solo V2)
   fetch('http://localhost:4000/api/v2/paises/continente/America')
   ```

---

## 📋 **Guía de Uso por Versión**

### **Usar V1 cuando:**
- ✅ Tienes un sistema en producción estable
- ✅ No necesitas las nuevas funcionalidades
- ✅ Prefieres simplicidad sobre metadata adicional
- ✅ Tienes integraciones que no puedes modificar

### **Usar V2 cuando:**
- ✅ Estás desarrollando nuevas integraciones
- ✅ Necesitas mejor paginación y metadata
- ✅ Quieres usar la búsqueda por continente
- ✅ Prefieres respuestas más detalladas
- ✅ Necesitas timestamps en las operaciones

---

## ⚠️ **Política de Deprecación**

- **V1**: Mantendremos soporte indefinido (sin fecha de remoción)
- **V2**: Versión actual recomendada para nuevos desarrollos
- **V3**: En desarrollo (próximas funcionalidades)

---

## 🔮 **Roadmap de Versiones**

### **Próximas características en V3:**
- [ ] Filtros avanzados (rango de PIB, población)
- [ ] Ordenamiento configurable
- [ ] Búsqueda full-text
- [ ] Exportación a CSV/Excel
- [ ] Caché de respuestas
- [ ] Rate limiting

---

**Versión actual recomendada: V2** 🚀

Para más información, consulta la documentación principal del proyecto.