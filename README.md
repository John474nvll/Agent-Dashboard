# Multi-Agent Voice & WhatsApp System

Sistema de desarrollo de negocios y ventas impulsado por IA que combina comunicación de voz en tiempo real (Retell AI) con mensajería de WhatsApp Business.

## Características

- **Agentes de Voz Especializados**: BDR y Ventas Técnicas con acentos regionales en español.
- **Integración con WhatsApp**: Comunicación bidireccional mediante la API de WhatsApp Business.
- **Dashboard de Estadísticas**: Visualización de métricas de llamadas y mensajes.
- **Configuración Dinámica**: Gestión de agentes, números de teléfono y herramientas.
- **Interfaz Moderna**: Tema "Verde Neón Bosque" con efectos de cristal (glassmorphism).

## Requisitos del Sistema

- **Node.js**: v20 o superior
- **Base de Datos**: PostgreSQL
- **APIs Externas**:
  - Retell AI (Voz)
  - Twilio / Meta WhatsApp Business API (Mensajería)

## Configuración

Es necesario configurar las siguientes variables de entorno:

- `DATABASE_URL`: Conexión a PostgreSQL.
- `RETELL_API_KEY`: Clave de API para Retell AI.
- `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN`: Credenciales de Twilio.
- `META_ACCESS_TOKEN`: Token de acceso para la API de Meta Business.

## Desarrollo

Para iniciar el entorno de desarrollo:

```bash
npm run dev
```

El servidor estará disponible en el puerto 5000.

## Arquitectura

- **Backend**: Express.js + TypeScript con Drizzle ORM.
- **Frontend**: React + Vite + Tailwind CSS + Radix UI.
- **Diseño**: Personalizado con paleta "Neon Forest Green" y componentes Shadcn.
- **Voz**: Retell AI SDK.
- **Mensajería**: WhatsApp Business SDK / Twilio.
