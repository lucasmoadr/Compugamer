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

---

Para más detalles, revisa el código fuente y los endpoints de los controladores.

