#!/bin/sh

# Cambiar al directorio /home/shodan
cd /home/shodan

# Activar el entorno virtual
source shodan-env/bin/activate

# Ejecutar el comando shodan con los argumentos que se le pasen al script
shodan "$@"

# Desactivar el entorno virtual
deactivate

