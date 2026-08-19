import React, { useState, useEffect } from 'react';
import { AppShell } from './app/layout/AppShell';
import { AppRoute } from './types/routes';
import { LearnerProfile } from './types';
import { ProfileService } from './services/profile/profileService';

// Feature Views
import { OverviewView } from './features/dashboard/OverviewView';
import { TodayView } from './features/today/TodayView';
import { PracticeHubView } from './features/practice/PracticeHubView';
import { ProfileView } from './features/profile/ProfileView';
import { OnboardingView } from './features/onboarding/OnboardingView';

// ZeroClimber Feature Views
import { ZeroClimberOnboarding } from './features/zeroclimber/ZeroClimberOnboarding';
import { ZeroClimberOverview } from './features/zeroclimber/ZeroClimberOverview';
import { ZeroClimberLessonView } from './features/zeroclimber/ZeroClimberLessonView';

// Existing Rich Interactive Learning Modules
import { ReadingModule } from './components/ReadingModule';
import { WritingModule } from './components/WritingModule';
import { DiagnosticFlow } from './components/DiagnosticFlow';
import { MicroPathwayView } from './components/MicroPathwayView';
import { EvidenceDashboard } from './components/EvidenceDashboard';

export default function App() {
  const [profile, setProfile] = useState<LearnerProfile>(() => ProfileService.getProfile());
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const p = ProfileService.getProfile();
    if (p.zeroClimber) return '/zeroclimber';
    return p.onboardingCompleted ? '/today' : '/onboarding';
  });
  const [activePathwayId, setActivePathwayId] = useState<string>('pathway_paraphrase');
  const [activeSessionMinutes, setActiveSessionMinutes] = useState<number>(
  profile.preferredSessionMinutes || profile.dailyAvailableMinutes || 20
);

  useEffect(() => {
    // Sync profile on mount
    const saved = ProfileService.getProfile();
    setProfile(saved);
    if (!saved.onboardingCompleted && currentRoute !== '/onboarding') {
      setCurrentRoute('/onboarding');
    }
  }, []);

  const handleUpdateProfile = (updatedProfile: LearnerProfile) => {
    setProfile(updatedProfile);
    ProfileService.saveProfile(updatedProfile);
  };

  const handleCompleteZeroClimberOnboarding = (updatedProfile: LearnerProfile) => {
    setProfile(updatedProfile);
    ProfileService.saveProfile(updatedProfile);
    setCurrentRoute('/zeroclimber');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartPathway = (
  pathwayId: string,
  sessionMinutes = profile.preferredSessionMinutes || profile.dailyAvailableMinutes || 20
) => {
  setActivePathwayId(pathwayId);
  setActiveSessionMinutes(sessionMinutes);
  setCurrentRoute('/intervention');
};

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteOnboarding = (updatedProfile: LearnerProfile, nextRoute: '/diagnostic' | '/today' | '/zeroclimber') => {
    setProfile(updatedProfile);
    ProfileService.saveProfile(updatedProfile);
    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on ZeroClimber onboarding route
  if (currentRoute === '/zeroclimber/onboarding') {
    return (
      <div className="min-h-screen bg-slate-100/70 antialiased text-slate-800">
        <ZeroClimberOnboarding
          initialProfile={profile}
          onComplete={handleCompleteZeroClimberOnboarding}
          onCancel={() => handleNavigate(profile.onboardingCompleted ? '/today' : '/onboarding')}
        />
      </div>
    );
  }

  // If on onboarding route or learner profile has not completed onboarding
  if (currentRoute === '/onboarding' || !profile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-100/70 antialiased text-slate-800">
        <OnboardingView
          initialProfile={profile}
          onCompleteOnboarding={handleCompleteOnboarding}
          onStartZeroClimber={() => setCurrentRoute('/zeroclimber/onboarding')}
        />
      </div>
    );
  }

  return (
    <AppShell
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      profile={profile}
    >
      {/* Route: /zeroclimber (Your Climb Overview) */}
      {currentRoute === '/zeroclimber' && (
        <ZeroClimberOverview
          profile={profile}
          onStartLesson={(lessonId) => handleNavigate('/zeroclimber/lesson')}
          onNavigateToIelts={() => handleNavigate('/today')}
          onRestartZeroOnboarding={() => handleNavigate('/zeroclimber/onboarding')}
        />
      )}

      {/* Route: /zeroclimber/lesson (Lesson 1 Interactive Practice) */}
      {currentRoute === '/zeroclimber/lesson' && (
        <ZeroClimberLessonView
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onBackToClimb={() => handleNavigate('/zeroclimber')}
        />
      )}

      {/* Route: /overview or /dashboard */}
      {(currentRoute === '/overview' || currentRoute === '/dashboard') && (
        <OverviewView
          profile={profile}
          onStartPathway={handleStartPathway}
          onNavigate={handleNavigate}
        />
      )}

      {/* Route: /today */}
      {currentRoute === '/today' && (
        <TodayView
          profile={profile}
          onStartPathway={handleStartPathway}
          onNavigate={handleNavigate}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Route: /practice (Hub) */}
      {currentRoute === '/practice' && (
        <PracticeHubView
          onNavigate={handleNavigate}
        />
      )}

      {/* Route: /practice/reading */}
      {currentRoute === '/practice/reading' && (
        <ReadingModule
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onStartPathway={handleStartPathway}
          onNavigate={handleNavigate}
        />
      )}

      {/* Route: /practice/writing */}
      {currentRoute === '/practice/writing' && (
        <WritingModule
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onStartPathway={handleStartPathway}
        />
      )}

      {/* Route: /diagnostic & /diagnostic/results */}
      {(currentRoute === '/diagnostic' || currentRoute === '/diagnostic/results') && (
        <DiagnosticFlow
          profile={profile}
          initialViewResults={currentRoute === '/diagnostic/results'}
          onDiagnosticComplete={handleUpdateProfile}
          onNavigateToOptimizer={() => handleNavigate('/today')}
          onNavigate={handleNavigate}
        />
      )}

      {/* Route: /intervention */}
      {currentRoute === '/intervention' && (
        <MicroPathwayView
  pathwayId={activePathwayId}
  profile={profile}
  sessionMinutes={activeSessionMinutes}
  onUpdateProfile={handleUpdateProfile}
  onBackToOptimizer={() => handleNavigate('/today')}
/>
      )}

      {/* Route: /progress */}
      {currentRoute === '/progress' && (
        <EvidenceDashboard
          profile={profile}
          onStartPathway={handleStartPathway}
          onNavigateTab={(tab) => {
            if (tab === 'today') handleNavigate('/today');
            else if (tab === 'reading') handleNavigate('/practice/reading');
            else if (tab === 'writing') handleNavigate('/practice/writing');
            else handleNavigate('/progress');
          }}
        />
      )}

      {/* Route: /profile */}
      {currentRoute === '/profile' && (
        <ProfileView
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onNavigate={handleNavigate}
        />
      )}
    </AppShell>
  );
}







