# 📱 Solución para iOS - "Servidor no encontrado"

## ⚠️ Problema

En iOS, cuando escaneas un QR code con `localhost` o `127.0.0.1`, aparece "Servidor no encontrado" porque iOS no puede acceder a localhost desde la red.

## ✅ Solución

### Opción 1: Usar la IP de Red Local (Recomendado)

1. **Buscar la IP de red en la consola:**
   - Cuando ejecutas `npm run dev`, Vite muestra algo como:
   ```
   ➜  Network: http://192.168.1.97:3002
   ```

2. **Usar la IP en el QR:**
   - Ve a `/download` o haz clic en "QR Code"
   - Verás una advertencia amarilla
   - Ingresa la IP que viste en la consola (ej: `192.168.1.97`)
   - Haz clic en "Usar IP"
   - El QR se actualizará automáticamente

3. **Escanear el nuevo QR:**
   - Ahora el QR tendrá la IP de red
   - Escanea con tu iPhone/iPad
   - ¡Funcionará perfectamente!

### Opción 2: Usar el Banner de Instalación

1. **Ver el banner de instalación:**
   - Aparece automáticamente en la parte superior de todas las páginas
   - Si es iOS, muestra instrucciones específicas

2. **Instalar manualmente:**
   - Abre Safari en tu iPhone/iPad
   - Ve a la URL usando la IP de red (no localhost)
   - Toca el botón de compartir (cuadrado con flecha)
   - Selecciona "Agregar a pantalla de inicio"
   - ¡Listo!

### Opción 3: Acceso Directo (Sin QR)

1. **En tu iPhone/iPad:**
   - Abre Safari
   - Escribe manualmente: `http://TU_IP:3002`
   - Reemplaza `TU_IP` con la IP que viste en la consola
   - Ejemplo: `http://192.168.1.97:3002`

2. **Instalar:**
   - Una vez cargada la página
   - Toca el botón de compartir
   - Selecciona "Agregar a pantalla de inicio"

---

## 🎯 Cómo Encontrar tu IP de Red

### En Windows:

1. Abre PowerShell o CMD
2. Ejecuta: `ipconfig`
3. Busca "IPv4 Address" en "Adaptador de Ethernet" o "Adaptador inalámbrico"
4. Debería ser algo como: `192.168.1.97` o `192.168.0.XXX`

### En Mac/Linux:

1. Abre Terminal
2. Ejecuta: `ifconfig` o `ip addr`
3. Busca la IP en `en0` (Ethernet) o `en1` (WiFi)
4. Debería ser algo como: `192.168.1.97`

### O simplemente:

**Mira la consola donde ejecutaste `npm run dev`** - Vite muestra la IP automáticamente:
```
➜  Local:   http://localhost:3002/
➜  Network: http://192.168.1.97:3002/
```

---

## 📝 Pasos Detallados

### 1. Encontrar la IP:
```bash
# En la consola donde ejecutaste npm run dev, busca:
Network: http://192.168.1.XXX:3002
```

### 2. Usar la IP en el QR:
1. Ve a `/download` o haz clic en "QR Code"
2. Verás un campo amarillo con "⚠️ Para iOS: Usa la IP de Red"
3. Ingresa la IP (ej: `192.168.1.97`)
4. Haz clic en "Usar IP"
5. El QR se actualiza automáticamente

### 3. Escanear en iOS:
1. Abre la cámara en tu iPhone/iPad
2. Escanea el QR actualizado
3. Se abrirá Safari con la URL correcta
4. ¡Funcionará!

### 4. Instalar en iOS:
1. Una vez abierta la app en Safari
2. Toca el botón de compartir (cuadrado con flecha) en la parte inferior
3. Desplázate hacia abajo
4. Toca "Agregar a pantalla de inicio"
5. Toca "Agregar" en la esquina superior derecha
6. ¡Listo! La app estará en tu pantalla de inicio

---

## 🔧 Verificación

### Verificar que funciona:

1. **En tu PC:**
   - Abre la consola donde ejecutaste `npm run dev`
   - Verás: `Network: http://192.168.1.XXX:3002`

2. **En tu iPhone/iPad:**
   - Asegúrate de estar en la misma red Wi-Fi
   - Abre Safari
   - Escribe: `http://192.168.1.XXX:3002` (reemplaza XXX con tu IP)
   - Debe cargar la aplicación

3. **Si no funciona:**
   - Verifica que ambos dispositivos estén en la misma red Wi-Fi
   - Verifica que el firewall de Windows permita el puerto 3002
   - Verifica que el servidor esté corriendo

---

## 🎉 Resultado

Una vez configurado:
- ✅ El QR funciona en iOS
- ✅ Puedes acceder desde tu iPhone/iPad
- ✅ Puedes instalar la app en la pantalla de inicio
- ✅ Funciona como una app nativa

---

## 💡 Nota Importante

**La IP se guarda automáticamente** en localStorage, así que solo necesitas ingresarla una vez. La próxima vez que abras la página de descarga, usará la IP guardada automáticamente.

---

¿Necesitas ayuda para encontrar tu IP o configurar algo más? 🚀


