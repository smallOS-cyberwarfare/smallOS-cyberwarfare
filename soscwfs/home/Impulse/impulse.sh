#!/bin/bash

# Activar el entorno virtual
cd /home/Impulse

source /home/Impulse/bin/activate  # Ajusta la ruta según la ubicación de tu entorno virtual

cd /home/Impulse
# Ejecutar el script Python
python3 /home/Impulse/_impulse.py "$@"

# Desactivar el entorno virtual al finalizar (opcional)
deactivate

