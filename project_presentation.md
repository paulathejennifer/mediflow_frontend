# Project Presentation: MediFlow Clinical Intelligence
**A Real-time, AI-Augmented Referral Platform**

## 1. The Problem
**"The Fax Machine Bottleneck"**
Clinical referrals are currently fragmented. Referrals are sent via fax, email, or physical paper. This leads to:
*   **Information Asymmetry:** Receiving doctors get files without summaries.
*   **Processing Latency:** Manual transcription of patient data takes 15-20 minutes.
*   **Data Silos:** No centralized tracking of patient movement between hospitals.

## 2. Why I Chose This Problem
Referral management is a high-stakes engineering problem. It requires:
1.  **Real-time synchronization** (lives depend on speed).
2.  **Complex Data Extraction** (unstructured clinical notes to structured data).
3.  **Strict Security** (Multi-tenant isolation).
It allowed me to combine traditional Full-Stack engineering with Generative AI.

## 3. Success Criteria
*   **Speed:** Reduce referral transmission from minutes to seconds.
*   **Accuracy:** Achieve >90% clinical data extraction accuracy.
*   **Intelligence:** Provide automated "Quality Scores" for every referral.
*   **Scalability:** Support multiple facilities with zero data leakage.

## 4. Technical Architecture & Engineering Decisions

### Why FastAPI?
*   **Async/Await native:** Essential for handling the "waiting" time of AI APIs without blocking clinical users.
*   **Type Safety:** Pydantic ensures clinical data (like dosages or dates) is strictly validated before hitting the DB.

### Why PostgreSQL over MongoDB?
*   **Relational Integrity:** A referral *must* link to a valid Patient and two valid Facilities. PostgreSQL’s Foreign Key constraints prevent "Orphaned" clinical records.
*   **ACID Compliance:** Transactional safety is non-negotiable in healthcare.
*   **JSONB Support:** Used to store AI summaries, giving us the flexibility of Mongo with the rigour of SQL.

## 5. AI Components & Workflow
*   **Text Analysis:** Groq (Llama 3.1 8B) for clinical reasoning.
*   **Speech-to-Text:** Google Speech / Whisper for hands-free clinical assessment.
*   **OCR:** Tesseract + pdfplumber for digitizing lab reports.
*   **MediFlow Assistant (v2):** A LangChain-powered agent that allows Super Admins to query the database using natural language (e.g., "Which facility has the highest rejection rate?").

## 6. Engineering Challenges & Solutions

### Challenge 1: The "NoneType" Auth Crash
*   **Issue:** WebSocket connections crashed the server when tokens expired.
*   **Solution:** Implemented a robust JWT payload validator in the WebSocket manager to catch null payloads before property access.

### Challenge 2: Duplicate Patient Records (V2)
*   **Solution:** Using Scikit-learn (TF-IDF Vectorization) + RapidFuzz to compare incoming patient names/phones against the DB, calculating a probability score for duplicates.

## 7. Metrics & Impact
| Metric | Baseline (Manual) | MediFlow Impact |
| :--- | :--- | :--- |
| **Referral Delay** | 18 Minutes | **2 Minutes** (88% reduction) |
| **OCR Accuracy** | 0% (Manual entry) | **92%** |
| **Clinician Time Saved**| 0 Hours | **360 Clinical Hours/Year** |
| **Handling Time** | 100% Manual | **45% Projected Reduction** |

### How we measured:
*   **Delay:** Delta between `referral_created` and WebSocket `broadcast_received` timestamps.
*   **Time Saved:** Calculated by the average manual data entry time (approx. 10 mins) multiplied by referral volume.

## 8. Trade-offs & Lessons Learned
*   **Trade-off:** Cloud AI (Groq) vs Local LLM. We chose Cloud AI for the MVP to achieve 1-second inference speeds, accepting the trade-off of requiring an internet connection.
*   **Lesson:** "Don't Over-AI." Initially, I wanted AI to generate MRNs, but realized a deterministic SQL counter is safer and cheaper.
