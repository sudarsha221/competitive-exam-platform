-- Initial PostgreSQL schema for the Competitive Exam Preparation Platform.
-- Apply only to a Supabase project after reviewing the deployment TODOs at the end.
-- This file is intentionally not executed by the development workflow.

REVOKE CREATE ON SCHEMA public FROM PUBLIC, anon, authenticated;

CREATE SCHEMA IF NOT EXISTS private;

-- Supabase/PostgREST must not expose the private schema. Authenticated users get
-- schema usage only so RLS policies can invoke narrowly granted helper functions.
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE public.account_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE public.question_revision_status AS ENUM ('draft', 'in_review', 'published', 'superseded');
CREATE TYPE public.question_difficulty AS ENUM ('basic', 'medium', 'advanced');
CREATE TYPE public.daily_challenge_status AS ENUM ('draft', 'scheduled', 'published', 'completed', 'archived');
CREATE TYPE public.attempt_status AS ENUM ('in_progress', 'submitted', 'abandoned');
CREATE TYPE public.import_status AS ENUM (
    'uploaded', 'queued', 'processing', 'needs_review', 'approved', 'imported', 'failed', 'cancelled'
);
CREATE TYPE public.import_item_status AS ENUM ('parsed', 'valid', 'invalid', 'approved', 'rejected', 'imported');
CREATE TYPE public.leaderboard_period AS ENUM ('daily', 'weekly', 'monthly', 'all_time');

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    display_name text NOT NULL CHECK (char_length(display_name) BETWEEN 1 AND 100),
    phone_e164 text CHECK (phone_e164 IS NULL OR char_length(phone_e164) <= 32),
    avatar_path text,
    account_status public.account_status NOT NULL DEFAULT 'inactive',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
    user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    granted_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    granted_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role)
);

CREATE TABLE public.student_profiles (
    user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
    student_code text NOT NULL UNIQUE,
    school_name text,
    class_level text,
    leaderboard_opt_in boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.teacher_profiles (
    user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
    teacher_code text NOT NULL UNIQUE,
    bio text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.user_preferences (
    user_id uuid PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
    theme text NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    language_code text NOT NULL DEFAULT 'en',
    time_zone text NOT NULL DEFAULT 'Asia/Kolkata',
    date_format text NOT NULL DEFAULT 'DD MMM YYYY',
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.notification_preferences (
    user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
    notification_key text NOT NULL CHECK (
        notification_key IN ('students', 'teachers', 'challenges', 'system')
    ),
    enabled boolean NOT NULL DEFAULT true,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, notification_key)
);

CREATE TABLE public.platform_settings (
    id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    website_name text NOT NULL,
    description text NOT NULL DEFAULT '',
    logo_path text,
    default_language text NOT NULL DEFAULT 'en',
    time_zone text NOT NULL DEFAULT 'Asia/Kolkata',
    date_format text NOT NULL DEFAULT 'DD MMM YYYY',
    updated_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.exams (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE CHECK (code ~ '^[A-Z][A-Z0-9_]*$'),
    name text NOT NULL UNIQUE,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.subjects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    name text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (exam_id, name)
);

CREATE TABLE public.chapters (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id uuid NOT NULL REFERENCES public.subjects (id) ON DELETE RESTRICT,
    name text NOT NULL,
    chapter_number integer NOT NULL CHECK (chapter_number > 0),
    sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (subject_id, chapter_number),
    UNIQUE (subject_id, name)
);

CREATE TABLE public.subtopics (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id uuid NOT NULL REFERENCES public.chapters (id) ON DELETE RESTRICT,
    name text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0 CHECK (sort_order >= 0),
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (chapter_id, name)
);

CREATE TABLE public.questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subtopic_id uuid NOT NULL REFERENCES public.subtopics (id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    archived_at timestamptz
);

CREATE TABLE public.question_revisions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL REFERENCES public.questions (id) ON DELETE RESTRICT,
    revision_number integer NOT NULL CHECK (revision_number > 0),
    prompt text NOT NULL CHECK (char_length(btrim(prompt)) > 0),
    question_type text NOT NULL DEFAULT 'mcq_single'
        CHECK (question_type = 'mcq_single'),
    difficulty public.question_difficulty NOT NULL,
    status public.question_revision_status NOT NULL DEFAULT 'draft',
    created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    reviewed_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    published_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (question_id, revision_number),
    UNIQUE (id, question_id)
);

CREATE UNIQUE INDEX question_revisions_one_published_per_question
    ON public.question_revisions (question_id)
    WHERE status = 'published';

CREATE TABLE public.question_options (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    question_revision_id uuid NOT NULL REFERENCES public.question_revisions (id) ON DELETE RESTRICT,
    option_key text NOT NULL CHECK (option_key IN ('A', 'B', 'C', 'D')),
    body text NOT NULL CHECK (char_length(btrim(body)) > 0),
    sort_order smallint NOT NULL CHECK (sort_order BETWEEN 1 AND 4),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (question_revision_id, option_key),
    UNIQUE (question_revision_id, sort_order),
    UNIQUE (question_revision_id, id)
);

CREATE TABLE private.question_answer_keys (
    question_revision_id uuid PRIMARY KEY
        REFERENCES public.question_revisions (id) ON DELETE RESTRICT,
    correct_option_id uuid NOT NULL,
    explanation text NOT NULL DEFAULT '',
    updated_at timestamptz NOT NULL DEFAULT now(),
    FOREIGN KEY (question_revision_id, correct_option_id)
        REFERENCES public.question_options (question_revision_id, id)
        ON DELETE RESTRICT
);

CREATE TABLE public.student_exam_enrollments (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    enrolled_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (student_user_id, exam_id)
);

CREATE TABLE public.teacher_exam_assignments (
    teacher_user_id uuid NOT NULL REFERENCES public.teacher_profiles (user_id) ON DELETE CASCADE,
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    assigned_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    assigned_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (teacher_user_id, exam_id)
);

CREATE TABLE public.daily_challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    start_date date NOT NULL,
    title text NOT NULL,
    status public.daily_challenge_status NOT NULL DEFAULT 'draft',
    created_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (id, exam_id)
);

CREATE TABLE public.challenge_questions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid NOT NULL REFERENCES public.daily_challenges (id) ON DELETE CASCADE,
    question_revision_id uuid NOT NULL REFERENCES public.question_revisions (id) ON DELETE RESTRICT,
    position integer NOT NULL CHECK (position > 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (challenge_id, position),
    UNIQUE (challenge_id, question_revision_id),
    UNIQUE (id, challenge_id),
    UNIQUE (id, challenge_id, question_revision_id)
);

CREATE TABLE public.challenge_schedules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid NOT NULL,
    exam_id uuid NOT NULL,
    challenge_question_id uuid NOT NULL,
    challenge_date date NOT NULL,
    opens_at timestamptz NOT NULL,
    closes_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (opens_at < closes_at),
    CHECK (challenge_date = (opens_at AT TIME ZONE 'Asia/Kolkata')::date),
    CHECK ((closes_at AT TIME ZONE 'Asia/Kolkata') = (challenge_date + 1)::timestamp),
    UNIQUE (exam_id, challenge_date),
    UNIQUE (id, challenge_id),
    UNIQUE (challenge_question_id),
    FOREIGN KEY (challenge_id, exam_id)
        REFERENCES public.daily_challenges (id, exam_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (challenge_question_id, challenge_id)
        REFERENCES public.challenge_questions (id, challenge_id)
        ON DELETE RESTRICT
);

CREATE TABLE public.challenge_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE
        DEFAULT auth.uid(),
    attempt_number integer NOT NULL CHECK (attempt_number > 0),
    status public.attempt_status NOT NULL DEFAULT 'in_progress',
    correct_count integer CHECK (correct_count IS NULL OR correct_count BETWEEN 0 AND 1),
    started_at timestamptz NOT NULL DEFAULT now(),
    submitted_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (submitted_at IS NULL OR submitted_at >= started_at),
    UNIQUE (student_user_id, schedule_id, attempt_number),
    UNIQUE (id, challenge_id),
    UNIQUE (id, student_user_id, schedule_id),
    FOREIGN KEY (schedule_id, challenge_id)
        REFERENCES public.challenge_schedules (id, challenge_id)
        ON DELETE RESTRICT
);

CREATE TABLE public.challenge_attempt_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id uuid NOT NULL,
    challenge_id uuid NOT NULL,
    challenge_question_id uuid NOT NULL,
    question_revision_id uuid NOT NULL,
    selected_option_id uuid NOT NULL,
    is_correct boolean NOT NULL,
    answered_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (attempt_id, challenge_question_id),
    FOREIGN KEY (attempt_id, challenge_id)
        REFERENCES public.challenge_attempts (id, challenge_id)
        ON DELETE CASCADE,
    FOREIGN KEY (challenge_question_id, challenge_id, question_revision_id)
        REFERENCES public.challenge_questions (id, challenge_id, question_revision_id)
        ON DELETE RESTRICT,
    FOREIGN KEY (question_revision_id, selected_option_id)
        REFERENCES public.question_options (question_revision_id, id)
        ON DELETE RESTRICT
);

CREATE TABLE public.challenge_completions (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    schedule_id uuid NOT NULL REFERENCES public.challenge_schedules (id) ON DELETE RESTRICT,
    attempt_id uuid NOT NULL UNIQUE,
    completed_at timestamptz NOT NULL DEFAULT now(),
    score integer NOT NULL CHECK (score = 1),
    total_questions integer NOT NULL DEFAULT 1 CHECK (total_questions = 1),
    CHECK (score <= total_questions),
    PRIMARY KEY (student_user_id, schedule_id),
    FOREIGN KEY (attempt_id, student_user_id, schedule_id)
        REFERENCES public.challenge_attempts (id, student_user_id, schedule_id)
        ON DELETE CASCADE
);

CREATE TABLE public.student_exam_streaks (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    current_days integer NOT NULL DEFAULT 0 CHECK (current_days >= 0),
    best_days integer NOT NULL DEFAULT 0 CHECK (best_days >= current_days),
    last_completed_date date,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (student_user_id, exam_id)
);

CREATE TABLE public.practice_attempts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE
        DEFAULT auth.uid(),
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    status public.attempt_status NOT NULL DEFAULT 'in_progress',
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (finished_at IS NULL OR finished_at >= started_at)
);

CREATE TABLE public.practice_attempt_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_attempt_id uuid NOT NULL REFERENCES public.practice_attempts (id) ON DELETE CASCADE,
    question_revision_id uuid NOT NULL REFERENCES public.question_revisions (id) ON DELETE RESTRICT,
    selected_option_id uuid NOT NULL,
    is_correct boolean,
    answered_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (practice_attempt_id, question_revision_id),
    UNIQUE (id, question_revision_id),
    FOREIGN KEY (question_revision_id, selected_option_id)
        REFERENCES public.question_options (question_revision_id, id)
        ON DELETE RESTRICT
);

CREATE TABLE public.student_bookmarks (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE
        DEFAULT auth.uid(),
    question_id uuid NOT NULL REFERENCES public.questions (id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (student_user_id, question_id)
);

CREATE TABLE public.student_mistake_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE
        DEFAULT auth.uid(),
    question_revision_id uuid NOT NULL REFERENCES public.question_revisions (id) ON DELETE RESTRICT,
    first_mistaken_at timestamptz NOT NULL DEFAULT now(),
    last_mistaken_at timestamptz NOT NULL DEFAULT now(),
    last_wrong_answer_id uuid
        REFERENCES public.practice_attempt_answers (id) ON DELETE SET NULL,
    note text,
    reviewed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (student_user_id, question_revision_id)
);

CREATE TABLE public.student_activity_daily (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    activity_date date NOT NULL,
    practice_questions integer NOT NULL DEFAULT 0 CHECK (practice_questions >= 0),
    correct_answers integer NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
    challenge_completions integer NOT NULL DEFAULT 0 CHECK (challenge_completions >= 0),
    active_minutes integer NOT NULL DEFAULT 0 CHECK (active_minutes >= 0),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (student_user_id, exam_id, activity_date),
    CHECK (correct_answers <= practice_questions)
);

CREATE TABLE public.student_exam_stats (
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    exam_id uuid NOT NULL REFERENCES public.exams (id) ON DELETE RESTRICT,
    attempted_questions bigint NOT NULL DEFAULT 0 CHECK (attempted_questions >= 0),
    correct_answers bigint NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
    calculated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (student_user_id, exam_id),
    CHECK (correct_answers <= attempted_questions)
);

CREATE TABLE public.leaderboard_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id uuid REFERENCES public.exams (id) ON DELETE RESTRICT,
    period public.leaderboard_period NOT NULL,
    period_start date NOT NULL,
    period_end date NOT NULL,
    generated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (period_start <= period_end),
    CHECK (period IN ('daily', 'all_time') OR period_start < period_end)
);

CREATE UNIQUE INDEX leaderboard_snapshots_exam_period_unique
    ON public.leaderboard_snapshots (exam_id, period, period_start, period_end)
    WHERE exam_id IS NOT NULL;
CREATE UNIQUE INDEX leaderboard_snapshots_all_exams_period_unique
    ON public.leaderboard_snapshots (period, period_start, period_end)
    WHERE exam_id IS NULL;

CREATE TABLE public.leaderboard_entries (
    snapshot_id uuid NOT NULL REFERENCES public.leaderboard_snapshots (id) ON DELETE CASCADE,
    student_user_id uuid NOT NULL REFERENCES public.student_profiles (user_id) ON DELETE CASCADE,
    rank integer NOT NULL CHECK (rank > 0),
    points bigint NOT NULL DEFAULT 0 CHECK (points >= 0),
    questions_attempted bigint NOT NULL DEFAULT 0 CHECK (questions_attempted >= 0),
    correct_answers bigint NOT NULL DEFAULT 0 CHECK (correct_answers >= 0),
    challenge_streak integer NOT NULL DEFAULT 0 CHECK (challenge_streak >= 0),
    PRIMARY KEY (snapshot_id, student_user_id),
    UNIQUE (snapshot_id, rank),
    CHECK (correct_answers <= questions_attempted)
);

CREATE TABLE public.admin_bulk_imports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by uuid NOT NULL REFERENCES public.profiles (id) ON DELETE RESTRICT,
    source_format text NOT NULL CHECK (source_format IN ('xls', 'xlsx', 'csv', 'doc', 'docx', 'pdf')),
    original_file_name text NOT NULL CHECK (char_length(btrim(original_file_name)) > 0),
    storage_object_path text NOT NULL UNIQUE,
    content_type text NOT NULL,
    file_size_bytes bigint NOT NULL CHECK (file_size_bytes > 0),
    checksum_sha256 text CHECK (
        checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-fA-F]{64}$'
    ),
    status public.import_status NOT NULL DEFAULT 'uploaded',
    processing_errors jsonb NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(processing_errors) = 'array'),
    total_items integer NOT NULL DEFAULT 0 CHECK (total_items >= 0),
    valid_items integer NOT NULL DEFAULT 0 CHECK (valid_items >= 0),
    invalid_items integer NOT NULL DEFAULT 0 CHECK (invalid_items >= 0),
    imported_items integer NOT NULL DEFAULT 0 CHECK (imported_items >= 0),
    processing_started_at timestamptz,
    processing_finished_at timestamptz,
    approved_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    approved_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (valid_items <= total_items),
    CHECK (invalid_items <= total_items),
    CHECK (imported_items <= valid_items),
    CHECK (valid_items + invalid_items <= total_items),
    CHECK (
        status NOT IN ('approved', 'imported')
        OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)
    )
);

CREATE TABLE public.bulk_import_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    import_id uuid NOT NULL REFERENCES public.admin_bulk_imports (id) ON DELETE CASCADE,
    item_index integer NOT NULL CHECK (item_index > 0),
    source_locator text,
    status public.import_item_status NOT NULL DEFAULT 'parsed',
    question_preview jsonb NOT NULL CHECK (jsonb_typeof(question_preview) = 'object'),
    validation_errors jsonb NOT NULL DEFAULT '[]'::jsonb
        CHECK (jsonb_typeof(validation_errors) = 'array'),
    approved_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
    approved_at timestamptz,
    imported_revision_id uuid UNIQUE
        REFERENCES public.question_revisions (id) ON DELETE SET NULL,
    imported_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (import_id, item_index),
    CHECK (
        status NOT IN ('approved', 'imported')
        OR (approved_by IS NOT NULL AND approved_at IS NOT NULL)
    ),
    CHECK (
        (status = 'imported')
        = (imported_revision_id IS NOT NULL AND imported_at IS NOT NULL)
    )
);

CREATE INDEX user_roles_role_user_idx ON public.user_roles (role, user_id);
CREATE INDEX user_roles_granted_by_idx ON public.user_roles (granted_by);
CREATE INDEX platform_settings_updated_by_idx ON public.platform_settings (updated_by)
    WHERE updated_by IS NOT NULL;
CREATE INDEX student_exam_enrollments_exam_user_idx
    ON public.student_exam_enrollments (exam_id, student_user_id)
    WHERE status = 'active';
CREATE INDEX teacher_exam_assignments_exam_user_idx
    ON public.teacher_exam_assignments (exam_id, teacher_user_id);
CREATE INDEX subjects_exam_sort_idx ON public.subjects (exam_id, sort_order);
CREATE INDEX chapters_subject_sort_idx ON public.chapters (subject_id, sort_order);
CREATE INDEX subtopics_chapter_sort_idx ON public.subtopics (chapter_id, sort_order);
CREATE INDEX questions_subtopic_idx ON public.questions (subtopic_id);
CREATE INDEX question_revisions_status_question_idx
    ON public.question_revisions (status, question_id);
CREATE INDEX question_revisions_created_by_idx ON public.question_revisions (created_by)
    WHERE created_by IS NOT NULL;
CREATE INDEX question_revisions_reviewed_by_idx ON public.question_revisions (reviewed_by)
    WHERE reviewed_by IS NOT NULL;
CREATE INDEX question_options_revision_sort_idx
    ON public.question_options (question_revision_id, sort_order);
CREATE INDEX daily_challenges_exam_status_idx
    ON public.daily_challenges (exam_id, status);
CREATE INDEX daily_challenges_created_by_idx ON public.daily_challenges (created_by)
    WHERE created_by IS NOT NULL;
CREATE INDEX challenge_questions_revision_idx
    ON public.challenge_questions (question_revision_id);
CREATE INDEX challenge_schedules_challenge_date_idx
    ON public.challenge_schedules (challenge_id, challenge_date);
CREATE INDEX challenge_attempts_student_started_idx
    ON public.challenge_attempts (student_user_id, started_at DESC);
CREATE INDEX challenge_attempts_schedule_idx
    ON public.challenge_attempts (schedule_id, student_user_id);
CREATE INDEX challenge_attempt_answers_attempt_idx
    ON public.challenge_attempt_answers (attempt_id);
CREATE INDEX challenge_attempt_answers_question_idx
    ON public.challenge_attempt_answers (challenge_question_id);
CREATE INDEX challenge_completions_student_date_idx
    ON public.challenge_completions (student_user_id, completed_at DESC);
CREATE INDEX challenge_completions_schedule_idx
    ON public.challenge_completions (schedule_id);
CREATE INDEX student_exam_streaks_exam_idx
    ON public.student_exam_streaks (exam_id, current_days DESC);
CREATE INDEX practice_attempts_student_started_idx
    ON public.practice_attempts (student_user_id, started_at DESC);
CREATE INDEX practice_attempts_exam_idx
    ON public.practice_attempts (exam_id, started_at DESC);
CREATE INDEX practice_attempt_answers_revision_answered_idx
    ON public.practice_attempt_answers (question_revision_id, answered_at DESC);
CREATE INDEX practice_attempt_answers_attempt_idx
    ON public.practice_attempt_answers (practice_attempt_id);
CREATE INDEX student_bookmarks_student_created_idx
    ON public.student_bookmarks (student_user_id, created_at DESC);
CREATE INDEX student_bookmarks_question_idx ON public.student_bookmarks (question_id);
CREATE INDEX student_mistake_items_student_last_mistaken_idx
    ON public.student_mistake_items (student_user_id, last_mistaken_at DESC);
CREATE INDEX student_mistake_items_revision_idx
    ON public.student_mistake_items (question_revision_id);
CREATE INDEX student_activity_daily_exam_date_idx
    ON public.student_activity_daily (exam_id, activity_date DESC);
CREATE INDEX student_exam_stats_exam_idx
    ON public.student_exam_stats (exam_id, calculated_at DESC);
CREATE INDEX leaderboard_entries_snapshot_rank_idx
    ON public.leaderboard_entries (snapshot_id, rank);
CREATE INDEX leaderboard_entries_student_idx
    ON public.leaderboard_entries (student_user_id, snapshot_id);
CREATE INDEX leaderboard_snapshots_period_idx
    ON public.leaderboard_snapshots (period, period_start DESC, period_end DESC);
CREATE INDEX admin_bulk_imports_uploader_status_created_idx
    ON public.admin_bulk_imports (uploaded_by, status, created_at DESC);
CREATE INDEX admin_bulk_imports_approved_by_idx ON public.admin_bulk_imports (approved_by)
    WHERE approved_by IS NOT NULL;
CREATE INDEX bulk_import_items_import_status_idx
    ON public.bulk_import_items (import_id, status, item_index);
CREATE INDEX bulk_import_items_approved_by_idx ON public.bulk_import_items (approved_by)
    WHERE approved_by IS NOT NULL;

CREATE OR REPLACE FUNCTION private.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION private.guard_immutable_question_revision()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF OLD.status IN ('published', 'superseded') THEN
        IF NEW.question_id IS DISTINCT FROM OLD.question_id
           OR NEW.revision_number IS DISTINCT FROM OLD.revision_number
           OR NEW.prompt IS DISTINCT FROM OLD.prompt
           OR NEW.question_type IS DISTINCT FROM OLD.question_type
           OR NEW.difficulty IS DISTINCT FROM OLD.difficulty
           OR NEW.created_by IS DISTINCT FROM OLD.created_by
           OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
           OR NEW.published_at IS DISTINCT FROM OLD.published_at
           OR (OLD.status = 'superseded' AND NEW.status IS DISTINCT FROM OLD.status)
           OR (OLD.status = 'published' AND NEW.status NOT IN ('published', 'superseded')) THEN
            RAISE EXCEPTION 'Published question revisions are immutable';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER question_revisions_immutable
    BEFORE UPDATE ON public.question_revisions
    FOR EACH ROW EXECUTE FUNCTION private.guard_immutable_question_revision();

CREATE OR REPLACE FUNCTION private.guard_challenge_question()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_challenge_id uuid;
    v_question_revision_id uuid;
    v_challenge_exam_id uuid;
    v_challenge_status public.daily_challenge_status;
    v_old_challenge_status public.daily_challenge_status;
    v_revision_exam_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_challenge_id := OLD.challenge_id;
        v_question_revision_id := OLD.question_revision_id;
    ELSE
        v_challenge_id := NEW.challenge_id;
        v_question_revision_id := NEW.question_revision_id;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        SELECT status
        INTO v_old_challenge_status
        FROM public.daily_challenges
        WHERE id = OLD.challenge_id;

        IF v_old_challenge_status IN ('scheduled', 'published', 'completed', 'archived') THEN
            RAISE EXCEPTION 'Scheduled challenge question sets are immutable';
        END IF;
    END IF;

    SELECT exam_id, status
    INTO v_challenge_exam_id, v_challenge_status
    FROM public.daily_challenges
    WHERE id = v_challenge_id;

    SELECT s.exam_id
    INTO v_revision_exam_id
    FROM public.question_revisions AS qr
    JOIN public.questions AS q ON q.id = qr.question_id
    JOIN public.subtopics AS st ON st.id = q.subtopic_id
    JOIN public.chapters AS c ON c.id = st.chapter_id
    JOIN public.subjects AS s ON s.id = c.subject_id
    WHERE qr.id = v_question_revision_id;

    IF v_challenge_exam_id IS NULL OR v_revision_exam_id IS NULL
       OR v_challenge_exam_id <> v_revision_exam_id THEN
        RAISE EXCEPTION 'Challenge questions must belong to the challenge exam';
    END IF;

    IF v_challenge_status IN ('scheduled', 'published', 'completed', 'archived') THEN
        RAISE EXCEPTION 'Scheduled challenge question sets are immutable';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER challenge_questions_validate
    BEFORE INSERT OR UPDATE OR DELETE ON public.challenge_questions
    FOR EACH ROW EXECUTE FUNCTION private.guard_challenge_question();

CREATE OR REPLACE FUNCTION private.guard_challenge_schedule()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
    v_challenge_id uuid;
    v_challenge_status public.daily_challenge_status;
    v_old_challenge_status public.daily_challenge_status;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_challenge_id := OLD.challenge_id;
    ELSE
        v_challenge_id := NEW.challenge_id;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        SELECT status
        INTO v_old_challenge_status
        FROM public.daily_challenges
        WHERE id = OLD.challenge_id;

        IF v_old_challenge_status IN ('scheduled', 'published', 'completed', 'archived') THEN
            RAISE EXCEPTION 'Scheduled challenge calendars are immutable';
        END IF;
    END IF;

    SELECT status
    INTO v_challenge_status
    FROM public.daily_challenges
    WHERE id = v_challenge_id;

    IF v_challenge_status IN ('scheduled', 'published', 'completed', 'archived') THEN
        RAISE EXCEPTION 'Scheduled challenge calendars are immutable';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER challenge_schedules_validate
    BEFORE INSERT OR UPDATE OR DELETE ON public.challenge_schedules
    FOR EACH ROW EXECUTE FUNCTION private.guard_challenge_schedule();

CREATE OR REPLACE FUNCTION private.validate_daily_challenge_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF TG_OP = 'UPDATE'
       AND OLD.status IN ('scheduled', 'published', 'completed', 'archived')
       AND NEW.status = 'draft' THEN
        RAISE EXCEPTION 'Scheduled challenges cannot be returned to draft';
    END IF;

    IF NEW.status IN ('scheduled', 'published') THEN
        IF (
            SELECT count(*)
            FROM public.challenge_questions AS cq
            WHERE cq.challenge_id = NEW.id
        ) <> 30 OR (
            SELECT count(DISTINCT qr.question_id)
            FROM public.challenge_questions AS cq
            JOIN public.question_revisions AS qr ON qr.id = cq.question_revision_id
            WHERE cq.challenge_id = NEW.id
        ) <> 30 THEN
            RAISE EXCEPTION 'Each scheduled challenge requires 30 unique questions';
        END IF;

        IF (
            SELECT count(*)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) <> 30 THEN
            RAISE EXCEPTION 'Each scheduled challenge requires 30 daily schedules';
        END IF;

        -- Thirty distinct dates from start_date through start_date + 29 are consecutive.
        IF (
            SELECT count(DISTINCT cs.challenge_date)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) <> 30 OR (
            SELECT max(cs.challenge_date) - min(cs.challenge_date)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) <> 29 OR (
            SELECT min(cs.challenge_date)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) IS DISTINCT FROM NEW.start_date OR (
            SELECT max(cs.challenge_date)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) IS DISTINCT FROM NEW.start_date + 29 THEN
            RAISE EXCEPTION 'Each scheduled challenge requires 30 consecutive dates from its start date';
        END IF;

        IF (
            SELECT count(DISTINCT cs.challenge_question_id)
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = NEW.id
              AND cs.exam_id = NEW.exam_id
        ) <> 30 THEN
            RAISE EXCEPTION 'Each scheduled day requires exactly one unique question';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM public.challenge_questions AS cq
            JOIN public.question_revisions AS qr ON qr.id = cq.question_revision_id
            JOIN public.questions AS q ON q.id = qr.question_id
            JOIN public.subtopics AS st ON st.id = q.subtopic_id
            JOIN public.chapters AS c ON c.id = st.chapter_id
            JOIN public.subjects AS s ON s.id = c.subject_id
            WHERE cq.challenge_id = NEW.id
              AND (
                  qr.status <> 'published'
                  OR q.archived_at IS NOT NULL
                  OR NOT st.is_active
                  OR NOT c.is_active
                  OR NOT s.is_active
                  OR s.exam_id <> NEW.exam_id
              )
        ) THEN
            RAISE EXCEPTION 'Challenge questions must be active published questions for the challenge exam';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER daily_challenges_validate_status
    BEFORE INSERT OR UPDATE OF status ON public.daily_challenges
    FOR EACH ROW EXECUTE FUNCTION private.validate_daily_challenge_status();

CREATE OR REPLACE FUNCTION private.guard_daily_challenge_start_date()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF OLD.status IN ('scheduled', 'published', 'completed', 'archived')
       AND NEW.start_date IS DISTINCT FROM OLD.start_date THEN
        RAISE EXCEPTION 'A scheduled challenge start date cannot be changed';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER daily_challenges_guard_start_date
    BEFORE UPDATE OF start_date ON public.daily_challenges
    FOR EACH ROW EXECUTE FUNCTION private.guard_daily_challenge_start_date();

CREATE OR REPLACE FUNCTION private.set_import_audit_fields()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
    IF TG_TABLE_NAME = 'admin_bulk_imports' AND TG_OP = 'INSERT' THEN
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Imports must be uploaded by an authenticated Admin';
        END IF;
        NEW.uploaded_by := auth.uid();
    END IF;

    IF NEW.status = 'approved' THEN
        IF TG_OP = 'INSERT' THEN
            IF auth.uid() IS NULL THEN
                RAISE EXCEPTION 'Only an authenticated Admin can approve imports';
            END IF;
            NEW.approved_by := auth.uid();
            NEW.approved_at := now();
        ELSIF OLD.status IS DISTINCT FROM 'approved'
           OR NEW.approved_by IS DISTINCT FROM OLD.approved_by
           OR NEW.approved_at IS DISTINCT FROM OLD.approved_at THEN
            IF auth.uid() IS NULL THEN
                RAISE EXCEPTION 'Only an authenticated Admin can approve imports';
            END IF;
            NEW.approved_by := auth.uid();
            NEW.approved_at := now();
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER admin_bulk_imports_audit
    BEFORE INSERT OR UPDATE ON public.admin_bulk_imports
    FOR EACH ROW EXECUTE FUNCTION private.set_import_audit_fields();
CREATE TRIGGER bulk_import_items_audit
    BEFORE INSERT OR UPDATE ON public.bulk_import_items
    FOR EACH ROW EXECUTE FUNCTION private.set_import_audit_fields();

DO $$
DECLARE
    v_table_name text;
BEGIN
    FOREACH v_table_name IN ARRAY ARRAY[
        'profiles',
        'student_profiles',
        'teacher_profiles',
        'user_preferences',
        'notification_preferences',
        'platform_settings',
        'exams',
        'subjects',
        'chapters',
        'subtopics',
        'questions',
        'question_revisions',
        'private_question_answer_keys',
        'daily_challenges',
        'challenge_schedules',
        'challenge_attempts',
        'student_mistake_items',
        'student_activity_daily',
        'student_exam_streaks',
        'student_exam_stats',
        'admin_bulk_imports',
        'bulk_import_items'
    ] LOOP
        IF v_table_name = 'private_question_answer_keys' THEN
            EXECUTE 'CREATE TRIGGER touch_updated_at BEFORE UPDATE ON private.question_answer_keys '
                || 'FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at()';
        ELSE
            EXECUTE format(
                'CREATE TRIGGER touch_updated_at BEFORE UPDATE ON public.%I '
                || 'FOR EACH ROW EXECUTE FUNCTION private.touch_updated_at()',
                v_table_name
            );
        END IF;
    END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION private.has_role(p_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles AS ur
        JOIN public.profiles AS p ON p.id = ur.user_id
        WHERE ur.user_id = auth.uid()
          AND ur.role = p_role
          AND p.account_status = 'active'
    );
$$;

CREATE OR REPLACE FUNCTION private.can_access_exam(p_exam_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT
        private.has_role('admin')
        OR (
            private.has_role('student')
            AND EXISTS (
                SELECT 1
                FROM public.student_exam_enrollments AS se
                JOIN public.exams AS e ON e.id = se.exam_id
                WHERE se.student_user_id = auth.uid()
                  AND se.exam_id = p_exam_id
                  AND se.status = 'active'
                  AND e.is_active
            )
        )
        OR (
            private.has_role('teacher')
            AND EXISTS (
                SELECT 1
                FROM public.teacher_exam_assignments AS ta
                JOIN public.exams AS e ON e.id = ta.exam_id
                WHERE ta.teacher_user_id = auth.uid()
                  AND ta.exam_id = p_exam_id
                  AND e.is_active
            )
        );
$$;

CREATE OR REPLACE FUNCTION private.can_read_question(p_question_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT
        private.has_role('admin')
        OR EXISTS (
            SELECT 1
            FROM public.question_revisions AS qr
            JOIN public.questions AS q ON q.id = qr.question_id
            JOIN public.subtopics AS st ON st.id = q.subtopic_id
            JOIN public.chapters AS c ON c.id = st.chapter_id
            JOIN public.subjects AS s ON s.id = c.subject_id
            WHERE qr.question_id = p_question_id
              AND qr.status = 'published'
              AND q.archived_at IS NULL
              AND st.is_active
              AND c.is_active
              AND s.is_active
              AND private.can_access_exam(s.exam_id)
        );
$$;

CREATE OR REPLACE FUNCTION private.can_read_question_revision(p_revision_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT
        private.has_role('admin')
        OR EXISTS (
            SELECT 1
            FROM public.question_revisions AS qr
            JOIN public.questions AS q ON q.id = qr.question_id
            JOIN public.subtopics AS st ON st.id = q.subtopic_id
            JOIN public.chapters AS c ON c.id = st.chapter_id
            JOIN public.subjects AS s ON s.id = c.subject_id
            WHERE qr.id = p_revision_id
              AND qr.status = 'published'
              AND q.archived_at IS NULL
              AND st.is_active
              AND c.is_active
              AND s.is_active
              AND private.can_access_exam(s.exam_id)
        )
        OR EXISTS (
            SELECT 1
            FROM public.question_revisions AS qr
            JOIN public.challenge_questions AS cq
              ON cq.question_revision_id = qr.id
            JOIN public.questions AS q ON q.id = qr.question_id
            JOIN public.subtopics AS st ON st.id = q.subtopic_id
            JOIN public.chapters AS c ON c.id = st.chapter_id
            JOIN public.subjects AS s ON s.id = c.subject_id
            JOIN public.exams AS e ON e.id = s.exam_id
            JOIN public.challenge_schedules AS cs
              ON cs.challenge_question_id = cq.id
             AND cs.challenge_id = cq.challenge_id
            JOIN public.daily_challenges AS dc
              ON dc.id = cs.challenge_id
             AND dc.exam_id = cs.exam_id
            JOIN public.student_exam_enrollments AS se
              ON se.exam_id = cs.exam_id
             AND se.student_user_id = auth.uid()
            WHERE qr.id = p_revision_id
              AND qr.status IN ('published', 'superseded')
              AND private.has_role('student')
              AND se.status = 'active'
              AND dc.status = 'published'
              AND s.exam_id = cs.exam_id
              AND e.is_active
              AND s.is_active
              AND c.is_active
              AND st.is_active
              AND q.archived_at IS NULL
              AND cs.challenge_date = (statement_timestamp() AT TIME ZONE 'Asia/Kolkata')::date
              AND statement_timestamp() >= cs.opens_at
              AND statement_timestamp() < cs.closes_at
        );
$$;

CREATE OR REPLACE FUNCTION private.can_read_challenge(p_challenge_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.daily_challenges AS dc
        WHERE dc.id = p_challenge_id
          AND dc.status IN ('scheduled', 'published', 'completed')
          AND private.can_access_exam(dc.exam_id)
    );
$$;

CREATE OR REPLACE FUNCTION private.can_start_challenge(p_schedule_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT private.has_role('student')
       AND EXISTS (
            SELECT 1
            FROM public.challenge_schedules AS cs
            JOIN public.daily_challenges AS dc
              ON dc.id = cs.challenge_id
             AND dc.exam_id = cs.exam_id
            JOIN public.student_exam_enrollments AS se
              ON se.exam_id = cs.exam_id
             AND se.student_user_id = auth.uid()
            JOIN public.challenge_questions AS cq
              ON cq.id = cs.challenge_question_id
             AND cq.challenge_id = cs.challenge_id
            JOIN public.question_revisions AS qr
              ON qr.id = cq.question_revision_id
            WHERE cs.id = p_schedule_id
              AND cs.challenge_date = (statement_timestamp() AT TIME ZONE 'Asia/Kolkata')::date
              AND statement_timestamp() >= cs.opens_at
              AND statement_timestamp() < cs.closes_at
              AND dc.status = 'published'
              AND se.status = 'active'
              AND qr.status IN ('published', 'superseded')
       );
$$;

CREATE OR REPLACE FUNCTION private.can_answer_practice(
    p_attempt_id uuid,
    p_revision_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT private.has_role('student')
       AND EXISTS (
            SELECT 1
            FROM public.practice_attempts AS pa
            JOIN public.question_revisions AS qr ON qr.id = p_revision_id
            JOIN public.questions AS q ON q.id = qr.question_id
            JOIN public.subtopics AS st ON st.id = q.subtopic_id
            JOIN public.chapters AS c ON c.id = st.chapter_id
            JOIN public.subjects AS s ON s.id = c.subject_id
            WHERE pa.id = p_attempt_id
              AND pa.student_user_id = auth.uid()
              AND pa.status = 'in_progress'
              AND pa.exam_id = s.exam_id
              AND qr.status = 'published'
              AND q.archived_at IS NULL
              AND st.is_active
              AND c.is_active
              AND s.is_active
              AND private.can_access_exam(pa.exam_id)
       );
$$;

CREATE OR REPLACE FUNCTION public.complete_student_registration(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF auth.role() IS DISTINCT FROM 'service_role' THEN
        RAISE EXCEPTION 'Registration provisioning is restricted to the trusted server';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'Auth user does not exist';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = p_user_id
          AND role <> 'student'
    ) THEN
        RAISE EXCEPTION 'Public registration cannot provision privileged roles';
    END IF;

    INSERT INTO public.student_profiles (user_id, student_code)
    VALUES (p_user_id, 'STU-' || upper(substr(replace(p_user_id::text, '-', ''), 1, 12)))
    ON CONFLICT (user_id) DO NOTHING;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, 'student')
    ON CONFLICT (user_id, role) DO NOTHING;

    UPDATE public.profiles
    SET account_status = 'active'
    WHERE id = p_user_id
      AND account_status = 'inactive';

    IF NOT FOUND AND NOT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = p_user_id AND account_status = 'active'
    ) THEN
        RAISE EXCEPTION 'Student profile could not be activated';
    END IF;
END;
$$;

-- Both Admin-management RPCs take the same transaction lock before changing
-- roles or account status so concurrent updates cannot bypass the last-Admin guard.
CREATE OR REPLACE FUNCTION public.admin_set_user_role(
    p_user_id uuid,
    p_role public.app_role,
    p_granted boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_active_admins bigint;
BEGIN
    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    PERFORM pg_advisory_xact_lock(1463899713, 1);

    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'Profile does not exist';
    END IF;

    IF NOT p_granted AND p_role = 'admin' THEN
        IF p_user_id = auth.uid() THEN
            RAISE EXCEPTION 'Admins cannot revoke their own Admin role';
        END IF;

        SELECT count(*)
        INTO v_active_admins
        FROM public.user_roles AS ur
        JOIN public.profiles AS p ON p.id = ur.user_id
        WHERE ur.role = 'admin'
          AND p.account_status = 'active';

        IF v_active_admins <= 1 THEN
            RAISE EXCEPTION 'The last active Admin role cannot be revoked';
        END IF;
    END IF;

    IF p_granted THEN
        IF p_role = 'student' THEN
            INSERT INTO public.student_profiles (user_id, student_code)
            VALUES (p_user_id, 'STU-' || upper(substr(replace(p_user_id::text, '-', ''), 1, 12)))
            ON CONFLICT (user_id) DO NOTHING;
        ELSIF p_role = 'teacher' THEN
            INSERT INTO public.teacher_profiles (user_id, teacher_code)
            VALUES (p_user_id, 'TCH-' || upper(substr(replace(p_user_id::text, '-', ''), 1, 12)))
            ON CONFLICT (user_id) DO NOTHING;
        END IF;

        INSERT INTO public.user_roles (user_id, role, granted_by)
        VALUES (p_user_id, p_role, auth.uid())
        ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
        DELETE FROM public.user_roles
        WHERE user_id = p_user_id
          AND role = p_role;
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_account_status(
    p_user_id uuid,
    p_status public.account_status
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_active_admins bigint;
BEGIN
    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    PERFORM pg_advisory_xact_lock(1463899713, 1);

    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    IF p_status = 'active' AND NOT EXISTS (
        SELECT 1 FROM public.user_roles WHERE user_id = p_user_id
    ) THEN
        RAISE EXCEPTION 'A role must be granted before activating an account';
    END IF;

    IF p_status <> 'active' AND EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = p_user_id AND role = 'admin'
    ) THEN
        SELECT count(*)
        INTO v_active_admins
        FROM public.user_roles AS ur
        JOIN public.profiles AS p ON p.id = ur.user_id
        WHERE ur.role = 'admin'
          AND p.account_status = 'active';

        IF v_active_admins <= 1 THEN
            RAISE EXCEPTION 'The last active Admin account cannot be disabled';
        END IF;
    END IF;

    UPDATE public.profiles
    SET account_status = p_status
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile does not exist';
    END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_question_answer_key(
    p_revision_id uuid,
    p_correct_option_id uuid,
    p_explanation text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_status public.question_revision_status;
BEGIN
    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    SELECT status INTO v_status
    FROM public.question_revisions
    WHERE id = p_revision_id
    FOR UPDATE;

    IF v_status IS NULL OR v_status NOT IN ('draft', 'in_review') THEN
        RAISE EXCEPTION 'Answer keys can only be set for draft or review revisions';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.question_options
        WHERE question_revision_id = p_revision_id
          AND id = p_correct_option_id
    ) THEN
        RAISE EXCEPTION 'Correct option must belong to the specified revision';
    END IF;

    INSERT INTO private.question_answer_keys (
        question_revision_id, correct_option_id, explanation
    )
    VALUES (p_revision_id, p_correct_option_id, coalesce(p_explanation, ''))
    ON CONFLICT (question_revision_id) DO UPDATE
    SET correct_option_id = EXCLUDED.correct_option_id,
        explanation = EXCLUDED.explanation,
        updated_at = now();
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_publish_question_revision(p_revision_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_question_id uuid;
    v_status public.question_revision_status;
    v_option_count bigint;
BEGIN
    IF NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Admin role required';
    END IF;

    SELECT question_id, status
    INTO v_question_id, v_status
    FROM public.question_revisions
    WHERE id = p_revision_id
    FOR UPDATE;

    IF v_question_id IS NULL OR v_status NOT IN ('draft', 'in_review') THEN
        RAISE EXCEPTION 'Only draft or review revisions can be published';
    END IF;

    SELECT count(*) INTO v_option_count
    FROM public.question_options
    WHERE question_revision_id = p_revision_id;

    IF v_option_count <> 4 OR NOT EXISTS (
        SELECT 1
        FROM private.question_answer_keys
        WHERE question_revision_id = p_revision_id
    ) THEN
        RAISE EXCEPTION 'A published revision requires exactly four options and one answer key';
    END IF;

    UPDATE public.question_revisions
    SET status = 'superseded'
    WHERE question_id = v_question_id
      AND status = 'published';

    UPDATE public.question_revisions
    SET status = 'published',
        reviewed_by = auth.uid(),
        published_at = now(),
        updated_at = now()
    WHERE id = p_revision_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_authorized_question_answer_key(p_revision_id uuid)
RETURNS TABLE (
    question_revision_id uuid,
    correct_option_id uuid,
    explanation text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT k.question_revision_id, k.correct_option_id, k.explanation
    FROM private.question_answer_keys AS k
    JOIN public.question_revisions AS qr ON qr.id = k.question_revision_id
    JOIN public.questions AS q ON q.id = qr.question_id
    JOIN public.subtopics AS st ON st.id = q.subtopic_id
    JOIN public.chapters AS c ON c.id = st.chapter_id
    JOIN public.subjects AS s ON s.id = c.subject_id
    WHERE qr.id = p_revision_id
      AND qr.status = 'published'
      AND q.archived_at IS NULL
      AND st.is_active
      AND c.is_active
      AND s.is_active
      AND (
          private.has_role('admin')
          OR (
              private.has_role('teacher')
              AND NOT private.has_role('student')
              AND EXISTS (
                  SELECT 1
                  FROM public.teacher_exam_assignments AS ta
                  WHERE ta.teacher_user_id = auth.uid()
                    AND ta.exam_id = s.exam_id
              )
          )
      );
$$;

CREATE OR REPLACE FUNCTION public.submit_daily_challenge_answer(
    p_schedule_id uuid,
    p_selected_option_id uuid
)
RETURNS TABLE (
    attempt_id uuid,
    attempt_number integer,
    is_correct boolean,
    completed boolean,
    completed_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_student_id uuid := auth.uid();
    v_challenge_id uuid;
    v_exam_id uuid;
    v_challenge_question_id uuid;
    v_question_revision_id uuid;
    v_challenge_date date;
    v_opens_at timestamptz;
    v_closes_at timestamptz;
    v_challenge_status public.daily_challenge_status;
    v_revision_status public.question_revision_status;
    v_correct_option_id uuid;
    v_now timestamptz;
    v_attempt_number integer;
    v_attempt_id uuid;
    v_is_correct boolean;
    v_completed_at timestamptz;
BEGIN
    IF v_student_id IS NULL OR NOT private.has_role('student') THEN
        RAISE EXCEPTION 'Active Student role required';
    END IF;

    PERFORM 1
    FROM public.profiles AS p
    JOIN public.student_profiles AS sp ON sp.user_id = p.id
    WHERE p.id = v_student_id
    FOR UPDATE OF p, sp;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active Student profile required';
    END IF;

    PERFORM 1
    FROM public.user_roles AS ur
    WHERE ur.user_id = v_student_id
      AND ur.role = 'student'
    FOR SHARE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active Student role required';
    END IF;

    IF NOT private.has_role('student') THEN
        RAISE EXCEPTION 'Active Student role required';
    END IF;

    SELECT
        cs.challenge_id,
        cs.exam_id,
        cs.challenge_question_id,
        cs.challenge_date,
        cs.opens_at,
        cs.closes_at,
        dc.status,
        qr.id,
        qr.status,
        ak.correct_option_id
    INTO
        v_challenge_id,
        v_exam_id,
        v_challenge_question_id,
        v_challenge_date,
        v_opens_at,
        v_closes_at,
        v_challenge_status,
        v_question_revision_id,
        v_revision_status,
        v_correct_option_id
    FROM public.challenge_schedules AS cs
    JOIN public.daily_challenges AS dc
      ON dc.id = cs.challenge_id
     AND dc.exam_id = cs.exam_id
    JOIN public.challenge_questions AS cq
      ON cq.id = cs.challenge_question_id
     AND cq.challenge_id = cs.challenge_id
    JOIN public.question_revisions AS qr
      ON qr.id = cq.question_revision_id
    JOIN public.questions AS q ON q.id = qr.question_id
    JOIN public.subtopics AS st ON st.id = q.subtopic_id
    JOIN public.chapters AS c ON c.id = st.chapter_id
    JOIN public.subjects AS s ON s.id = c.subject_id
    JOIN public.exams AS e ON e.id = s.exam_id
    JOIN private.question_answer_keys AS ak
      ON ak.question_revision_id = qr.id
    WHERE cs.id = p_schedule_id
      AND s.exam_id = cs.exam_id
      AND e.is_active
      AND s.is_active
      AND c.is_active
      AND st.is_active
      AND q.archived_at IS NULL
    FOR SHARE OF cs, dc, cq;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'No active question is assigned to this challenge schedule';
    END IF;

    IF NOT private.has_role('student') THEN
        RAISE EXCEPTION 'Active Student role required';
    END IF;

    v_now := clock_timestamp();

    IF v_challenge_status <> 'published'
       OR v_revision_status NOT IN ('published', 'superseded')
       OR v_challenge_date <> (v_now AT TIME ZONE 'Asia/Kolkata')::date
       OR v_now < v_opens_at
       OR v_now >= v_closes_at THEN
        RAISE EXCEPTION 'The daily challenge is not open for submissions';
    END IF;

    PERFORM 1
    FROM public.student_exam_enrollments AS se
    WHERE se.student_user_id = v_student_id
      AND se.exam_id = v_exam_id
      AND se.status = 'active'
    FOR SHARE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active exam enrollment required';
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM public.question_options AS qo
        WHERE qo.question_revision_id = v_question_revision_id
          AND qo.id = p_selected_option_id
    ) THEN
        RAISE EXCEPTION 'Selected option does not belong to today''s question';
    END IF;

    SELECT ca.id, ca.attempt_number, cc.completed_at
    INTO v_attempt_id, v_attempt_number, v_completed_at
    FROM public.challenge_completions AS cc
    JOIN public.challenge_attempts AS ca
      ON ca.id = cc.attempt_id
     AND ca.student_user_id = cc.student_user_id
     AND ca.schedule_id = cc.schedule_id
    WHERE cc.student_user_id = v_student_id
      AND cc.schedule_id = p_schedule_id;

    IF FOUND THEN
        RETURN QUERY
        SELECT v_attempt_id, v_attempt_number, true, true, v_completed_at;
        RETURN;
    END IF;

    v_is_correct := p_selected_option_id = v_correct_option_id;

    SELECT coalesce(max(ca.attempt_number), 0) + 1
    INTO v_attempt_number
    FROM public.challenge_attempts AS ca
    WHERE ca.student_user_id = v_student_id
      AND ca.schedule_id = p_schedule_id;

    INSERT INTO public.challenge_attempts (
        schedule_id,
        challenge_id,
        student_user_id,
        attempt_number,
        status,
        correct_count,
        started_at,
        submitted_at
    )
    VALUES (
        p_schedule_id,
        v_challenge_id,
        v_student_id,
        v_attempt_number,
        'submitted',
        CASE WHEN v_is_correct THEN 1 ELSE 0 END,
        v_now,
        v_now
    )
    RETURNING id INTO v_attempt_id;

    INSERT INTO public.challenge_attempt_answers (
        attempt_id,
        challenge_id,
        challenge_question_id,
        question_revision_id,
        selected_option_id,
        is_correct,
        answered_at
    )
    VALUES (
        v_attempt_id,
        v_challenge_id,
        v_challenge_question_id,
        v_question_revision_id,
        p_selected_option_id,
        v_is_correct,
        v_now
    );

    IF v_is_correct THEN
        v_completed_at := v_now;

        INSERT INTO public.challenge_completions (
            student_user_id,
            schedule_id,
            attempt_id,
            completed_at,
            score,
            total_questions
        )
        VALUES (
            v_student_id,
            p_schedule_id,
            v_attempt_id,
            v_completed_at,
            1,
            1
        );

        INSERT INTO public.student_exam_streaks AS ses (
            student_user_id,
            exam_id,
            current_days,
            best_days,
            last_completed_date
        )
        VALUES (v_student_id, v_exam_id, 1, 1, v_challenge_date)
        ON CONFLICT (student_user_id, exam_id) DO UPDATE
        SET current_days = CASE
                WHEN ses.last_completed_date = EXCLUDED.last_completed_date - 1
                    THEN ses.current_days + 1
                ELSE 1
            END,
            best_days = greatest(
                ses.best_days,
                CASE
                    WHEN ses.last_completed_date = EXCLUDED.last_completed_date - 1
                        THEN ses.current_days + 1
                    ELSE 1
                END
            ),
            last_completed_date = EXCLUDED.last_completed_date,
            updated_at = v_now;
    END IF;

    RETURN QUERY
    SELECT v_attempt_id, v_attempt_number, v_is_correct, v_is_correct, v_completed_at;
END;
$$;

CREATE OR REPLACE FUNCTION private.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_display_name text;
BEGIN
    v_display_name := left(
        coalesce(
            nullif(btrim(NEW.raw_user_meta_data ->> 'display_name'), ''),
            nullif(split_part(coalesce(NEW.email, ''), '@', 1), ''),
            'New user'
        ),
        100
    );

    INSERT INTO public.profiles (id, display_name, account_status)
    VALUES (NEW.id, v_display_name, 'inactive')
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;

INSERT INTO public.profiles (id, display_name, account_status)
SELECT
    u.id,
    left(
        coalesce(
            nullif(btrim(u.raw_user_meta_data ->> 'display_name'), ''),
            nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
            'Existing user'
        ),
        100
    ),
    'inactive'
FROM auth.users AS u
ON CONFLICT (id) DO NOTHING;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION private.handle_new_auth_user();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE private.question_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_exam_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practice_attempt_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mistake_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activity_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_exam_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_bulk_imports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_import_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_read_self_or_admin
    ON public.profiles FOR SELECT TO authenticated
    USING (id = auth.uid() OR private.has_role('admin'));
CREATE POLICY profiles_update_self_or_admin
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = auth.uid() OR private.has_role('admin'))
    WITH CHECK (id = auth.uid() OR private.has_role('admin'));

CREATE POLICY user_roles_read_self_or_admin
    ON public.user_roles FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR private.has_role('admin'));

CREATE POLICY student_profiles_read_self_or_admin
    ON public.student_profiles FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_profiles_update_self_or_admin
    ON public.student_profiles FOR UPDATE TO authenticated
    USING (
        (user_id = auth.uid() AND private.has_role('student'))
        OR private.has_role('admin')
    )
    WITH CHECK (
        (user_id = auth.uid() AND private.has_role('student'))
        OR private.has_role('admin')
    );

CREATE POLICY teacher_profiles_read_self_or_admin
    ON public.teacher_profiles FOR SELECT TO authenticated
    USING (user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY teacher_profiles_update_self_or_admin
    ON public.teacher_profiles FOR UPDATE TO authenticated
    USING (
        (user_id = auth.uid() AND private.has_role('teacher'))
        OR private.has_role('admin')
    )
    WITH CHECK (
        (user_id = auth.uid() AND private.has_role('teacher'))
        OR private.has_role('admin')
    );

CREATE POLICY user_preferences_owner_all
    ON public.user_preferences FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
CREATE POLICY notification_preferences_owner_all
    ON public.notification_preferences FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY platform_settings_admin_all
    ON public.platform_settings FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY exams_read_active_anon
    ON public.exams FOR SELECT TO anon
    USING (is_active);
CREATE POLICY exams_read_active_or_admin
    ON public.exams FOR SELECT TO authenticated
    USING (is_active OR private.has_role('admin'));
CREATE POLICY exams_admin_all
    ON public.exams FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY subjects_read_active_anon
    ON public.subjects FOR SELECT TO anon
    USING (is_active AND EXISTS (
        SELECT 1 FROM public.exams AS e WHERE e.id = exam_id AND e.is_active
    ));
CREATE POLICY subjects_read_active_or_admin
    ON public.subjects FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR (is_active AND private.can_access_exam(exam_id))
    );
CREATE POLICY subjects_admin_all
    ON public.subjects FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY chapters_read_active_anon
    ON public.chapters FOR SELECT TO anon
    USING (is_active AND EXISTS (
        SELECT 1
        FROM public.subjects AS s
        JOIN public.exams AS e ON e.id = s.exam_id
        WHERE s.id = subject_id AND s.is_active AND e.is_active
    ));
CREATE POLICY chapters_read_active_or_admin
    ON public.chapters FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR (
            is_active
            AND EXISTS (
                SELECT 1
                FROM public.subjects AS s
                WHERE s.id = subject_id
                  AND s.is_active
                  AND private.can_access_exam(s.exam_id)
            )
        )
    );
CREATE POLICY chapters_admin_all
    ON public.chapters FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY subtopics_read_active_anon
    ON public.subtopics FOR SELECT TO anon
    USING (is_active AND EXISTS (
        SELECT 1
        FROM public.chapters AS c
        JOIN public.subjects AS s ON s.id = c.subject_id
        JOIN public.exams AS e ON e.id = s.exam_id
        WHERE c.id = chapter_id AND c.is_active AND s.is_active AND e.is_active
    ));
CREATE POLICY subtopics_read_active_or_admin
    ON public.subtopics FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR (
            is_active
            AND EXISTS (
                SELECT 1
                FROM public.chapters AS c
                JOIN public.subjects AS s ON s.id = c.subject_id
                WHERE c.id = chapter_id
                  AND c.is_active
                  AND s.is_active
                  AND private.can_access_exam(s.exam_id)
            )
        )
    );
CREATE POLICY subtopics_admin_all
    ON public.subtopics FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY questions_read_published_scope
    ON public.questions FOR SELECT TO authenticated
    USING (private.can_read_question(id));
CREATE POLICY questions_admin_all
    ON public.questions FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY question_revisions_read_published_scope
    ON public.question_revisions FOR SELECT TO authenticated
    USING (private.can_read_question_revision(id));
CREATE POLICY question_revisions_admin_read_all
    ON public.question_revisions FOR SELECT TO authenticated
    USING (private.has_role('admin'));
CREATE POLICY question_revisions_admin_insert_draft
    ON public.question_revisions FOR INSERT TO authenticated
    WITH CHECK (
        private.has_role('admin')
        AND status IN ('draft', 'in_review')
        AND (created_by IS NULL OR created_by = auth.uid())
    );
CREATE POLICY question_revisions_admin_update_draft
    ON public.question_revisions FOR UPDATE TO authenticated
    USING (
        private.has_role('admin')
        AND status IN ('draft', 'in_review')
    )
    WITH CHECK (
        private.has_role('admin')
        AND status IN ('draft', 'in_review')
    );
CREATE POLICY question_revisions_admin_delete_draft
    ON public.question_revisions FOR DELETE TO authenticated
    USING (
        private.has_role('admin')
        AND status IN ('draft', 'in_review')
    );

CREATE POLICY question_options_read_published_scope
    ON public.question_options FOR SELECT TO authenticated
    USING (private.can_read_question_revision(question_revision_id));
CREATE POLICY question_options_admin_insert_draft
    ON public.question_options FOR INSERT TO authenticated
    WITH CHECK (
        private.has_role('admin')
        AND EXISTS (
            SELECT 1 FROM public.question_revisions AS qr
            WHERE qr.id = question_revision_id
              AND qr.status IN ('draft', 'in_review')
        )
    );
CREATE POLICY question_options_admin_update_draft
    ON public.question_options FOR UPDATE TO authenticated
    USING (
        private.has_role('admin')
        AND EXISTS (
            SELECT 1 FROM public.question_revisions AS qr
            WHERE qr.id = question_revision_id
              AND qr.status IN ('draft', 'in_review')
        )
    )
    WITH CHECK (
        private.has_role('admin')
        AND EXISTS (
            SELECT 1 FROM public.question_revisions AS qr
            WHERE qr.id = question_revision_id
              AND qr.status IN ('draft', 'in_review')
        )
    );
CREATE POLICY question_options_admin_delete_draft
    ON public.question_options FOR DELETE TO authenticated
    USING (
        private.has_role('admin')
        AND EXISTS (
            SELECT 1 FROM public.question_revisions AS qr
            WHERE qr.id = question_revision_id
              AND qr.status IN ('draft', 'in_review')
        )
    );

CREATE POLICY student_exam_enrollments_read_self_or_admin
    ON public.student_exam_enrollments FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_exam_enrollments_insert_self
    ON public.student_exam_enrollments FOR INSERT TO authenticated
    WITH CHECK (
        student_user_id = auth.uid()
        AND private.has_role('student')
        AND EXISTS (
            SELECT 1 FROM public.exams AS e
            WHERE e.id = exam_id AND e.is_active
        )
    );
CREATE POLICY student_exam_enrollments_admin_all
    ON public.student_exam_enrollments FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY teacher_exam_assignments_read_self_or_admin
    ON public.teacher_exam_assignments FOR SELECT TO authenticated
    USING (teacher_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY teacher_exam_assignments_admin_all
    ON public.teacher_exam_assignments FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY daily_challenges_read_enrolled
    ON public.daily_challenges FOR SELECT TO authenticated
    USING (private.can_read_challenge(id));
CREATE POLICY daily_challenges_admin_all
    ON public.daily_challenges FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY challenge_questions_read_enrolled
    ON public.challenge_questions FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR (
            private.has_role('teacher')
            AND NOT private.has_role('student')
            AND private.can_read_challenge(challenge_id)
        )
        OR EXISTS (
            SELECT 1
            FROM public.challenge_schedules AS cs
            WHERE cs.challenge_id = challenge_questions.challenge_id
              AND cs.challenge_question_id = challenge_questions.id
              AND private.can_start_challenge(cs.id)
        )
    );
CREATE POLICY challenge_questions_admin_all
    ON public.challenge_questions FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY challenge_schedules_read_enrolled
    ON public.challenge_schedules FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR (
            private.has_role('teacher')
            AND NOT private.has_role('student')
            AND private.can_read_challenge(challenge_id)
        )
        OR private.can_start_challenge(id)
    );
CREATE POLICY challenge_schedules_admin_all
    ON public.challenge_schedules FOR ALL TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));

CREATE POLICY challenge_attempts_read_owner_or_admin
    ON public.challenge_attempts FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY challenge_attempt_answers_read_owner_or_admin
    ON public.challenge_attempt_answers FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR EXISTS (
            SELECT 1 FROM public.challenge_attempts AS ca
            WHERE ca.id = attempt_id
              AND ca.student_user_id = auth.uid()
        )
    );
CREATE POLICY challenge_completions_read_owner_or_admin
    ON public.challenge_completions FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_exam_streaks_read_owner_or_admin
    ON public.student_exam_streaks FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));

CREATE POLICY practice_attempts_read_owner_or_admin
    ON public.practice_attempts FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY practice_attempts_insert_owner
    ON public.practice_attempts FOR INSERT TO authenticated
    WITH CHECK (
        student_user_id = auth.uid()
        AND status = 'in_progress'
        AND finished_at IS NULL
        AND private.has_role('student')
        AND private.can_access_exam(exam_id)
    );

CREATE POLICY practice_attempt_answers_read_owner_or_admin
    ON public.practice_attempt_answers FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR EXISTS (
            SELECT 1 FROM public.practice_attempts AS pa
            WHERE pa.id = practice_attempt_id
              AND pa.student_user_id = auth.uid()
        )
    );
CREATE POLICY practice_attempt_answers_insert_ungraded_owner
    ON public.practice_attempt_answers FOR INSERT TO authenticated
    WITH CHECK (
        is_correct IS NULL
        AND private.can_answer_practice(practice_attempt_id, question_revision_id)
    );

CREATE POLICY student_bookmarks_read_owner_or_admin
    ON public.student_bookmarks FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_bookmarks_insert_owner
    ON public.student_bookmarks FOR INSERT TO authenticated
    WITH CHECK (
        student_user_id = auth.uid()
        AND private.has_role('student')
        AND private.can_read_question(question_id)
    );
CREATE POLICY student_bookmarks_delete_owner
    ON public.student_bookmarks FOR DELETE TO authenticated
    USING (student_user_id = auth.uid() AND private.has_role('student'));

CREATE POLICY student_mistake_items_read_owner_or_admin
    ON public.student_mistake_items FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_mistake_items_update_owner_notes
    ON public.student_mistake_items FOR UPDATE TO authenticated
    USING (student_user_id = auth.uid() AND private.has_role('student'))
    WITH CHECK (student_user_id = auth.uid() AND private.has_role('student'));

CREATE POLICY student_activity_daily_read_owner_or_admin
    ON public.student_activity_daily FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));
CREATE POLICY student_exam_stats_read_owner_or_admin
    ON public.student_exam_stats FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));

CREATE POLICY leaderboard_snapshots_read_owner_or_admin
    ON public.leaderboard_snapshots FOR SELECT TO authenticated
    USING (
        private.has_role('admin')
        OR EXISTS (
            SELECT 1 FROM public.leaderboard_entries AS le
            WHERE le.snapshot_id = id
              AND le.student_user_id = auth.uid()
        )
    );
CREATE POLICY leaderboard_entries_read_owner_or_admin
    ON public.leaderboard_entries FOR SELECT TO authenticated
    USING (student_user_id = auth.uid() OR private.has_role('admin'));

CREATE POLICY admin_bulk_imports_admin_select
    ON public.admin_bulk_imports FOR SELECT TO authenticated
    USING (private.has_role('admin'));
CREATE POLICY admin_bulk_imports_admin_insert
    ON public.admin_bulk_imports FOR INSERT TO authenticated
    WITH CHECK (private.has_role('admin') AND uploaded_by = auth.uid());
CREATE POLICY admin_bulk_imports_admin_update
    ON public.admin_bulk_imports FOR UPDATE TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));
CREATE POLICY admin_bulk_imports_admin_delete
    ON public.admin_bulk_imports FOR DELETE TO authenticated
    USING (private.has_role('admin'));

CREATE POLICY bulk_import_items_admin_select
    ON public.bulk_import_items FOR SELECT TO authenticated
    USING (private.has_role('admin'));
CREATE POLICY bulk_import_items_admin_insert
    ON public.bulk_import_items FOR INSERT TO authenticated
    WITH CHECK (private.has_role('admin'));
CREATE POLICY bulk_import_items_admin_update
    ON public.bulk_import_items FOR UPDATE TO authenticated
    USING (private.has_role('admin'))
    WITH CHECK (private.has_role('admin'));
CREATE POLICY bulk_import_items_admin_delete
    ON public.bulk_import_items FOR DELETE TO authenticated
    USING (private.has_role('admin'));

-- Remove any permissive/default grants before assigning the minimum required
-- application privileges. RLS policies remain the row-level authorization layer.
REVOKE ALL ON TABLE
    public.profiles,
    public.user_roles,
    public.student_profiles,
    public.teacher_profiles,
    public.user_preferences,
    public.notification_preferences,
    public.platform_settings,
    public.exams,
    public.subjects,
    public.chapters,
    public.subtopics,
    public.questions,
    public.question_revisions,
    public.question_options,
    public.student_exam_enrollments,
    public.teacher_exam_assignments,
    public.daily_challenges,
    public.challenge_questions,
    public.challenge_schedules,
    public.challenge_attempts,
    public.challenge_attempt_answers,
    public.challenge_completions,
    public.student_exam_streaks,
    public.practice_attempts,
    public.practice_attempt_answers,
    public.student_bookmarks,
    public.student_mistake_items,
    public.student_activity_daily,
    public.student_exam_stats,
    public.leaderboard_snapshots,
    public.leaderboard_entries,
    public.admin_bulk_imports,
    public.bulk_import_items
FROM PUBLIC, anon, authenticated;

REVOKE ALL ON TABLE private.question_answer_keys FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON TYPE
    public.app_role,
    public.account_status,
    public.question_revision_status,
    public.question_difficulty,
    public.daily_challenge_status,
    public.attempt_status,
    public.import_status,
    public.import_item_status,
    public.leaderboard_period
TO authenticated, service_role;
GRANT USAGE ON TYPE public.app_role, public.account_status TO anon;

GRANT SELECT ON
    public.exams, public.subjects, public.chapters, public.subtopics
TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON
    public.exams, public.subjects, public.chapters, public.subtopics
TO authenticated;

GRANT SELECT ON
    public.profiles,
    public.user_roles,
    public.student_profiles,
    public.teacher_profiles,
    public.student_exam_enrollments,
    public.teacher_exam_assignments,
    public.user_preferences,
    public.notification_preferences,
    public.platform_settings,
    public.questions,
    public.question_revisions,
    public.question_options,
    public.daily_challenges,
    public.challenge_questions,
    public.challenge_schedules,
    public.challenge_attempts,
    public.challenge_attempt_answers,
    public.challenge_completions,
    public.student_exam_streaks,
    public.practice_attempts,
    public.practice_attempt_answers,
    public.student_bookmarks,
    public.student_mistake_items,
    public.student_activity_daily,
    public.student_exam_stats,
    public.leaderboard_snapshots,
    public.leaderboard_entries,
    public.admin_bulk_imports,
    public.bulk_import_items
TO authenticated;

GRANT UPDATE (display_name, phone_e164, avatar_path)
    ON public.profiles TO authenticated;
GRANT UPDATE (school_name, class_level, leaderboard_opt_in)
    ON public.student_profiles TO authenticated;
GRANT UPDATE (bio) ON public.teacher_profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE
    ON public.user_preferences, public.notification_preferences
    TO authenticated;
GRANT INSERT, UPDATE ON public.platform_settings TO authenticated;
GRANT INSERT (student_user_id, exam_id) ON public.student_exam_enrollments
    TO authenticated;
GRANT UPDATE, DELETE ON public.student_exam_enrollments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.teacher_exam_assignments TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.question_revisions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.question_options TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.daily_challenges TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.challenge_questions TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.challenge_schedules TO authenticated;
GRANT INSERT (exam_id) ON public.practice_attempts TO authenticated;
GRANT INSERT (practice_attempt_id, question_revision_id, selected_option_id)
    ON public.practice_attempt_answers TO authenticated;
GRANT INSERT (student_user_id, question_id) ON public.student_bookmarks TO authenticated;
GRANT DELETE ON public.student_bookmarks TO authenticated;
GRANT UPDATE (note, reviewed_at) ON public.student_mistake_items TO authenticated;
GRANT INSERT, UPDATE, DELETE
    ON public.admin_bulk_imports, public.bulk_import_items
    TO authenticated;

-- service_role is only for trusted server-side code and migrations. Never ship
-- its key to a browser or other untrusted client.
GRANT ALL PRIVILEGES ON
    public.profiles,
    public.user_roles,
    public.student_profiles,
    public.teacher_profiles,
    public.user_preferences,
    public.notification_preferences,
    public.platform_settings,
    public.exams,
    public.subjects,
    public.chapters,
    public.subtopics,
    public.questions,
    public.question_revisions,
    public.question_options,
    public.student_exam_enrollments,
    public.teacher_exam_assignments,
    public.daily_challenges,
    public.challenge_questions,
    public.challenge_schedules,
    public.challenge_attempts,
    public.challenge_attempt_answers,
    public.challenge_completions,
    public.student_exam_streaks,
    public.practice_attempts,
    public.practice_attempt_answers,
    public.student_bookmarks,
    public.student_mistake_items,
    public.student_activity_daily,
    public.student_exam_stats,
    public.leaderboard_snapshots,
    public.leaderboard_entries,
    public.admin_bulk_imports,
    public.bulk_import_items
TO service_role;

REVOKE ALL ON FUNCTION private.has_role(public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_access_exam(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_read_question(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_read_question_revision(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_read_challenge(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_start_challenge(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.can_answer_practice(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_access_exam(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_read_question(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_read_question_revision(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_read_challenge(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_start_challenge(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.can_answer_practice(uuid, uuid) TO authenticated, service_role;
REVOKE ALL ON FUNCTION private.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.guard_immutable_question_revision() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.guard_challenge_question() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.guard_challenge_schedule() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.validate_daily_challenge_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.guard_daily_challenge_start_date() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.set_import_audit_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION private.handle_new_auth_user() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.complete_student_registration(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.complete_student_registration(uuid) TO service_role;
REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, public.app_role, boolean)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, public.app_role, boolean)
    TO authenticated;
REVOKE ALL ON FUNCTION public.admin_set_account_status(uuid, public.account_status)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_account_status(uuid, public.account_status)
    TO authenticated;
REVOKE ALL ON FUNCTION public.admin_set_question_answer_key(uuid, uuid, text)
    FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_set_question_answer_key(uuid, uuid, text)
    TO authenticated;
REVOKE ALL ON FUNCTION public.admin_publish_question_revision(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_publish_question_revision(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.get_authorized_question_answer_key(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_authorized_question_answer_key(uuid) TO authenticated;
REVOKE ALL ON FUNCTION public.submit_daily_challenge_answer(uuid, uuid)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_daily_challenge_answer(uuid, uuid)
    TO authenticated;

-- Supabase Storage is expected to be enabled by the Supabase project.
DO $$
BEGIN
    IF to_regclass('storage.buckets') IS NULL OR to_regclass('storage.objects') IS NULL THEN
        RAISE EXCEPTION 'Supabase Storage must be enabled before this migration is applied';
    END IF;

    IF EXISTS (
        SELECT 1 FROM storage.buckets
        WHERE id = 'question-imports-private' AND public
    ) THEN
        RAISE EXCEPTION 'The question import bucket must not be public';
    END IF;

    INSERT INTO storage.buckets (id, name, public)
    VALUES ('question-imports-private', 'question-imports-private', false)
    ON CONFLICT (id) DO NOTHING;
END;
$$;

CREATE POLICY question_imports_admin_read
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'question-imports-private'
        AND private.has_role('admin')
    );
CREATE POLICY question_imports_admin_insert
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'question-imports-private'
        AND private.has_role('admin')
    );
CREATE POLICY question_imports_admin_update
    ON storage.objects FOR UPDATE TO authenticated
    USING (
        bucket_id = 'question-imports-private'
        AND private.has_role('admin')
    )
    WITH CHECK (
        bucket_id = 'question-imports-private'
        AND private.has_role('admin')
    );
CREATE POLICY question_imports_admin_delete
    ON storage.objects FOR DELETE TO authenticated
    USING (
        bucket_id = 'question-imports-private'
        AND private.has_role('admin')
    );
CREATE POLICY question_imports_authenticated_guard
    ON storage.objects AS RESTRICTIVE FOR ALL TO authenticated
    USING (
        bucket_id <> 'question-imports-private'
        OR private.has_role('admin')
    )
    WITH CHECK (
        bucket_id <> 'question-imports-private'
        OR private.has_role('admin')
    );
CREATE POLICY question_imports_anon_guard
    ON storage.objects AS RESTRICTIVE FOR ALL TO anon
    USING (bucket_id <> 'question-imports-private')
    WITH CHECK (bucket_id <> 'question-imports-private');

-- TODO: Provision the first active Admin out-of-band with a trusted operator
-- process. Never permit public signup or user-editable metadata to create Admin.
-- TODO: The server-side public signup workflow must call
-- complete_student_registration() with its service-role client after it creates
-- and validates the Auth user. Keep that key server-only.
-- TODO: Implement trusted Admin-only import processing outside SQL. Parse the
-- accepted formats, populate previews and errors, require approval before
-- creating question revisions, and update import counts/status transactionally.
-- TODO: Implement trusted practice grading/submission RPCs before enabling practice scoring.
-- Student answer INSERT policies accept only ungraded rows (is_correct IS NULL);
-- do not grant clients UPDATE/DELETE access to answers or completion/stat tables.
-- TODO: Implement a curated leaderboard RPC/view that returns only opted-in
-- display names and aggregate scores. Raw leaderboard tables expose only each
-- student's own row and Admin reads.
-- TODO: The application must keep the private schema out of Supabase's exposed
-- PostgREST schemas. Private helper-function grants do not make it an API schema.


