import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Lazy/safe Gemini AI client initialization
function getGeminiClient(): GoogleGenAI {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Analyze Writing (Task 1 / Task 2) with Evidence-Based Rubric Feedback
app.post('/api/analyze-writing', async (req, res) => {
  try {
    const { essayText, prompt, taskType, topic } = req.body;

    if (!essayText || essayText.trim().length < 20) {
      return res.status(400).json({ error: 'Bài viết quá ngắn. Vui lòng nhập tối thiểu 20 từ.' });
    }

    const ai = getGeminiClient();

    const systemInstruction = `Bạn là Giám khảo IELTS Chuyên gia và Trưởng bộ môn Khảo thí AI IELTS Study Optimizer.
Nhiệm vụ của bạn KHÔNG PHẢI là một công cụ chấm điểm chung chung, mà là một HỆ THỐNG HỌC TẬP DỰA TRÊN BẰNG CHỨNG (Evidence-Based Learning Engine).
Mục tiêu cốt lõi: Chỉ ra chính xác người học đang mất điểm ở đâu, tại sao, câu văn nào chứa lỗi, phương án sửa lại chuẩn mực, và bài tập ngắn (Action + Transfer) để giải quyết dứt điểm.

Hệ thống phản hồi phải tuân thủ nghiêm ngặt cấu trúc:
1. PROBLEM: Tên lỗi cụ thể và phân loại rõ ràng (ngữ pháp, liên kết, từ vựng, phản hồi đề bài).
2. EVIDENCE: Trích dẫn NGUYÊN VĂN câu văn chứa lỗi từ bài của thí sinh.
3. WHY: Giải thích ngắn gọn lý do bị trừ điểm theo rubric IELTS.
4. BETTER VERSION (suggestedCorrection): Cách viết lại chuẩn xác Band 7.5 - 8.5.
5. ACTION: Bài tập ngắn 5-10 phút trực tiếp sửa lỗi này.
6. TARGET SUBSKILL: Gắn đúng mã subskill (writing_complex_grammar, writing_coherence_cohesion, writing_lexical_resource, writing_task_response, reading_paraphrase, reading_cause_effect).
7. TRANSFER: Một bài tập ngữ cảnh mới ngắn (1 câu) yêu cầu áp dụng ngay kỹ năng này.
8. VERIFICATION NOTE: Ghi chú cách hệ thống sẽ kiểm chứng tiến bộ qua bài Re-test tiếp theo.

Ưu tiên chọn 3 đến 5 lỗi TRỌNG ĐIỂM (High / Medium Severity) có ảnh hưởng lớn nhất đến điểm thi, tránh làm người học bị quá tải.`;

    const userPrompt = `Đề bài IELTS Writing (${taskType || 'Task 2'}):
Chủ đề: ${topic || 'General Academic'}
Đề bài: "${prompt || 'IELTS Writing prompt'}"

Bài viết của thí sinh:
"""
${essayText}
"""

Hãy đánh giá chi tiết và trả về JSON theo schema quy định.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallBand: { type: Type.NUMBER, description: 'Điểm tổng ước tính từ 4.5 đến 9.0 (bước 0.5)' },
            confidence: { type: Type.STRING, description: 'high, moderate, limited' },
            rubricScores: {
              type: Type.OBJECT,
              properties: {
                taskResponse: { type: Type.NUMBER },
                coherenceCohesion: { type: Type.NUMBER },
                lexicalResource: { type: Type.NUMBER },
                grammaticalRange: { type: Type.NUMBER },
                overallBand: { type: Type.NUMBER }
              },
              required: ['taskResponse', 'coherenceCohesion', 'lexicalResource', 'grammaticalRange', 'overallBand']
            },
            bandSummary: { type: Type.STRING, description: 'Đánh giá tổng quan 2-3 câu ngắn gọn về điểm mạnh và nút thắt lớn nhất.' },
            dominantErrorPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách các mã lỗi chủ đạo (ví dụ ERR_COMPLEX_GRAMMAR, ERR_COHESION)'
            },
            errorTags: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  code: { type: Type.STRING, description: 'Mã lỗi như ERR_COMPLEX_GRAMMAR, ERR_RUN_ON_SENTENCE, ERR_COHESION_LEAP, ERR_WEAK_THESIS' },
                  category: { type: Type.STRING, description: 'Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy' },
                  name: { type: Type.STRING, description: 'Tên lỗi tiếng Việt dễ hiểu' },
                  subskill: { type: Type.STRING, description: 'Mã subskill: reading_paraphrase, reading_cause_effect, writing_task_response, writing_coherence_cohesion, writing_lexical_resource, writing_complex_grammar' },
                  severity: { type: Type.STRING, description: 'high, medium, low' },
                  count: { type: Type.NUMBER }
                },
                required: ['id', 'code', 'category', 'name', 'subskill', 'severity', 'count']
              }
            },
            evidenceFeedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING, description: 'Tên và mô tả lỗi cụ thể' },
                  evidence: { type: Type.STRING, description: 'Trích dẫn nguyên văn câu/từ từ bài viết của thí sinh' },
                  why: { type: Type.STRING, description: 'Giải thích lý do theo rubric IELTS' },
                  suggestedCorrection: { type: Type.STRING, description: 'Cách viết lại chuẩn band 7.5+' },
                  action: { type: Type.STRING, description: 'Bài tập 5-15 phút cụ thể để sửa dứt điểm lỗi này' },
                  errorTagId: { type: Type.STRING },
                  targetSubskill: { type: Type.STRING },
                  severity: { type: Type.STRING, description: 'high, medium, low' },
                  category: { type: Type.STRING, description: 'Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy' },
                  transferPrompt: { type: Type.STRING, description: 'Bài tập ngữ cảnh mới ngắn (1 câu) yêu cầu áp dụng ngay kỹ năng' },
                  verificationNote: { type: Type.STRING, description: 'Ghi chú cách hệ thống sẽ kiểm chứng tiến bộ qua bài Re-test' }
                },
                required: ['problem', 'evidence', 'why', 'suggestedCorrection', 'action', 'errorTagId', 'targetSubskill']
              }
            },
            recommendedMicroPathwayId: {
              type: Type.STRING,
              description: 'Một trong ba pathway: pathway_paraphrase, pathway_cause_effect, pathway_complex_grammar'
            },
            recommendedInterventionReason: {
              type: Type.STRING,
              description: 'Lý do tại sao hôm nay thí sinh nên ưu tiên pathway này (20-30 phút tốt nhất)'
            }
          },
          required: ['overallBand', 'rubricScores', 'bandSummary', 'errorTags', 'evidenceFeedback', 'recommendedMicroPathwayId', 'recommendedInterventionReason']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-writing:', error);
    return res.status(500).json({ error: error.message || 'Không thể chấm bài viết lúc này. Vui lòng thử lại.' });
  }
});

// Analyze Image / Photo of Handwritten Essay or Reading Material (OCR + Deep Analysis)
app.post('/api/analyze-image-essay', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', prompt = '', taskType = 'Task 2' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Chưa có dữ liệu hình ảnh.' });
    }

    const ai = getGeminiClient();

    // Clean base64 header if present
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          {
            text: `Bạn là Hệ thống AI IELTS Vision Analyzer.
Hãy đọc chữ viết tay hoặc văn bản trong bức ảnh này, trích xuất nguyên văn văn bản (Transcribed Text) của bài viết IELTS (${taskType}).
Sau đó, đánh giá toàn diện bài viết theo rubric IELTS và cung cấp bằng chứng lỗi rõ ràng.

Đề bài (nếu có): "${prompt}"`,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcribedText: { type: Type.STRING, description: 'Toàn bộ văn bản đã được OCR/trích xuất từ ảnh' },
            wordCount: { type: Type.NUMBER },
            overallBand: { type: Type.NUMBER },
            rubricScores: {
              type: Type.OBJECT,
              properties: {
                taskResponse: { type: Type.NUMBER },
                coherenceCohesion: { type: Type.NUMBER },
                lexicalResource: { type: Type.NUMBER },
                grammaticalRange: { type: Type.NUMBER },
                overallBand: { type: Type.NUMBER }
              },
              required: ['taskResponse', 'coherenceCohesion', 'lexicalResource', 'grammaticalRange', 'overallBand']
            },
            bandSummary: { type: Type.STRING },
            evidenceFeedback: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  problem: { type: Type.STRING },
                  evidence: { type: Type.STRING },
                  why: { type: Type.STRING },
                  suggestedCorrection: { type: Type.STRING },
                  action: { type: Type.STRING },
                  targetSubskill: { type: Type.STRING }
                },
                required: ['problem', 'evidence', 'why', 'suggestedCorrection', 'action', 'targetSubskill']
              }
            },
            recommendedMicroPathwayId: { type: Type.STRING },
            recommendedInterventionReason: { type: Type.STRING }
          },
          required: ['transcribedText', 'wordCount', 'overallBand', 'rubricScores', 'bandSummary', 'evidenceFeedback', 'recommendedMicroPathwayId', 'recommendedInterventionReason']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-image-essay:', error);
    return res.status(500).json({ error: error.message || 'Không thể phân tích ảnh bài viết. Vui lòng thử lại.' });
  }
});

// Evaluate Step Sentence / Paragraph in Micro-Pathway
app.post('/api/evaluate-step-submission', async (req, res) => {
  try {
    const { stepType, promptInstruction, userSubmission, originalSentence } = req.body;

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Bạn là trợ lý đánh giá bài tập luyện tập trong hệ thống AI IELTS Study Optimizer.
Loại bài tập: ${stepType}
Yêu cầu đề bài: "${promptInstruction}"
Câu gốc / Ngữ cảnh mới: "${originalSentence || ''}"
Câu trả lời của học viên: "${userSubmission}"

Hãy phân tích câu trả lời của học viên theo 5 thành phần sau và phản hồi JSON súc tích, không lan man:
1. whatYouDidWell: Điểm học viên đã làm tốt (dùng từ vựng/cấu trúc/liên kết hợp lý).
2. whatNeedsCorrection: Điểm còn thiếu sót hoặc cần tinh chỉnh (lỗi ngữ pháp, sắc thái từ, hoặc độ tự nhiên).
3. evidence: Trích dẫn chính xác 1 cụm từ hoặc vế câu trong bài của học viên làm bằng chứng nhận xét.
4. betterVersion: 1 phiên bản viết lại tối ưu nhất đạt chuẩn IELTS Academic Band 8.0+.
5. principle: 1 nguyên tắc học thuật ngắn gọn có thể chuyển giao (Transferable Rule) để học viên ghi nhớ áp dụng lần sau.
6. scorePercent: Điểm đánh giá chất lượng từ 0 đến 100.
7. isCorrectOrHighQuality: boolean (true nếu đạt chuẩn từ 70% trở lên).
8. feedback: Lời nhận xét sư phạm tổng quan ngắn gọn (1-2 câu).`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrectOrHighQuality: { type: Type.BOOLEAN },
            scorePercent: { type: Type.NUMBER, description: '0 to 100' },
            feedback: { type: Type.STRING, description: 'Nhận xét sư phạm ngắn gọn (1-2 câu)' },
            whatYouDidWell: { type: Type.STRING, description: 'Điểm làm tốt' },
            whatNeedsCorrection: { type: Type.STRING, description: 'Điểm cần chỉnh sửa' },
            evidence: { type: Type.STRING, description: 'Trích dẫn câu/cụm từ học viên làm bằng chứng' },
            betterVersion: { type: Type.STRING, description: 'Phiên bản cải thiện mẫu Band 8.0+' },
            principle: { type: Type.STRING, description: 'Nguyên tắc học thuật có thể chuyển giao' },
            band8ModelVersion: { type: Type.STRING, description: 'Phiên bản mẫu tương thích ngược' }
          },
          required: ['isCorrectOrHighQuality', 'scorePercent', 'feedback', 'whatYouDidWell', 'whatNeedsCorrection', 'evidence', 'betterVersion', 'principle']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.band8ModelVersion) {
      parsed.band8ModelVersion = parsed.betterVersion || '';
    }
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/evaluate-step-submission:', error);
    return res.status(500).json({ error: error.message || 'Không thể đánh giá câu trả lời.' });
  }
});

// Verify Re-Test Progress & Calculate Delta
app.post('/api/verify-retest', async (req, res) => {
  try {
    const { pathwayId, subskill, scoreBefore, answers, expectedAnswers } = req.body;

    // Evaluate answers
    let correctCount = 0;
    const total = answers.length || 1;
    for (let i = 0; i < total; i++) {
      if (answers[i] === expectedAnswers[i]) {
        correctCount++;
      }
    }
    const scoreAfter = Math.round((correctCount / total) * 100);

    const isVerified = scoreAfter >= 75 || scoreAfter > scoreBefore;

    const summary = isVerified
      ? `Đã kiểm chứng tiến bộ thành công! Độ chuẩn xác ${subskill} tăng từ ${scoreBefore}% lên ${scoreAfter}%. Lỗi nhận diện trước đây đã được triệt tiêu.`
      : `Điểm re-test đạt ${scoreAfter}%. Cần tiếp tục luyện tập thêm 1 chu kỳ ngắn để củng cố phản xạ.`;

    return res.json({
      status: isVerified ? 'verified_progress' : 'needs_practice',
      scoreBefore,
      scoreAfter,
      isVerified,
      summary,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in /api/verify-retest:', error);
    return res.status(500).json({ error: error.message || 'Không thể chấm re-test.' });
  }
});

// Vite Middleware Setup for Dev / Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
