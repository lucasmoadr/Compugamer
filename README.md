# Compugamer (BACKEND)- Guía de Arquitectura y Instalación en Docker

## Arquitectura

Compugamer es una aplicación .NET 8 que gestiona estudiantes, buses y choferes utilizando una base de datos en memoria. La solución está organizada en capas para separar responsabilidades y facilitar el mantenimiento.

### Capas principales

- **Controladores (Controllers):**  
  Reciben las solicitudes HTTP y exponen los endpoints para cada entidad (`StudentController`, `BusController`, `DriverController`).

- **Servicios (Services):**  
  Implementan la lógica de negocio y manipulan los datos. Cada entidad tiene su propio servicio (`StudentService`, `BusService`, `DriverService`).  
  Por ejemplo, `StudentService` utiliza `BusService` para asignar estudiantes a buses.

- **Modelos de Datos (Data Models):**  
  Representan las entidades principales:  
  - `Student`: Estudiante, con propiedades como Id, Dni, Nombre, Edad y BusId.
  - `Bus`: Bus, con Id, Placa, Dni del chofer y lista de DNIs de estudiantes.
  - `Driver`: Chofer, con Id, Dni y Nombre.

- **Base de Datos en Memoria:**  
  El archivo `InMemoryDatabase.cs` contiene listas estáticas para almacenar estudiantes, buses y choferes durante la ejecución.

### Relaciones

- **Estudiante ↔ Bus:**  
  Cada estudiante puede estar asignado a un bus (`Student.BusId`).  
  Cada bus mantiene una lista de DNIs de estudiantes asignados (`Bus.StudentDnis`).

- **Bus ↔ Chofer:**  
  Cada bus puede tener un chofer asignado (`Bus.DriverDni`).

- **Servicios:**  
  Los servicios se comunican entre sí para realizar operaciones complejas, como asignar estudiantes a buses o choferes a buses.

## Estructura del Proyecto
```
Compugamer/
├── Controllers/
│ ├── StudentController.cs
│ ├── BusController.cs
│ └── DriverController.cs
│
├── Services/
│ ├── StudentService.cs
│ ├── BusService.cs
│ └── DriverService.cs
│
├── Data/
│ ├── Models/
│ │ ├── Student.cs
│ │ ├── Bus.cs
│ │ └── Driver.cs
│ │
│ └── InMemoryDatabase.cs
│
├── Program.cs
├── appsettings.json
└── ...
```

## Instalación y Ejecución en Docker

### Requisitos

- Tener Docker instalado en tu equipo.

### Pasos

1. **Clona el repositorio:**
git clone https://github.com/lucasmoadr/Compugamer.git cd Compugamer


2. **Construye la imagen de Docker:**

docker build -t compugamer .

docker run -d -p 8080:80 --name compugamer compugamer


3. **Accede a la API:**
   - Abre tu navegador o cliente de API y navega a:  
     `http://localhost:8080`

## Notas

- La aplicación utiliza una base de datos en memoria, por lo que los datos se pierden al reiniciar.

# FRONTEND

# Instrucciones para levantar el proyecto

- **Requisitos**
  - Node.js 18+ (recomendado LTS)
  - Angular CLI 19.x (`npm install -g @angular/cli`)
  - Backend en ejecución (API) accesible por HTTPS o HTTP

- **Instalación de dependencias**
  - En la raíz del frontend (`FrontEnd/compugamer`):
    - `npm ci` (preferido en CI) o `npm install`

- **Configurar la URL de la API**
  - Archivo: `src/app/app.config.ts`
  - Proveedor: `provideApi(...)`
  - Ejemplos:
    - Desarrollo HTTP local: `provideApi('http://localhost:8080')`
    - Desarrollo HTTPS local: `provideApi('https://localhost:44305')`
  - Asegurate de que el backend esté corriendo en esa URL. Si usás HTTPS con certificado local, el navegador puede pedir confiar en el certificado.

- **Ejecutar en modo desarrollo**
  - `ng serve -o`
  - Abre automáticamente `http://localhost:4200/`

- **Build de producción**
  - `ng build`
  - Salida en `dist/`

# Tecnologías utilizadas

- **Angular 19 (Standalone Components)**
- **TypeScript**
- **Angular Router** para ruteo (`src/app/app.routes.ts`)
- **Reactive Forms** para formularios y validaciones (`ReactiveFormsModule`)
- **HttpClient** + **SDK generado por OpenAPI** para consumir la API (`src/libs/api/...`)
- **RxJS** para programación reactiva
- **Bootstrap** (clases de UI presentes en las plantillas)
- Tooling de Angular 19 con **Vite** bajo el capó

# Estructura del proyecto (resumen)

- `src/app/`
  - `app.config.ts`: configuración principal (providers, `provideApi` de la URL del backend)
  - `app.routes.ts`: definición de rutas
  - `features/`
    - `bus/`
      - `bus-list/`: lista y acciones sobre buses
      - `bus-form/`: formulario de alta/edición de bus
    - `driver/`
      - `driver-list/`: lista de choferes (crear/editar/eliminar)
      - `driver-form/`: formulario reactivo del chofer (incluye DNI obligatorio)
    - `student/`
      - `student-list/`: lista de alumnos (crear/editar/eliminar)
      - `student-form/`: formulario reactivo del alumno (incluye DNI obligatorio)
- `src/libs/api/`
  - `api/`: servicios generados (p.ej. `bus.service.ts`, `driver.service.ts`, `student.service.ts`)
  - `model/`: interfaces generadas (p.ej. `Bus`, `Driver`, `Student`)
  - `swagger.json`: especificación OpenAPI fuente de la generación

# Relaciones del sistema

- **Bus**
  - Atributos relevantes: `id`, `plate`
  - Relación con **Driver**: 0..1 chofer asignado a cada bus
    - Se resuelve vía `Driver.busId` apuntando a `Bus.id`
  - Relación con **Student**: 0..N estudiantes asignados
    - Se resuelve vía `Student.busId` apuntando a `Bus.id`

- **Driver (Chofer)**
  - Atributos: `dni` (único), `name`, `age`, `licenseNumber`, `busId?`
  - Puede estar no asignado (`busId = null`) o asignado a un bus

- **Student (Alumno)**
  - Atributos: `dni` (único), `name`, `age`, `busId?`
  - Puede estar no asignado (`busId = null`) o asignado a un bus

# Flujo y reglas destacadas en el Frontend

- **Altas/Ediciones de Choferes y Alumnos**
  - Formularios reactivos con `dni` obligatorio (7–8 dígitos numéricos)
  - En los listados (`driver-list` / `student-list`), la decisión POST vs PUT se basa en si se está editando (`this.editing`) y no en la presencia de `dni`.

- **Asignaciones en Buses**
  - Asignar Chofer a Bus: `BusService.busBusIdAssignDriverDriverDniPost(busId, driverDni)`
  - Asignar Estudiante a Bus: `BusService.busBusIdAssignStudentStudentDniPost(busId, studentDni)`
  - En el listado de buses se muestra la cantidad de estudiantes asignados y, en un tooltip, sus nombres y DNIs.
  - En el listado de estudiantes se muestra la patente del bus asignado (si corresponde).

# Solución de problemas (Troubleshooting)

- **CORS / HTTPS locales**: si usás `https://localhost:44305`, puede requerir confiar el certificado en el navegador. Configurá CORS en la API para permitir el origen `http://localhost:4200` durante desarrollo.


---

Para más detalles, revisa el código fuente y los endpoints de los controladores.

