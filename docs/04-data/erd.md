# Entity Relationship Diagram (ERD)

**Purpose:** Visual and relational mapping of database collections, entities, attributes, and foreign relationships.  
**Status:** Verified against code  
**Last Verified:** 2026-10-05 (Commit `162ff8a`)  
**Owner:** TBD [owner input needed]  

---

## 1. Relational Entity Diagram

```mermaid
erDiagram
    USER ||--o{ SUBSCRIPTION : holds
    USER ||--o{ TEST_SUBMISSION : submits
    PRODUCT ||--o{ SUBSCRIPTION : references
    RESOURCE ||--o{ PRODUCT : contains

    USER {
        string id PK
        string student_id
        string name
        string email UK
        string phone
        string password_hash
        string role
        string target_exam
        boolean is_active
        boolean drm_access
        string_array unlockedItemIds
        string activeDeviceId
        string activeDeviceName
        datetime lastActiveAt
        string googleId
        datetime createdAt
        datetime updatedAt
    }

    PRODUCT {
        string id PK
        string title
        string subtitle
        string category
        string format
        number price
        number originalPrice
        string status
        string pdfUrl
        string_array units
        boolean isSample
        datetime createdAt
        datetime updatedAt
    }

    RESOURCE {
        string id PK
        string course
        string actName
        number chapterNumber
        string type
        string title
        string pdfUrl
        string samplePdfUrl
        boolean isSample
        string status
        string cloudinaryPublicId
        datetime createdAt
        datetime updatedAt
    }

    SUBSCRIPTION {
        string id PK
        string studentName
        string studentRoll
        string email FK
        string phone
        string item
        string targetExam
        string amount
        string paymentMode
        string accessStatus
        string_array unlockedItemIds
        datetime createdAt
        datetime updatedAt
    }

    COUPON {
        string id PK
        string code UK
        number discountPercent
        boolean isActive
        datetime validUntil
    }

    MCQ_TEST {
        string id PK
        string title
        string chapter
        number durationMinutes
        number totalMarks
        datetime createdAt
    }
```
