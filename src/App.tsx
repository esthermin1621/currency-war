import { WordCardModal } from './components/WordCard';
import { End } from './screens/End';
import { GameShell } from './screens/Game';
import { TeacherOverlay, WordsOverlay } from './screens/Overlays';
import { HowTo, PickJob, PickLand, Title } from './screens/Setup';
import { useGame } from './store/game';

export default function App() {
  const { phase, overlay, game } = useGame();
  const inGame = ['news', 'president', 'bank', 'guess', 'result', 'report'].includes(phase);
  return (
    <div className="h-full">
      {phase === 'title' && <Title />}
      {phase === 'howto' && <HowTo />}
      {phase === 'pickLand' && <PickLand />}
      {phase === 'pickJob' && <PickJob />}
      {inGame && game && <GameShell />}
      {inGame && !game && <Title />}
      {phase === 'end' && <End />}
      {(inGame || phase === 'end') && !overlay && <WordCardModal />}
      {overlay === 'words' && <WordsOverlay />}
      {overlay === 'teacher' && <TeacherOverlay />}
    </div>
  );
}
