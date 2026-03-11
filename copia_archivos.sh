#!/bin/bash
ARCHIVO_JSON="lista_archivos.json"
ORIGEN="/var/www/backend-gestion-documental/files/documentos/generados/pdf"
DESTINO="/home/jorge_geronimo/tempfiles"
NO_ENCONTRADOS="no_encontrados.txt"

mkdir -p "$DESTINO"

echo -n "" > "$NO_ENCONTRADOS"

# Leer cada item del JSON
jq -c '.[]' "$ARCHIVO_JSON" | while read -r item; do
    id=$(echo "$item" | jq -r '.id')
    cite=$(echo "$item" | jq -r '.cite')

    # Construcción de nombres posibles
    archivo1="$ORIGEN/$id.pdf"
    archivo2="$ORIGEN/BORRADOR-$id.pdf"

    # Verificar cuál existe
    if [ -f "$archivo1" ]; then
        # cp "$archivo1" "$DESTINO/$cite.pdf"
        echo "✅ Copiado: $archivo1 → $DESTINO/$cite.pdf"

    elif [ -f "$archivo2" ]; then
        # cp "$archivo2" "$DESTINO/$cite.pdf"
        echo "✅ Copiado: $archivo2 → $DESTINO/$cite.pdf"

    else
        echo "⚠️  No se encontró archivo para ID: $id"
        if [ -s "$NO_ENCONTRADOS" ]; then
            echo -n ",$id" >> "$NO_ENCONTRADOS"
        else
            echo -n "$id" > "$NO_ENCONTRADOS"
        fi
    fi
done
