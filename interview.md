### Last Project: MediFlow AI (Healthcare Referral Platform)

MediFlow is a full-stack clinical referral system that automates document intake, OCR extraction, and real-time referral tracking using FastAPI, PostgreSQL, React, and AI pipelines (Whisper, Tesseract, Groq LLMs).

It processes unstructured clinical data (PDFs, lab reports, referral notes) into structured workflows for multi-facility healthcare teams.

---

### 1. One Ambiguity

The biggest ambiguity was defining what “correct” clinical extraction means.

For example, referral documents often contain incomplete or evolving information (initial referral vs later lab results). There is no single ground-truth dataset for "referral reason" or "clinical summary".

To resolve this, I designed the system to:
- treat extracted AI output as **probabilistic structured data**
- allow updates as new documents arrive
- prioritize traceability over single-shot accuracy

---

### 2. One Tradeoff

I chose **Groq (Llama 3.1) + external APIs over local models** for summarization and reasoning.

Tradeoff:
- + Very low latency (~1–2s inference)
- + Better clinical language handling out-of-the-box
- − Dependency on external API + internet reliability

I optimized for production speed and usability rather than offline independence.

---

### 3. One Mistake

Initially, I overcomplicated patient identity resolution by trying to use only deterministic rules.

This failed in real-world cases where:
- names were misspelled
- phone numbers were missing or inconsistent

I later fixed this by introducing a **hybrid duplicate detection system**:
- TF-IDF vectorization (Scikit-learn)
- fuzzy matching (RapidFuzz)
- weighted similarity scoring

This significantly reduced duplicate patient creation edge cases.

---

### 4. One Review Comment That Changed My Mind

A key review comment I received was:
> “Don’t optimize for perfect extraction on the first pass — optimize for correct system state over time.”

This changed how I designed the pipeline:
- I moved from a single-pass AI extraction model
- to an **event-driven, multi-document aggregation pipeline**

Now the system evolves the patient/referral record as new inputs arrive rather than treating each document in isolation.

---

### Link:
https://github.com/paulathejennifer/mediflow-ai-platform