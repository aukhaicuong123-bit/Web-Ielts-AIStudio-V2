INSERT INTO error_patterns (
  id,
  code,
  category,
  name,
  severity,
  description,
  target_weakness,
  weight
)
VALUES
(
  '20000000-0000-0000-0000-000000000001',
  'ERR_PARAPHRASE_DISTORTION',
  'Reading Comprehension',
  'Paraphrase Distortion',
  'high',
  'Meaning is changed during paraphrase, especially modality, degree, or intended meaning.',
  'Distortion of the original meaning when matching paraphrases.',
  8
),
(
  '20000000-0000-0000-0000-000000000002',
  'ERR_EXTRAPOLATION_TRAP',
  'Reading Comprehension',
  'Extreme Generalization',
  'high',
  'The learner extends a passage claim beyond the evidence provided.',
  'Making categorical conclusions without textual support.',
  8
),
(
  '20000000-0000-0000-0000-000000000003',
  'ERR_FALSE_CORRELATION',
  'Reading Comprehension',
  'False Correlation',
  'high',
  'The learner attributes a causal relationship that is not supported by the passage.',
  'Confusing correlation, unrelated information, and causal mechanisms.',
  8
),
(
  '20000000-0000-0000-0000-000000000004',
  'ERR_EVIDENCE_BOUNDARY',
  'Reading Comprehension',
  'Evidence Boundary Error',
  'high',
  'The learner uses information outside the explicit evidence of the passage.',
  'Ignoring the boundary between stated evidence and external assumptions.',
  8
),
(
  '20000000-0000-0000-0000-000000000005',
  'ERR_OVERCONFIDENCE_BIAS',
  'Reading Comprehension',
  'Overconfidence Bias',
  'medium',
  'The learner treats limited or conditional evidence as a complete conclusion.',
  'Failing to recognize uncertainty, conditions, or ongoing investigation.',
  7
),
(
  '20000000-0000-0000-0000-000000000006',
  'ERR_VOCAB_INFERENCE',
  'Reading Comprehension',
  'Vocabulary Inference Failure',
  'medium',
  'The learner fails to infer the meaning of an academic term from context.',
  'Insufficient contextual vocabulary recognition.',
  6
),
(
  '20000000-0000-0000-0000-000000000007',
  'ERR_LITERAL_MATCHING',
  'Reading Comprehension',
  'Literal Keyword Matching',
  'high',
  'The learner selects an option because of shared words without checking semantic meaning.',
  'Matching keywords instead of verifying meaning in context.',
  8
),
(
  '20000000-0000-0000-0000-000000000008',
  'ERR_DETAIL_MISMATCH',
  'Reading Comprehension',
  'Detail Mismatch',
  'medium',
  'The learner selects a detail that appears relevant but does not answer the specific question.',
  'Confusing related terminology or details with the target evidence.',
  6
),
(
  '20000000-0000-0000-0000-000000000009',
  'ERR_POLARITY_INVERSION',
  'Reading Comprehension',
  'Polarity Inversion',
  'high',
  'The learner selects a statement with meaning opposite to the passage.',
  'Failing to track positive versus negative meaning.',
  8
),
(
  '20000000-0000-0000-0000-000000000010',
  'ERR_UNSUBSTANTIATED_LEAP',
  'Reading Comprehension',
  'Unsubstantiated Leap',
  'high',
  'The learner introduces a conclusion that requires evidence not present in the passage.',
  'Skipping logical steps or inventing unsupported consequences.',
  8
),
(
  '20000000-0000-0000-0000-000000000011',
  'ERR_CROSS_PARAGRAPH_DISTORTION',
  'Reading Comprehension',
  'Cross-Paragraph Distortion',
  'medium',
  'The learner transfers a fact or statistic from one paragraph into a different causal context.',
  'Misplacing evidence across paragraph boundaries.',
  7
),
(
  '20000000-0000-0000-0000-000000000012',
  'ERR_REVERSED_CAUSALITY',
  'Reading Comprehension',
  'Reversed Causality',
  'high',
  'The learner mistakes an effect for its underlying cause.',
  'Reversing the direction of a causal chain.',
  8
),
(
  '20000000-0000-0000-0000-000000000013',
  'ERR_SOLUTION_VS_PROBLEM',
  'Reading Comprehension',
  'Solution Mistaken for Cause',
  'medium',
  'The learner selects a proposed intervention as though it were the cause of the problem.',
  'Confusing a mitigation strategy with the underlying problem or cause.',
  6
)
ON CONFLICT (code) DO UPDATE SET
  category = EXCLUDED.category,
  name = EXCLUDED.name,
  severity = EXCLUDED.severity,
  description = EXCLUDED.description,
  target_weakness = EXCLUDED.target_weakness,
  weight = EXCLUDED.weight;