# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
# For more information, please see https://aka.ms/containercompat

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081


# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build 
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copia el archivo de proyecto y restaura dependencias
COPY Compugamer/Compugamer.csproj Compugamer/
RUN dotnet restore Compugamer/Compugamer.csproj

# Copia el resto del código fuente
COPY Compugamer/ Compugamer/
WORKDIR /src/Compugamer
RUN dotnet build Compugamer.csproj -c $BUILD_CONFIGURATION -o /app/build

# Publica la aplicación
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
WORKDIR /src/Compugamer
RUN dotnet publish Compugamer.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Imagen final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Compugamer.dll"]