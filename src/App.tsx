import { WordCardModal } from './components/WordCard';
import { End } from './screens/End';
import { GameShell } from './screens/Game';
import { TeacherOverlay, WordsOverlay } from './screens/Overlays';
import { HowTo, PickJob, PickLand, Title } from './screens/Setup';
import { IN_GAME, useGame } from './store/game';
import { QuestModal, QuestsOverlay } from './components/Quests';

export default function App() {
  const { phase, overlay, game } = useGame();
  const inGame = IN_GAME.includes(phase);
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
      {(phase === 'talk' || phase === 'news') && !overlay && <QuestModal />}
      {overlay === 'quests' && <QuestsOverlay />}
      {overlay === 'words' && <WordsOverlay />}
      {overlay === 'teacher' && <TeacherOverlay />}
    </div>
  );
}
