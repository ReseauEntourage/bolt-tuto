# Quiz System Database Schema

## Overview
This document describes the database schema for implementing strict quiz validation that requires 100% correct answers for module completion.

## Tables

### `training_modules`
Stores training course modules with metadata.

```sql
CREATE TABLE training_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  estimated_minutes integer NOT NULL DEFAULT 5,
  order_position integer NOT NULL,
  video_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

### `quiz_questions`
Stores quiz questions for each module.

```sql
CREATE TABLE quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  encouraging_feedback text NOT NULL,
  order_position integer NOT NULL
);
```

### `user_module_progress`
Tracks individual user progress through modules. **CRITICAL**: Module can only be marked as 'completed' when quiz is passed with 100% score.

```sql
CREATE TABLE user_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  video_progress_percent integer NOT NULL DEFAULT 0 CHECK (video_progress_percent >= 0 AND video_progress_percent <= 100),
  quiz_completed boolean DEFAULT false,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);
```

**Important Constraints:**
- `status` can only be 'completed' when a quiz attempt with perfect score exists
- `quiz_completed` is only true when user has passed with 100% score

### `quiz_attempts`
Tracks all quiz attempts including failed ones. This is crucial for:
- Preventing bypass of validation
- Tracking learning progress
- Ensuring accountability

```sql
CREATE TABLE quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0),
  total_questions integer NOT NULL CHECK (total_questions > 0),
  is_passed boolean NOT NULL DEFAULT false,
  attempt_number integer NOT NULL DEFAULT 1,
  answers_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_score CHECK (score <= total_questions),
  CONSTRAINT passed_requires_perfect CHECK (
    (is_passed = true AND score = total_questions) OR
    (is_passed = false AND score < total_questions)
  )
);
```

**Critical Constraints:**
- `is_passed` can ONLY be true when `score = total_questions` (100% correct)
- `answers_data` stores the actual answers for audit purposes
- `attempt_number` tracks retry count

### `certifications`
Tracks certification status. Can only be issued when ALL modules are completed with perfect quiz scores.

```sql
CREATE TABLE certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_type text NOT NULL DEFAULT 'coach',
  issued_at timestamptz DEFAULT now(),
  badge_data jsonb,
  UNIQUE(user_id, certification_type)
);
```

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Training Modules & Quiz Questions (Read-Only)
```sql
CREATE POLICY "Authenticated users can view training modules"
  ON training_modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);
```

### User Progress & Attempts (User-Owned)
```sql
CREATE POLICY "Users can view own progress"
  ON user_module_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_module_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_module_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

## Validation Rules

### Module Completion Workflow

1. **Video Completion**
   - User watches video
   - `video_progress_percent` is updated to 100
   - Status changes from 'not_started' to 'in_progress'

2. **Quiz Validation**
   - User submits quiz answers
   - System validates ALL answers against correct answers
   - Quiz attempt is recorded in `quiz_attempts` table
   - If score < total_questions: `is_passed = false`
   - If score = total_questions: `is_passed = true`

3. **Module Completion** (ONLY if quiz passed)
   ```
   IF quiz_attempt.is_passed = true THEN
     UPDATE user_module_progress
     SET status = 'completed',
         quiz_completed = true,
         completed_at = now()
     WHERE user_id = current_user AND module_id = current_module
   END IF
   ```

4. **Certification Issuance** (ONLY if all modules completed)
   ```
   IF COUNT(completed_modules) = COUNT(total_modules) THEN
     INSERT INTO certifications (user_id, certification_type)
     VALUES (current_user, 'coach')
   END IF
   ```

## Security Considerations

### Preventing Bypass Attempts

1. **Database Constraints**: CHECK constraints ensure data integrity at the database level
2. **Validation Logic**: Server-side validation in Edge Functions (not client-side)
3. **Audit Trail**: All quiz attempts are logged, even failed ones
4. **RLS Policies**: Users cannot modify other users' data or bypass their own validation

### Edge Cases Handled

1. **Incomplete Answers**: If user doesn't answer all questions, validation fails
2. **Modified Answers**: Answers are validated against current question data in database
3. **Race Conditions**: UNIQUE constraints prevent duplicate progress records
4. **Partial Updates**: CHECK constraints prevent invalid status transitions

## Implementation Notes

- Frontend uses TypeScript validation utilities in `src/utils/quizValidation.ts`
- All validation logic is duplicated on backend (Edge Functions) for security
- Quiz questions and correct answers are never exposed to client before submission
- Results show which questions were wrong but not the correct answers (encourages learning)
