export type Role = 'ADMIN' | 'MANAGER' | 'STAFF';

export interface User {
    id: string;
    name: string;
    role: Role;
    email: string;
}

export type CertificateStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';