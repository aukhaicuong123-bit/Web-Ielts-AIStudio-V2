INSERT INTO skills (id, code, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'reading', 'Reading', 'IELTS Reading skill domain'),
  ('00000000-0000-0000-0000-000000000002', 'writing', 'Writing', 'IELTS Writing skill domain'),
  ('00000000-0000-0000-0000-000000000003', 'cross_skill', 'Cross-Skill', 'Transfer skills connecting Reading and Writing')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO subskills (id, skill_id, code, name, description)
VALUES
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'reading_paraphrase',
   'Paraphrase & Keyword Matching',
   'Nhn din cc cch din t tng ng gia cu hi v on vn hc thut.'),

  ('10000000-0000-0000-0000-000000000002',
   '00000000-0000-0000-0000-000000000001',
   'reading_cause_effect',
   'Cause-Effect & Argument Logic',
   'Suy lun mi quan h nhn qu v cu trc lun im ca tc gi.'),

  ('10000000-0000-0000-0000-000000000003',
   '00000000-0000-0000-0000-000000000001',
   'reading_detail_inference',
   'Detail Inference & True/False/Not Given',
   'Xc minh thng tin chi tit v phn bit ranh gii gia False v Not Given.'),

  ('10000000-0000-0000-0000-000000000004',
   '00000000-0000-0000-0000-000000000001',
   'reading_summary_completion',
   'Summary Completion & Syntax Predict',
   'D on t loi v ng ngha  in vo on tm tt bi c.'),

  ('10000000-0000-0000-0000-000000000005',
   '00000000-0000-0000-0000-000000000002',
   'writing_task_response',
   'Task Response & Clear Position',
   'Tr li bi v duy tr lp trng r rng vi lin t t nhin.'),

  ('10000000-0000-0000-0000-000000000006',
   '00000000-0000-0000-0000-000000000002',
   'writing_lexical_resource',
   'Lexical Resource & Collocation Precision',
   'S dng t vng hc thut chnh xc, ng ng cnh v kt hp t t nhin.'),

  ('10000000-0000-0000-0000-000000000007',
   '00000000-0000-0000-0000-000000000002',
   'writing_complex_grammar',
   'Complex Grammatical Structures',
   'S dng a dng cc cu trc phc chnh xc.'),

  ('10000000-0000-0000-0000-000000000008',
   '00000000-0000-0000-0000-000000000002',
   'writing_coherence_cohesion',
   'Coherence & Cohesion',
   'T chc  tng v lin kt lp lun r rng, mch lc.'),

  ('10000000-0000-0000-0000-000000000009',
   '00000000-0000-0000-0000-000000000003',
   'cross_paraphrase_transfer',
   'Reading-to-Writing Paraphrase Transfer',
   'Vn dng t vng nhn din c t Reading sang cu trc cu Writing hc thut.'),

  ('10000000-0000-0000-0000-000000000010',
   '00000000-0000-0000-0000-000000000003',
   'cross_argument_logic',
   'Cause-Effect Argumentation Transfer',
   'p dng m hnh lp lun nhn qu t bi c vo pht trin  on thn bi Writing.')
ON CONFLICT (code) DO UPDATE SET
  skill_id = EXCLUDED.skill_id,
  name = EXCLUDED.name,
  description = EXCLUDED.description;