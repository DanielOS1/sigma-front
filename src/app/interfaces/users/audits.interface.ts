export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: string;
}

// Interfaz opcional para los detalles parseados si necesitas acceder a ellos
export interface AuditDetails {
  requestBody: any;
  responseBody: {
    message: string;
    data: {
      rut: string;
      email: string;
      name: string;
      lastName: string;
      role: number;
    };
    success: boolean;
  };
}
