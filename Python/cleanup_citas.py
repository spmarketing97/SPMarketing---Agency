import os
from datetime import datetime, timedelta

def cleanup_old_files():
    deletion_file = '../CITAS/.deletion_schedule'
    if not os.path.exists(deletion_file):
        return

    current_date = datetime.now().date()
    files_to_keep = []

    # Leer el archivo de programación de eliminación
    with open(deletion_file, 'r') as f:
        lines = f.readlines()

    for line in lines:
        try:
            file_path, deletion_date_str = line.strip().split('|')
            deletion_date = datetime.strptime(deletion_date_str, '%Y-%m-%d').date()

            # Si el archivo debe mantenerse
            if current_date < deletion_date:
                files_to_keep.append(line)
            else:
                # Eliminar el archivo si existe
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f'Archivo eliminado: {file_path}')

        except Exception as e:
            print(f'Error procesando línea: {line}. Error: {str(e)}')
            files_to_keep.append(line)

    # Actualizar el archivo de programación
    with open(deletion_file, 'w') as f:
        f.writelines(files_to_keep)

if __name__ == '__main__':
    cleanup_old_files()