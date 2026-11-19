CREATE OR REPLACE FUNCTION public.admin_provision_teacher(
    p_user_id uuid,
    p_display_name text,
    p_phone_e164 text,
    p_account_status public.account_status,
    p_exam_names text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_exam_count bigint;
BEGIN
    IF auth.role() IS DISTINCT FROM 'authenticated'
       OR auth.uid() IS NULL
       OR NOT private.has_role('admin') THEN
        RAISE EXCEPTION 'Active Admin role required';
    END IF;

    IF p_user_id IS NULL
       OR p_display_name IS NULL
       OR char_length(btrim(p_display_name)) NOT BETWEEN 2 AND 100
       OR p_phone_e164 IS NULL
       OR p_phone_e164 !~ '^\+[1-9][0-9]{7,14}$'
       OR p_account_status IS NULL
       OR p_account_status NOT IN ('active', 'inactive')
       OR p_exam_names IS NULL
       OR cardinality(p_exam_names) = 0 THEN
        RAISE EXCEPTION 'Teacher details are invalid';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = p_user_id
          AND role <> 'teacher'
    ) THEN
        RAISE EXCEPTION 'The account already has a different role';
    END IF;

    SELECT count(DISTINCT requested.name)
    INTO v_exam_count
    FROM unnest(p_exam_names) AS requested(name);

    IF v_exam_count <> cardinality(p_exam_names) THEN
        RAISE EXCEPTION 'Duplicate exam assignments are not allowed';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM unnest(p_exam_names) AS requested(name)
        LEFT JOIN public.exams AS e
          ON e.name = requested.name
         AND e.is_active
        WHERE e.id IS NULL
    ) THEN
        RAISE EXCEPTION 'One or more exams are unavailable';
    END IF;

    PERFORM public.admin_set_user_role(p_user_id, 'teacher', true);

    UPDATE public.profiles
    SET display_name = btrim(p_display_name),
        phone_e164 = p_phone_e164
    WHERE id = p_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Teacher profile could not be updated';
    END IF;

    PERFORM public.admin_set_account_status(p_user_id, p_account_status);

    DELETE FROM public.teacher_exam_assignments AS assignment
    WHERE assignment.teacher_user_id = p_user_id
      AND NOT EXISTS (
          SELECT 1
          FROM public.exams AS e
          WHERE e.id = assignment.exam_id
            AND e.name = ANY (p_exam_names)
      );

    INSERT INTO public.teacher_exam_assignments (teacher_user_id, exam_id, assigned_by)
    SELECT p_user_id, e.id, auth.uid()
    FROM public.exams AS e
    WHERE e.is_active
      AND e.name = ANY (p_exam_names)
    ON CONFLICT (teacher_user_id, exam_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_provision_teacher(
    uuid, text, text, public.account_status, text[]
) FROM PUBLIC, anon, service_role;
GRANT EXECUTE ON FUNCTION public.admin_provision_teacher(
    uuid, text, text, public.account_status, text[]
) TO authenticated;
