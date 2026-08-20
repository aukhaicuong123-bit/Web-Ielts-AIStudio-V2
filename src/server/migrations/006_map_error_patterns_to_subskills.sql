INSERT INTO error_pattern_subskills (error_pattern_id, subskill_id)
SELECT ep.id, ss.id
FROM (
  VALUES
    ('ERR_PARAPHRASE_DISTORTION', 'reading_paraphrase'),
    ('ERR_LITERAL_MATCHING', 'reading_paraphrase'),
    ('ERR_DETAIL_MISMATCH', 'reading_paraphrase'),
    ('ERR_POLARITY_INVERSION', 'reading_paraphrase'),

    ('ERR_FALSE_CORRELATION', 'reading_cause_effect'),
    ('ERR_EVIDENCE_BOUNDARY', 'reading_cause_effect'),
    ('ERR_UNSUBSTANTIATED_LEAP', 'reading_cause_effect'),
    ('ERR_REVERSED_CAUSALITY', 'reading_cause_effect'),
    ('ERR_SOLUTION_VS_PROBLEM', 'reading_cause_effect'),

    ('ERR_EVIDENCE_BOUNDARY', 'reading_detail_inference'),
    ('ERR_OVERCONFIDENCE_BIAS', 'reading_detail_inference'),
    ('ERR_VOCAB_INFERENCE', 'reading_detail_inference'),
    ('ERR_POLARITY_INVERSION', 'reading_detail_inference'),
    ('ERR_UNSUBSTANTIATED_LEAP', 'reading_detail_inference')
) AS mapping(error_code, subskill_code)
JOIN error_patterns ep
  ON ep.code = mapping.error_code
JOIN subskills ss
  ON ss.code = mapping.subskill_code
ON CONFLICT DO NOTHING;