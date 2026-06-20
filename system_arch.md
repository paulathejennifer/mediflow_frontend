# MediFlow System Architecture: Technical Blueprint

## 1. High-Level Architecture (HLD) - The 4-Tier Stack
The system follows a classic N-tier architecture optimized for asynchronous AI processing and multi-tenant security.

### Tier 1: Presentation (Edge)
*   **Framework:** Next.js 14+ (App Router).
*   **State Management:** Zustand (Client-side stores for Auth and Notifications with local storage persistence).
*   **Communication:** 
    *   HTTPS/REST for transactional data (Referrals, Patients).
    *   WSS (WebSockets) for real-time clinician alerts.

### Tier 2: API & Security Gateway (FastAPI)
*   **Primary API:** FastAPI (Asynchronous Python).
*   **Authentication:** JWT-based stateless auth.
*   **Isolation Layer:** Multi-tenant middleware ensuring `facility_id` scope.

### Tier 3: Logic & AI Orchestration
*   **Referral Engine:** Workflow state machine (Draft -> Submitted -> Accepted -> Completed).
*   **AI Services:** Orchestration of Groq (Llama 3.1), Whisper (Speech), and Tesseract (OCR).
*   **Background Tasks:** Python `asyncio` tasks for long-running clinical summarization.

### Tier 4: Data & Persistence
*   **Relational DB:** PostgreSQL (Relational integrity for clinical records).
*   **Unstructured Storage:** S3-Compatible (Backblaze B2) for audio (.webm) and medical documents (.pdf/.jpg).

---

## 2. Low-Level Architecture (LLD) - Component Deep Dive

### A. The Referral Processing Pipeline (The "Async" Flow)
1.  **Request:** Clinician uploads a voice note or PDF.
2.  **Storage:** API streams file to S3; returns a `file_path`.
3.  **DB Record:** `referral_documents` entry created with `ai_processed=false`.
4.  **Async Trigger:** FastAPI spawns an `asyncio.create_task`.
5.  **Processing:**
    *   *Speech:* `SpeechAIService` downloads audio -> FFmpeg conversion -> Google/Whisper API -> Raw Transcript.
    *   *OCR:* `DocumentAIService` -> pdfplumber/Tesseract -> Extracted Text.
6.  **Refinement:** `TextAIService` sends raw text + Clinical Context to Groq (Llama 3.1 8B).
7.  **Finalize:** JSON result parsed and stored in `ai_summary`; status updated to `completed`.

### B. Multi-Tenancy & Data Isolation Logic
*   **Constraint:** A clinician at Facility A must never see a referral at Facility B.
*   **Logic:** Every SQL query is appended with `WHERE (from_facility_id = user.facility_id OR to_facility_id = user.facility_id)`.
*   **Notification Scoping:** WebSockets map `user_id` and `facility_id` to active connection IDs to ensure private delivery of PII (Protected Health Information).

### C. Atomic MRN Generation (Concurrency Control)
*   **Problem:** Two clinicians create a patient at the same millisecond.
*   **Solution:** `MRNService` uses PostgreSQL `SELECT FOR UPDATE` on the `facility_counters` table. This locks the counter row for the specific facility until the transaction commits, preventing duplicate MRNs.
