import React, { useState } from 'react';
import { LearnerProfile, CurrentLevelType } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Alert } from '../../components/ui/Alert';
import { ProfileService } from '../../services/profile/profileService';
import { 
  User, 
  Target, 
  Clock, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  ShieldAlert,
  BrainCircuit,
  Calendar,
  Zap,
  Info,
  Sparkles,
  UserCheck,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export interface ProfileViewProps {
  profile: LearnerProfile;
  onUpdateProfile: (p: LearnerProfile) => void;
  onNavigate: (route: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onNavigate
}) => {
  // Editable form state
  const [name, setName] = useState<string>(profile.name || 'Học viên');
  const [targetBand, setTargetBand] = useState<number>(profile.targetBand || 6.5);
  const [levelOption, setLevelOption] = useState<CurrentLevelType>(
    profile.currentLevelType || (profile.previousOfficialScore ? 'official_score' : profile.hasCompletedDiagnostic ? 'estimated_score' : 'not_assessed')
  );
  const [officialScore, setOfficialScore] = useState<number>(profile.previousOfficialScore || 5.5);
  const [hasBookedExam, setHasBookedExam] = useState<boolean>(profile.hasBookedExam || false);
  const [examDate, setExamDate] = useState<string>(
    profile.examDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dailyAvailableMinutes, setDailyAvailableMinutes] = useState<number>(
    profile.dailyAvailableMinutes || profile.dailyGoalMinutes || 20
  );
  const [preferredSessionMinutes, setPreferredSessionMinutes] = useState<number>(
    profile.preferredSessionMinutes || 20
  );

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [showEvidenceResetConfirm, setShowEvidenceResetConfirm] = useState<boolean>(false);
  const [showNewLearnerConfirm, setShowNewLearnerConfirm] = useState<boolean>(false);

  const availableBands = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const isOfficial = levelOption === 'official_score';
    const isEstimated = levelOption === 'estimated_score';
    const isNotAssessed = levelOption === 'not_assessed';

    const updated: LearnerProfile = {
      ...profile,
      name: name.trim() || 'Học viên',
      targetBand: Number(targetBand),
      currentLevelType: levelOption,
      previousOfficialScore: isOfficial ? Number(officialScore) : undefined,
      aiEvidenceEstimate: isNotAssessed 
        ? undefined 
        : (profile.aiEvidenceEstimate || (isOfficial ? Number(officialScore) : 5.5)),
      assessmentStatus: isNotAssessed ? 'not_assessed' : profile.assessmentStatus,
      hasBookedExam,
      examDate: hasBookedExam ? examDate : undefined,
      dailyAvailableMinutes: Number(dailyAvailableMinutes),
      dailyGoalMinutes: Number(dailyAvailableMinutes),
      preferredSessionMinutes: Number(preferredSessionMinutes),
      isDemoProfile: false
    };

    onUpdateProfile(updated);
    ProfileService.saveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetLearningEvidence = () => {
    const reset = ProfileService.resetLearningEvidence(profile);
    onUpdateProfile(reset);
    setShowEvidenceResetConfirm(false);
    onNavigate('/diagnostic');
  };

  const handleStartAsNewLearner = () => {
    const fresh = ProfileService.startAsNewLearner();
    onUpdateProfile(fresh);
    setShowNewLearnerConfirm(false);
    onNavigate('/onboarding');
  };

  return (
    <div className="space-y-6 max-w-4xl pb-8">
      <SectionHeader
        title="Hồ sơ & Thiết lập Học tập"
        subtitle="Quản lý mục tiêu Band điểm, thời lượng học thực tế và cấu hình kiểm chứng dữ liệu của riêng bạn."
      />

      {/* Demo Profile Banner if applicable */}
      {profile.isDemoProfile && (
        <Alert variant="warning" title="Hồ sơ dữ liệu mẫu (Demo Profile)">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
            <span className="text-xs text-amber-800">
              Bạn đang xem hồ sơ mẫu để thử nghiệm tính năng. Bạn có thể chỉnh sửa các thông số bên dưới hoặc bắt đầu quy trình Onboarding hoàn toàn mới.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('/onboarding')}
              className="bg-white text-amber-900 border-amber-300 hover:bg-amber-100 flex-shrink-0"
            >
              Bắt đầu Onboarding của bạn
            </Button>
          </div>
        </Alert>
      )}

      {savedSuccess && (
        <Alert variant="success" title="Đã lưu thành công">
          Hồ sơ học tập của bạn đã được cập nhật. Dashboard và LearningEngine sẽ lập tức đồng bộ mục tiêu mới.
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card variant="default" padding="lg" className="space-y-6 border-slate-200">
          
          {/* Section 1: Personal & Target */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Thông tin & Mục tiêu Band Điểm
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên thí sinh / Người học</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  placeholder="Nhập tên..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mục tiêu Band điểm IELTS</label>
                <select
                  value={targetBand}
                  onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-indigo-900"
                >
                  {availableBands.map((b) => (
                    <option key={b} value={b}>
                      Mục tiêu Band {b.toFixed(1)} {b >= 8.0 ? '(Xuất sắc)' : b >= 7.0 ? '(Nâng cao)' : b >= 6.5 ? '(Học thuật)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Current Level & Assessment Status */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pb-1">
              <Target className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Trình độ Hiện tại & Bằng chứng Năng lực
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Loại thông tin trình độ</label>
                <select
                  value={levelOption}
                  onChange={(e) => setLevelOption(e.target.value as CurrentLevelType)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="official_score">Đã có điểm thi chính thức (Official Score)</option>
                  <option value="estimated_score">Điểm ước tính / Tự đánh giá</option>
                  <option value="not_assessed">Chưa kiểm tra (Not assessed yet)</option>
                </select>
              </div>

              {levelOption === 'official_score' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Điểm thi chính thức trước đây</label>
                  <select
                    value={officialScore}
                    onChange={(e) => setOfficialScore(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 bg-white"
                  >
                    {availableBands.map((b) => (
                      <option key={b} value={b}>Band {b.toFixed(1)}</option>
                    ))}
                  </select>
                </div>
              )}

              {levelOption === 'not_assessed' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Trạng thái ước tính AI</label>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
                    <span>Chưa kiểm tra (Not assessed yet)</span>
                    <button
                      type="button"
                      onClick={() => onNavigate('/diagnostic')}
                      className="text-xs text-indigo-600 font-bold hover:underline"
                    >
                      Làm Diagnostic
                    </button>
                  </div>
                </div>
              )}

              {levelOption === 'estimated_score' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ước tính AI / Bằng chứng bài làm</label>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-indigo-700 flex items-center justify-between">
                    <span>
                      {profile.currentEstimatedBand > 0
                        ? `Band ${profile.currentEstimatedBand.toFixed(1)}`
                        : (profile.aiEvidenceEstimate ? `Band ${profile.aiEvidenceEstimate.toFixed(1)}` : 'Ch?a c? b?ng ch?ng')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans font-normal">Evidence-Based</span>
                  </div>
                </div>
              )}
            </div>

            {levelOption === 'official_score' && targetBand <= officialScore && (
              <Alert variant="warning" title="Lưu ý mục tiêu">
                Mục tiêu Band {targetBand.toFixed(1)} đang thấp hơn hoặc bằng điểm chính thức Band {officialScore.toFixed(1)}.
              </Alert>
            )}
          </div>

          {/* Section 3: Exam Date & Daily Time */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2 pb-1">
              <Clock className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Kế hoạch Thi & Thời lượng Học tập
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kế hoạch thi IELTS</label>
                <select
                  value={hasBookedExam ? 'booked' : 'not_booked'}
                  onChange={(e) => setHasBookedExam(e.target.value === 'booked')}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="not_booked">Chưa đặt lịch thi cụ thể</option>
                  <option value="booked">Đã đăng ký ngày thi</option>
                </select>
              </div>

              {hasBookedExam ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Ngày thi</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tiến độ</label>
                  <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500">
                    Linh hoạt theo phiên học hàng ngày
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Thời gian học mỗi ngày</label>
                <select
                  value={dailyAvailableMinutes}
                  onChange={(e) => setDailyAvailableMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value={15}>15 phút (Siêu tốc)</option>
                  <option value={20}>20 phút (Phiên học tối ưu)</option>
                  <option value={30}>30 phút (Chuẩn 1 chu kỳ)</option>
                  <option value={45}>45 phút (Nâng cao)</option>
                  <option value={60}>60 phút (Chuyên sâu)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-3">
                <label className="text-xs font-bold text-slate-700">Thời lượng mỗi phiên can thiệp ưu thích (Preferred Session)</label>
                <select
                  value={preferredSessionMinutes}
                  onChange={(e) => setPreferredSessionMinutes(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value={15}>15 phút (Can thiệp nhận diện & chuyển đổi nhanh)</option>
                  <option value={20}>20 phút (Chu trình 4 bước hoàn chỉnh có Re-test đối chứng)</option>
                  <option value={30}>30 phút (Luyện tập chuyên sâu & đối chiếu chi tiết)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save className="w-4 h-4" />}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold"
            >
              Lưu thay đổi hồ sơ
            </Button>
          </div>
        </Card>
      </form>

      {/* Advanced / Maintenance Data Actions with 2 Distinct Reset Actions */}
      <Card variant="muted" padding="lg" className="space-y-5 border-slate-200">
        <div>
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-slate-600" />
            Quản lý & Đặt lại Dữ liệu Học tập
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Hệ thống cung cấp hai phương thức đặt lại dữ liệu tùy theo nhu cầu của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          
          {/* RESET OPTION 1: Reset Learning Evidence */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                Xóa Bằng chứng & Làm lại Chẩn đoán
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Xóa toàn bộ điểm chẩn đoán, lịch sử bài làm Reading/Writing, điểm lỗi lặp lại và các bài Re-test. <strong>GIỮ NGUYÊN</strong> mục tiêu Band, điểm chính thức, ngày thi và thời gian học của bạn.
              </p>
            </div>

            {showEvidenceResetConfirm ? (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-2">
                <p className="text-xs text-amber-900 font-bold">Xác nhận xóa bằng chứng và về Diagnostic?</p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleResetLearningEvidence}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs"
                  >
                    Xác nhận xóa
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEvidenceResetConfirm(false)}
                    className="text-xs"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-4 h-4 text-indigo-600" />}
                onClick={() => setShowEvidenceResetConfirm(true)}
                className="w-full text-xs font-bold"
              >
                Reset Bằng chứng học tập
              </Button>
            )}
          </div>

          {/* RESET OPTION 2: Start as New Learner */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-rose-600" />
                Bắt đầu lại như Học viên mới
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Xóa sạch hoàn toàn toàn bộ hồ sơ, mục tiêu và dữ liệu học tập. Đưa bạn quay trở lại màn hình Onboarding để tự thiết lập hồ sơ từ đầu.
              </p>
            </div>

            {showNewLearnerConfirm ? (
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 space-y-2">
                <p className="text-xs text-rose-900 font-bold">Xác nhận xóa toàn bộ và quay về Onboarding?</p>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleStartAsNewLearner}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs"
                  >
                    Bắt đầu mới
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNewLearnerConfirm(false)}
                    className="text-xs"
                  >
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                icon={<RotateCcw className="w-4 h-4 text-rose-500" />}
                onClick={() => setShowNewLearnerConfirm(true)}
                className="w-full text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50"
              >
                Bắt đầu học viên mới (Onboarding)
              </Button>
            )}
          </div>

        </div>
      </Card>
    </div>
  );
};
