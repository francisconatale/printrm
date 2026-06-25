package com.printly.studio.utils;

import java.util.UUID;

public class UUIDUtils {
    private static final java.util.regex.Pattern UUID_REGEX = 
        java.util.regex.Pattern.compile("^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$");

    public static UUID parseUUID(String str) {
        if (str == null || str.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID no puede estar vacío");
        }
        String cleanStr = str.trim();
        if (!UUID_REGEX.matcher(cleanStr).matches()) {
            throw new IllegalArgumentException("El formato del ID es inválido: " + str);
        }
        try {
            return UUID.fromString(cleanStr);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error al parsear el ID: " + str);
        }
    }
}
