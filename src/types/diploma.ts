// src/types/diploma.ts
export interface Diploma {
  id?: string;
  studentName: string;
  studentDob: string; // ISO date string
  gender: string | null;
  placeOfBirth: string | null;
  ethnicity: string | null;
  nationality: string | null;
  studentId: string | null;
  programName: string | null;
  major: string;
  graduationYear: number | null;
  degreeType: 'DOCTOR' | 'BACHELOR' | 'MASTER' | 'ENGINEER';
  classification: string;
  diplomaNumber: string;
  registryNumber: string | null; // Đã đổi từ decisionNumber
  issuedDate: string; // ISO date string
  signerName: string | null;
  fileUrl: string | null;
  ocrRawText: string | null;
  status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  hash?: string;
  isImmutable?: boolean;
}