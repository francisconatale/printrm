package com.printrm.studio.domain.produccion;

import org.junit.jupiter.api.Test;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class FixDatabaseSchemaTest {

    @Test
    public void fixSchema() throws Exception {
        String dbPath = "jdbc:sqlite:studio.db";
        System.out.println("Connecting to database at: " + dbPath);
        try (Connection conn = DriverManager.getConnection(dbPath);
             Statement stmt = conn.createStatement()) {
            
            try {
                stmt.execute("ALTER TABLE ordenes_produccion DROP COLUMN tipo");
                System.out.println("Successfully dropped column 'tipo' from ordenes_produccion.");
            } catch (Exception e) {
                System.out.println("Failed to drop column 'tipo': " + e.getMessage());
            }

            try {
                stmt.execute("ALTER TABLE ordenes_produccion DROP COLUMN costo_estimado");
                System.out.println("Successfully dropped column 'costo_estimado' from ordenes_produccion.");
            } catch (Exception e) {
                System.out.println("Failed to drop column 'costo_estimado': " + e.getMessage());
            }

            try {
                stmt.execute("ALTER TABLE ordenes_produccion DROP COLUMN proveedor");
                System.out.println("Successfully dropped column 'proveedor' from ordenes_produccion.");
            } catch (Exception e) {
                System.out.println("Failed to drop column 'proveedor': " + e.getMessage());
            }
        }
    }
}
