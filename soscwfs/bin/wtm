#!/bin/sh

debug_urls() {
    if [ -f "debug_urls.txt" ]; then
        rm -f debug_urls.txt
    fi
}

extract_words_and_urls() {
    local url="$1"
    local wordlist_file="$2"
    local temp_file=$(mktemp)

    local user_agent="Mozilla/5.0 (Linux; Android 10; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36"

    curl -s -L -A "$user_agent" "$url" -o "$temp_file"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to download the webpage $url."
        rm -f "$temp_file"
        exit 1
    fi

    if [ -f "$temp_file" ]; then
        # Extract words and URLs
        tr -s '[:space:]' '\n' < "$temp_file" | grep -oE '\b\w+\b' | sort -u >> "$wordlist_file"
        sed -nE 's/.*((https?|ftp|file):\/\/[^"]+).*/\1/p' "$temp_file" | sort -u >> debug_urls.txt
        rm "$temp_file"
    else
        echo "Error: Temporary file not found."
        exit 1
    fi
}

extract_urls_recursively() {
    local urls="$1"
    local depth="$2"
    local current_depth=1

    while [ "$current_depth" -le "$depth" ]; do
        echo "Depth: $current_depth"

        new_urls=""
        for url in $urls; do
            extract_words_and_urls "$url" "$wordlist_file"
            extracted_urls=$(sed -nE 's/.*((https?|ftp|file):\/\/[^"]+).*/\1/p' debug_urls.txt | sort -u)
            new_urls="$new_urls $extracted_urls"
        done

        urls=$(echo "$new_urls" | sort -u)
        current_depth=$((current_depth + 1))
    done

    echo "A total of $(wc -l < "$wordlist_file") unique words have been extracted."
}

main() {
    local url=""
    local wordlist_file="wordlist.txt"
    local depth=1

    debug_urls  # Limpiar archivo de debug existente

    while [ $# -gt 0 ]; do
        case "$1" in
            -u|--url)
                url="$2"
                shift 2
                ;;
            -f|--file)
                wordlist_file="$2"
                shift 2
                ;;
            -d|--depth)
                depth="$2"
                shift 2
                ;;
            -h|--help)
                echo "Usage: $0 -u|--url URL [-f|--file FILE] [-d|--depth DEPTH]"
                exit 0
                ;;
            *)
                echo "Unrecognized argument: $1"
                exit 1
                ;;
        esac
    done

    if [ -z "$url" ]; then
        echo "Error: You must provide a URL using -u or --url."
        exit 1
    fi

    echo "Extracting words and URLs recursively with depth $depth from $url..."

    extract_urls_recursively "$url" "$depth"
}

main "$@"

