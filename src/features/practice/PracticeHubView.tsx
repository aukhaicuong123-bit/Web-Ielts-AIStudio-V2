import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  BrainCircuit, 
  FileText,
  Zap
} from 'lucide-react';
import { READING_PASSAGES, WRITING_PROMPTS } from '../../data/mockContent';

export interface PracticeHubViewProps {
  onNavigate: (route: any) => void;
}

export const PracticeHubView: React.FC<PracticeHubViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Trung tâm Luyện tập có Trích xuất Bằng chứng"
        subtitle="Mỗi bài tập đều được gắn nhãn subskill và tự động ghi nhận lỗi vào Error Memory."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reading Practice Card */}
        <Card variant="default" padding="md" className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <Badge variant="indigo" size="sm">
                {READING_PASSAGES.length} Bài đọc chuẩn hóa
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Reading Academic with Evidence Quotes
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Luyện đọc các đoạn văn học thuật chuẩn đề thi IELTS. Hệ thống tự động phân tích và đối chiếu từng câu trả lời với trích dẫn nguyên văn từ văn bản.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600">
              <div className="font-semibold text-slate-800">Các dạng câu hỏi cốt lõi:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">Paraphrase Matching</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">Cause & Effect Logic</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">True/False/Not Given</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">Summary Completion</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('/practice/reading')}
            className="w-full"
          >
            Vào phòng luyện Reading
          </Button>
        </Card>

        {/* Writing Practice Card */}
        <Card variant="default" padding="md" className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <PenTool className="w-5 h-5" />
              </div>
              <Badge variant="emerald" size="sm">
                Text & Quét ảnh OCR
              </Badge>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Writing & Gemini Vision OCR Analysis
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Nhập bài viết hoặc chụp ảnh bài làm viết tay bằng điện thoại. AI phân tích chi tiết theo 4 tiêu chí rubric, trích xuất chính xác câu văn chứa lỗi và gợi ý bản viết lại Band 7.5+.
            </p>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 text-slate-600">
              <div className="font-semibold text-slate-800">Khả năng bóc tách chuyên sâu:</div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">4 Rubric Criteria</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">OCR bài viết tay</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">Đề xuất câu sửa mẫu</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">Gán Micro-Pathway</span>
              </div>
            </div>
          </div>

          <Button
            variant="success"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('/practice/writing')}
            className="w-full"
          >
            Vào phòng luyện Writing
          </Button>
        </Card>
      </div>
    </div>
  );
};
